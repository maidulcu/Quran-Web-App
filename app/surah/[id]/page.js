'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSurahMultipleEditions } from '../../lib/api';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

const BISMILLAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
const SKIP_BISMILLAH_SURAH = [9];

export default function SurahDetail() {
  const { id } = useParams();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playAudio, currentAyah, isPlaying } = useAudioPlayer();

  useEffect(() => {
    const controller = new AbortController();
    const fetchSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSurahMultipleEditions(id, ['ar.alafasy', 'en.sahih']);

        if (!controller.signal.aborted) {
          const arabicData = data.data[0];
          const translationData = data.data[1];

          const combinedAyahs = arabicData.ayahs.map((ayah, index) => ({
            text: ayah.text,
            translationText: translationData.ayahs[index]?.text || '',
            number: ayah.numberInSurah,
            audio: ayah.audio || null,
          }));

          setSurah({
            ...arabicData,
            ayahs: combinedAyahs
          });
          setLoading(false);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError('Failed to load surah. Please try again.');
          setLoading(false);
        }
      }
    };

    if (id) fetchSurah();
    return () => controller.abort();
  }, [id]);

  const handlePlayAyah = useCallback((ayah) => {
    playAudio({
      audio: ayah.audio,
      surahName: surah?.englishName,
      number: ayah.number,
    });
  }, [playAudio, surah]);

  const isCurrentAyah = useCallback((ayahNumber) => {
    return currentAyah?.surahName === surah?.englishName && currentAyah?.number === ayahNumber;
  }, [currentAyah, surah]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-4" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to Load Surah</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Surah not found'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">Retry</button>
            <Link href="/surahs" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Browse Surahs</Link>
          </div>
        </div>
      </div>
    );
  }

  const showBismillah = !SKIP_BISMILLAH_SURAH.includes(surah.number);
  const prevSurah = surah.number > 1 ? surah.number - 1 : null;
  const nextSurah = surah.number < 114 ? surah.number + 1 : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/surahs" className="hover:text-teal-600 transition-colors">Surahs</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{surah.englishName}</span>
      </nav>

      {/* Surah Info Header */}
      <div className="text-center mb-8 bg-gradient-to-b from-teal-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 ring-1 ring-gray-200/60 dark:ring-gray-700/60">
        <div lang="ar" className="text-4xl font-quran mb-3 text-teal-800 dark:text-teal-200">
          {surah.name}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{surah.englishName}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {surah.englishNameTranslation}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full">
            {surah.revelationType}
          </span>
          <span>{surah.numberOfAyahs} Ayahs</span>
        </div>
      </div>

      {/* Bismillah */}
      {showBismillah && (
        <div className="text-center mb-8 py-6">
          <p lang="ar" className="text-3xl font-quran text-gray-800 dark:text-gray-100 leading-loose">
            {BISMILLAH}
          </p>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-4">
        {surah.ayahs.map((ayah) => (
          <article key={ayah.number} className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 text-xs font-medium px-2.5 py-1 rounded-full">
                  {surah.number}:{ayah.number}
                </span>
                {ayah.audio && (
                  <button
                    onClick={() => handlePlayAyah(ayah)}
                    className={`p-1.5 rounded-full transition-colors ${
                      isCurrentAyah(ayah.number) && isPlaying
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/50'
                    }`}
                    aria-label={isCurrentAyah(ayah.number) && isPlaying ? `Pause ayah ${ayah.number}` : `Play ayah ${ayah.number}`}
                  >
                    {isCurrentAyah(ayah.number) && isPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                )}
              </div>
              <Link href={`/surah/${surah.number}/${ayah.number}`} className="text-xs text-teal-600 hover:text-teal-700" aria-label={`Details for ayah ${ayah.number}`}>
                Details →
              </Link>
            </div>
            <div lang="ar" dir="rtl" className="text-right text-2xl sm:text-3xl font-quran leading-loose mb-4 text-gray-800 dark:text-gray-100">
              {ayah.text}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {ayah.translationText}
            </div>
          </article>
        ))}
      </div>

      {/* Prev/Next Surah Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
        {prevSurah ? (
          <Link href={`/surah/${prevSurah}`} className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span>Previous Surah</span>
          </Link>
        ) : <span />}
        {nextSurah ? (
          <Link href={`/surah/${nextSurah}`} className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
            <span>Next Surah</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
