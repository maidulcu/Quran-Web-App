'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function AyahDetail() {
  const { id, ayah } = useParams();
  const router = useRouter();

  const surahId = useMemo(() => Number(id), [id]);
  const ayahNumber = useMemo(() => Number(ayah), [ayah]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!surahId || !ayahNumber) return;
      setLoading(true);
      setError(null);
      try {
        const [arRes, enRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/ayah/${surahId}:${ayahNumber}/ar.alafasy`),
          fetch(`https://api.alquran.cloud/v1/ayah/${surahId}:${ayahNumber}/en.sahih`),
        ]);
        const ar = await arRes.json();
        const en = await enRes.json();

        if (ar.status !== 'OK' || en.status !== 'OK') {
          throw new Error('Failed to fetch ayah');
        }

        const combined = {
          surahNumber: ar.data.surah?.number,
          surahName: ar.data.surah?.englishName,
          surahArabicName: ar.data.surah?.name,
          number: ar.data.numberInSurah,
          text: ar.data.text,
          translationText: en.data.text,
          audio: ar.data.audio || null,
          revelationType: ar.data.surah?.revelationType,
          numberOfAyahs: ar.data.surah?.numberOfAyahs,
        };
        setData(combined);

        // Bookmark state
        const saved = localStorage.getItem('bookmarkedAyahs');
        if (saved) {
          const arr = JSON.parse(saved);
          setBookmarked(arr.some((b) => b.surahNumber === combined.surahNumber && b.number === combined.number));
        }
      } catch (e) {
        console.error(e);
        setError('Unable to load ayah');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [surahId, ayahNumber]);

  const toggleBookmark = () => {
    if (!data) return;
    const saved = localStorage.getItem('bookmarkedAyahs');
    const arr = saved ? JSON.parse(saved) : [];
    const idx = arr.findIndex((b) => b.surahNumber === data.surahNumber && b.number === data.number);
    if (idx >= 0) {
      arr.splice(idx, 1);
      setBookmarked(false);
    } else {
      arr.push({
        surahNumber: data.surahNumber,
        number: data.number,
        text: data.text,
        translationText: data.translationText,
      });
      setBookmarked(true);
    }
    localStorage.setItem('bookmarkedAyahs', JSON.stringify(arr));
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error || !data) return <div className="container mx-auto px-4 py-8">{error || 'Not found'}</div>;

  const prev = data.number > 1 ? data.number - 1 : null;
  const next = data.number < (data.numberOfAyahs || 0) ? data.number + 1 : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/surah/${data.surahNumber}`} className="text-teal-600 hover:text-teal-700">← Back to Surah</Link>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Surah {data.surahName} ({data.surahArabicName}) • Ayah {data.number}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow ring-1 ring-gray-200/60 dark:ring-gray-700/60">
        <div className="text-right text-3xl md:text-4xl font-quran leading-loose mb-6">
          {data.text}
        </div>
        <div className="text-gray-700 dark:text-gray-300 mb-6">
          {data.translationText}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {data.audio && (
            // For now, use native audio element. Could wire to context later.
            <audio controls src={data.audio} className="w-full md:w-auto" />
          )}
          <button
            onClick={toggleBookmark}
            className={`px-4 py-2 rounded-lg border transition ${bookmarked ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100'}`}
          >
            {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          {prev ? (
            <Link href={`/surah/${data.surahNumber}/${prev}`} className="text-teal-600 hover:text-teal-700">← Previous Ayah</Link>
          ) : (
            <span className="text-gray-400">Start of Surah</span>
          )}
        </div>
        <div>
          {next ? (
            <Link href={`/surah/${data.surahNumber}/${next}`} className="text-teal-600 hover:text-teal-700">Next Ayah →</Link>
          ) : (
            <span className="text-gray-400">End of Surah</span>
          )}
        </div>
      </div>
    </div>
  );
}

