'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSurahMultipleEditions, getTafsirForSurah, getTafsirEdition, getSurahTajweed, DEFAULT_TRANSLATION } from '../../lib/api';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useLastRead } from '../../hooks/useLastRead';
import { useFont } from '../../hooks/useFont';
import { useTafsir } from '../../hooks/useTafsir';
import { useTajweed } from '../../hooks/useTajweed';
import { useTranslations } from '../../hooks/useTranslations';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { parseTajweedText } from '../../lib/tajweed';
import TafsirSelector from '../../components/TafsirSelector';
import TajweedToggle from '../../components/TajweedToggle';
import TranslationSelector from '../../components/TranslationSelector';

const BISMILLAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
const SKIP_BISMILLAH_SURAH = [9];

export default function SurahDetail({ initialData }) {
  const { id } = useParams();
  const [surah, setSurah] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [copiedAyah, setCopiedAyah] = useState(null);
  const ayahRefs = useRef({});
  const { playAudio, currentAyah, isPlaying, setQueue } = useAudioPlayer();
  const { saveLastRead } = useLastRead();
  const { fontClass, font, toggleFont } = useFont();
  const { tafsirEnabled, tafsirEdition, toggleTafsir, selectEdition } = useTafsir();
  const { markAyahRead } = useReadingProgress();
  const { tajweedEnabled, toggleTajweed } = useTajweed();
  const { selected: selectedTranslations, available: transAvailable, toggleTranslation } = useTranslations();
  const [tajweedData, setTajweedData] = useState({});
  const [tajweedLoading, setTajweedLoading] = useState(false);
  const [tafsirData, setTafsirData] = useState({});
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [expandedTafsir, setExpandedTafsir] = useState({});

  // Track reading progress
  useEffect(() => {
    if (!surah) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ayahNum = Number(entry.target.dataset.ayah);
            if (ayahNum) {
              saveLastRead(surah.number, ayahNum);
              markAyahRead(surah.number, ayahNum, surah.numberOfAyahs);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(ayahRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [surah, saveLastRead, markAyahRead]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        const editions = ['ar.alafasy', ...selectedTranslations];
        const data = await getSurahMultipleEditions(id, editions);

        if (!controller.signal.aborted) {
          const arabicData = data.data[0];
          const transDataSets = data.data.slice(1);

          const combinedAyahs = arabicData.ayahs.map((ayah, index) => ({
            text: ayah.text,
            translationText: transDataSets[0]?.ayahs[index]?.text || '',
            otherTranslations: selectedTranslations.slice(1).map((edId, i) => ({
              id: edId,
              text: transDataSets[i + 1]?.ayahs[index]?.text || '',
            })),
            number: ayah.numberInSurah,
            audio: ayah.audio || null,
          }));

          setSurah({
            ...arabicData,
            ayahs: combinedAyahs,
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

    if (initialData && selectedTranslations.length === 1 && selectedTranslations[0] === DEFAULT_TRANSLATION) {
      setLoading(false);
      return;
    }
    if (id) fetchSurah();
    return () => controller.abort();
  }, [id, initialData, selectedTranslations]);

  // Fetch tafsir when enabled or edition changes
  useEffect(() => {
    if (!tafsirEnabled || !surah) {
      setTafsirData({});
      return;
    }
    let cancelled = false;
    const fetchTafsir = async () => {
      setTafsirLoading(true);
      try {
        const data = await getTafsirForSurah(surah.number, tafsirEdition);
        if (!cancelled) setTafsirData(data);
      } catch {
        if (!cancelled) setTafsirData({});
      } finally {
        if (!cancelled) setTafsirLoading(false);
      }
    };
    fetchTafsir();
    return () => { cancelled = true; };
  }, [surah, tafsirEnabled, tafsirEdition]);

  // Fetch tajweed data when enabled
  useEffect(() => {
    if (!tajweedEnabled || !surah) {
      setTajweedData({});
      return;
    }
    let cancelled = false;
    const fetchTajweed = async () => {
      setTajweedLoading(true);
      try {
        const data = await getSurahTajweed(surah.number);
        if (!cancelled) setTajweedData(data);
      } catch {
        if (!cancelled) setTajweedData({});
      } finally {
        if (!cancelled) setTajweedLoading(false);
      }
    };
    fetchTajweed();
    return () => { cancelled = true; };
  }, [surah, tajweedEnabled]);

  // Auto-scroll to current ayah during playback
  useEffect(() => {
    if (!currentAyah || !surah) return;
    if (currentAyah.surahName !== surah.englishName) return;
    const el = ayahRefs.current[currentAyah.number];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentAyah, surah]);

  const handlePlayAyah = useCallback((ayah) => {
    playAudio({
      audio: ayah.audio,
      surahName: surah?.englishName,
      number: ayah.number,
    });
    if (surah?.ayahs) {
      const currentIndex = surah.ayahs.findIndex(a => a.number === ayah.number);
      if (currentIndex >= 0) {
        const nextAyahs = surah.ayahs.slice(currentIndex + 1).map(a => ({
          audio: a.audio,
          surahName: surah.englishName,
          number: a.number,
        }));
        setQueue(nextAyahs);
      }
    }
  }, [playAudio, surah, setQueue]);

  const toggleTafsirAyah = useCallback((ayahNumber) => {
    setExpandedTafsir(prev => ({ ...prev, [ayahNumber]: !prev[ayahNumber] }));
  }, []);

  const isCurrentAyah = useCallback((ayahNumber) => {
    return currentAyah?.surahName === surah?.englishName && currentAyah?.number === ayahNumber;
  }, [currentAyah, surah]);

  const handleCopy = useCallback(async (text, ayahNumber) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAyah(ayahNumber);
      setTimeout(() => setCopiedAyah(null), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAyah(ayahNumber);
      setTimeout(() => setCopiedAyah(null), 2000);
    }
  }, []);

  const handleShare = useCallback(async (ayah) => {
    const shareData = {
      text: `${ayah.text}\n\n${ayah.translationText}\n\n— Surah ${surah?.englishName} ${surah?.number}:${ayah.number}`,
      title: `Surah ${surah?.englishName} ${ayah.number}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await handleCopy(shareData.text, ayah.number);
    }
  }, [surah, handleCopy]);

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
        <div lang="ar" className={`text-4xl mb-3 text-teal-800 dark:text-teal-200 ${fontClass}`}>
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

        {/* Controls */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Font toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Font:</span>
            <button
              onClick={toggleFont}
              className="text-xs px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800/50 transition-colors"
            >
              {font === 'Uthmanic' ? 'Uthmanic' : 'Indo-Pak'} → {font === 'Uthmanic' ? 'Indo-Pak' : 'Uthmanic'}
            </button>
          </div>

          {/* Translation selector */}
          <TranslationSelector
            selected={selectedTranslations}
            available={transAvailable}
            onChange={toggleTranslation}
          />

          {/* Tajweed toggle */}
          <TajweedToggle enabled={tajweedEnabled} onToggle={toggleTajweed} />

          {/* Tafsir selector */}
          <TafsirSelector
            enabled={tafsirEnabled}
            edition={tafsirEdition}
            onToggle={toggleTafsir}
            onSelectEdition={selectEdition}
          />
        </div>
      </div>

      {/* Bismillah */}
      {showBismillah && (
        <div className="text-center mb-8 py-6">
          <p lang="ar" className={`text-3xl text-gray-800 dark:text-gray-100 leading-loose ${fontClass}`}>
            {BISMILLAH}
          </p>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-4">
        {surah.ayahs.map((ayah) => (
          <article
            key={ayah.number}
            ref={(el) => { ayahRefs.current[ayah.number] = el; }}
            data-ayah={ayah.number}
            className={`bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm ring-1 transition-all duration-300 ${
              isCurrentAyah(ayah.number) && isPlaying
                ? 'ring-2 ring-teal-400 bg-teal-50 dark:bg-teal-900/20 shadow-md'
                : 'ring-gray-200/60 dark:ring-gray-700/60 hover:shadow-md'
            }`}
          >
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
              <div className="flex items-center gap-1">
                {/* Copy button */}
                <button
                  onClick={() => handleCopy(`${ayah.text}\n\n${ayah.translationText}`, ayah.number)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-teal-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={`Copy ayah ${ayah.number}`}
                  title="Copy"
                >
                  {copiedAyah === ayah.number ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </button>
                {/* Share button */}
                <button
                  onClick={() => handleShare(ayah)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-teal-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={`Share ayah ${ayah.number}`}
                  title="Share"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
                <Link href={`/surah/${surah.number}/${ayah.number}`} className="p-1.5 rounded-full text-gray-400 hover:text-teal-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label={`Details for ayah ${ayah.number}`} title="Details">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </Link>
              </div>
            </div>
            <div
              lang="ar"
              dir="rtl"
              className={`text-right text-2xl sm:text-3xl leading-loose mb-4 text-gray-800 dark:text-gray-100 ${fontClass}`}
              {...(tajweedEnabled && tajweedData[ayah.number] ? {
                dangerouslySetInnerHTML: { __html: parseTajweedText(tajweedData[ayah.number]) }
              } : { children: ayah.text })}
            />
            <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {ayah.translationText}
            </div>

            {ayah.otherTranslations?.map(t => t.text ? (
              <div key={t.id} className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <span className="text-xs font-medium text-gray-400">{transAvailable.find(e => e.id === t.id)?.shortName || t.id}</span>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-0.5">{t.text}</p>
              </div>
            ) : null)}

            {/* Tafsir section */}
            {tafsirEnabled && tafsirData[ayah.number] && (
              <div className="mt-3 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                <button
                  onClick={() => toggleTafsirAyah(ayah.number)}
                  className="flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors w-full"
                  aria-expanded={!!expandedTafsir[ayah.number]}
                >
                  <svg
                    className={`w-3 h-3 transition-transform ${expandedTafsir[ayah.number] ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="font-medium">{getTafsirEdition(tafsirEdition)?.name || 'Tafsir'}</span>
                  {tafsirLoading && !tafsirData[ayah.number] && (
                    <span className="text-gray-400">Loading...</span>
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedTafsir[ayah.number] ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div
                    className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: tafsirData[ayah.number] }}
                  />
                </div>
              </div>
            )}
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
