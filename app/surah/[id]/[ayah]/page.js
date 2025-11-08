'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getAyahMultipleEditions } from '../../../lib/api';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { useAudioPlayer } from '../../../context/AudioPlayerContext';
import { logger } from '../../../lib/logger';

export default function AyahDetail() {
  const { id, ayah } = useParams();
  const router = useRouter();

  const surahId = useMemo(() => Number(id), [id]);
  const ayahNumber = useMemo(() => Number(ayah), [ayah]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { playAudio, currentAyah, isPlaying } = useAudioPlayer();

  useEffect(() => {
    const load = async () => {
      if (!surahId || !ayahNumber) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getAyahMultipleEditions(surahId, ayahNumber, ['ar.alafasy', 'en.sahih']);

        if (result.status !== 'OK') {
          throw new Error('Failed to fetch ayah');
        }

        const ar = result.data[0];
        const en = result.data[1];

        const combined = {
          surahNumber: ar.surah?.number,
          surahName: ar.surah?.englishName,
          surahArabicName: ar.surah?.name,
          number: ar.numberInSurah,
          text: ar.text,
          translationText: en.text,
          audio: ar.audio || null,
          revelationType: ar.surah?.revelationType,
          numberOfAyahs: ar.surah?.numberOfAyahs,
        };
        setData(combined);
      } catch (e) {
        logger.error(e);
        setError('Unable to load ayah');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [surahId, ayahNumber]);

  const handleToggleBookmark = () => {
    if (!data) return;
    toggleBookmark({
      surahNumber: data.surahNumber,
      number: data.number,
      text: data.text,
      translationText: data.translationText,
    });
  };

  const handlePlayAudio = () => {
    if (!data || !data.audio) return;
    playAudio({
      surahNumber: data.surahNumber,
      surahName: data.surahName,
      number: data.number,
      audio: data.audio,
    });
  };

  const isCurrentlyPlaying = currentAyah?.surahNumber === data?.surahNumber &&
                            currentAyah?.number === data?.number &&
                            isPlaying;

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
            <button
              onClick={handlePlayAudio}
              className={`px-4 py-2 rounded-lg border transition ${isCurrentlyPlaying ? 'bg-teal-100 border-teal-300 text-teal-800 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-300' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100'}`}
              aria-label="Play audio"
            >
              {isCurrentlyPlaying ? '🔊 Playing' : '🔊 Play Audio'}
            </button>
          )}
          <button
            onClick={handleToggleBookmark}
            className={`px-4 py-2 rounded-lg border transition ${isBookmarked(data.surahNumber, data.number) ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100'}`}
          >
            {isBookmarked(data.surahNumber, data.number) ? '★ Bookmarked' : '☆ Bookmark'}
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

