'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getAyahMultipleEditions } from '../../../lib/api';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { useAudioPlayer } from '../../../context/AudioPlayerContext';

export default function AyahDetail() {
  const { id, ayah } = useParams();
  const router = useRouter();

  const surahId = useMemo(() => Number(id), [id]);
  const ayahNumber = useMemo(() => Number(ayah), [ayah]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { playAudio, currentAyah, isPlaying, togglePlayPause } = useAudioPlayer();

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      if (!surahId || !ayahNumber) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getAyahMultipleEditions(surahId, ayahNumber, ['ar.alafasy', 'en.sahih']);

        if (controller.signal.aborted) return;
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
        if (!controller.signal.aborted) {
          setError('Unable to load ayah. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => controller.abort();
  }, [surahId, ayahNumber]);

  const handleToggleBookmark = () => {
    if (!data) return;
    toggleBookmark({
      surahNumber: data.surahNumber,
      surahName: data.surahName,
      number: data.number,
      text: data.text,
      translationText: data.translationText,
    });
  };

  const handlePlayAudio = useCallback(() => {
    if (!data?.audio) return;
    playAudio({
      audio: data.audio,
      surahName: data.surahName,
      number: data.number,
    });
  }, [data, playAudio]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to Load Ayah</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Ayah not found'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">Retry</button>
            <Link href={`/surah/${id}`} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Back to Surah</Link>
          </div>
        </div>
      </div>
    );
  }

  const prev = data.number > 1 ? data.number - 1 : null;
  const next = data.number < (data.numberOfAyahs || 0) ? data.number + 1 : null;
  const isCurrentAyah = currentAyah?.surahName === data.surahName && currentAyah?.number === data.number;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/surahs" className="hover:text-teal-600 transition-colors">Surahs</Link>
        <span>/</span>
        <Link href={`/surah/${data.surahNumber}`} className="hover:text-teal-600 transition-colors">{data.surahName}</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">Ayah {data.number}</span>
      </nav>

      <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
        <Link href={`/surah/${data.surahNumber}`} className="text-teal-600 hover:text-teal-700">← Back to Surah</Link>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Surah {data.surahName} (<span lang="ar">{data.surahArabicName}</span>) • Ayah {data.number}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow ring-1 ring-gray-200/60 dark:ring-gray-700/60">
        <div lang="ar" dir="rtl" className="text-right text-3xl md:text-4xl font-quran leading-loose mb-6">
          {data.text}
        </div>
        <div className="text-gray-700 dark:text-gray-300 mb-6">
          {data.translationText}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {data.audio && (
            <button
              onClick={handlePlayAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isCurrentAyah && isPlaying
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800/50'
              }`}
            >
              {isCurrentAyah && isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
              {isCurrentAyah && isPlaying ? 'Pause' : 'Play Audio'}
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
