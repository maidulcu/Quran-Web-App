'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSurahMultipleEditions, getTafsirForSurah, getTafsirEdition, getSurahTajweed, DEFAULT_TRANSLATION } from '../../lib/api';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useLastRead } from '../../hooks/useLastRead';
import { useFont } from '../../hooks/useFont';
import { useFontSize } from '../../hooks/useFontSize';
import { useTafsir } from '../../hooks/useTafsir';
import { useTajweed } from '../../hooks/useTajweed';
import { useTranslations } from '../../hooks/useTranslations';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { parseTajweedText } from '../../lib/tajweed';
import { getSurahInfo } from '../../lib/surahInfo';
import { useWordByWord } from '../../hooks/useWordByWord';
import { useNotes } from '../../hooks/useNotes';
import FontSizeSlider from '../../components/FontSizeSlider';
import AyahNote from '../../components/AyahNote';
import TafsirSelector from '../../components/TafsirSelector';
import TajweedToggle from '../../components/TajweedToggle';
import TranslationSelector from '../../components/TranslationSelector';

const BISMILLAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';
const SKIP_BISMILLAH_SURAH = [9];

const TAJWEED_COLORS = [
  { label: 'Madd', color: '#d946ef', desc: 'Elongation' },
  { label: 'Ghunnah', color: '#f59e0b', desc: 'Nasal Sound' },
  { label: 'Ikhfa', color: '#10b981', desc: 'Concealment' },
  { label: 'Qalqalah', color: '#3b82f6', desc: 'Echoing' },
];

function WordByWordLine({ surahNumber, ayahNumber, fetchWords }) {
  const [words, setWords] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancel = false;
    fetchWords(surahNumber, ayahNumber).then(w => {
      if (!cancel && w) setWords(w);
      if (!cancel) setLoaded(true);
    });
    return () => { cancel = true; };
  }, [surahNumber, ayahNumber, fetchWords]);

  if (!loaded || words.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-dashed border-outline-variant/50 dark:border-outline-variant-dark/50">
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
        {words.map((word, i) => (
          <span key={i} className="text-center group cursor-default">
            <span lang="ar" dir="rtl" className="block text-sm font-quran text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary-300 transition-colors">
              {word.text}
            </span>
            <span className="block text-[10px] text-gray-400 dark:text-gray-500 leading-tight font-body">
              {word.translation}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SurahDetail({ initialData }) {
  const { id } = useParams();
  const router = useRouter();
  const [surah, setSurah] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);
  const [copiedAyah, setCopiedAyah] = useState(null);
  const [showTajweedGuide, setShowTajweedGuide] = useState(true);
  const ayahRefs = useRef({});
  const { playAudio, currentAyah, isPlaying, setQueue } = useAudioPlayer();
  const { saveLastRead } = useLastRead();
  const { fontClass, font, toggleFont } = useFont();
  const { level: fontSizeLevel, label: fontSizeLabel } = useFontSize();
  const { tafsirEnabled, tafsirEdition, toggleTafsir, selectEdition } = useTafsir();
  const { markAyahRead } = useReadingProgress();
  const { tajweedEnabled, toggleTajweed } = useTajweed();
  const { enabled: wbwEnabled, toggle: toggleWbw, fetchWords } = useWordByWord();
  const { getNote, saveNote, deleteNote } = useNotes();
  const { selected: selectedTranslations, available: transAvailable, toggleTranslation } = useTranslations();
  const [tajweedData, setTajweedData] = useState({});
  const [tajweedLoading, setTajweedLoading] = useState(false);
  const [tafsirData, setTafsirData] = useState({});
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [expandedTafsir, setExpandedTafsir] = useState({});
  const [showIntro, setShowIntro] = useState(true);

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
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl animate-pulse">
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 max-w-md mx-auto">
          <span className="material-symbols-outlined text-[48px] text-error mb-4 block">error</span>
          <h2 className="text-xl font-semibold font-body mb-2">Unable to Load Surah</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-body">{error || 'Surah not found'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors font-medium font-body">Retry</button>
            <Link href="/surahs" className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-body">Browse Surahs</Link>
          </div>
        </div>
      </div>
    );
  }

  const showBismillah = !SKIP_BISMILLAH_SURAH.includes(surah.number);
  const prevSurah = surah.number > 1 ? surah.number - 1 : null;
  const nextSurah = surah.number < 114 ? surah.number + 1 : null;
  const surahInfo = getSurahInfo(surah.number);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-primary text-[24px]">arrow_back</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display font-semibold text-gray-900 dark:text-white truncate">{surah.englishName}</h1>
            <span className="text-[10px] font-semibold text-primary bg-primary-container dark:bg-primary-container-dark px-2 py-0.5 rounded-full font-body">OFFLINE</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-body">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</p>
        </div>
        <button onClick={toggleTajweed} className={`p-2 rounded-full transition-colors ${tajweedEnabled ? 'bg-primary-container dark:bg-primary-container-dark text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`} aria-label="Toggle tajweed rules">
          <span className="material-symbols-outlined text-[20px] fill">auto_fix_high</span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>

      {/* Bismillah */}
      {showBismillah && (
        <div className="text-center mb-6 py-4 border-b border-outline-variant/30 dark:border-outline-variant-dark/30">
          <p lang="ar" className={`text-primary dark:text-primary-300 ${fontClass} text-arabic-quran-lg text-center`}>
            {BISMILLAH}
          </p>
        </div>
      )}

      {/* Tajweed Color Guide */}
      {tajweedEnabled && showTajweedGuide && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
              <span className="text-label-caps text-primary font-body">Tajweed Color Guide</span>
            </div>
            <button onClick={() => setShowTajweedGuide(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined text-[16px] text-gray-400">close</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TAJWEED_COLORS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-700 dark:text-gray-300 font-body">{item.label} ({item.desc})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button onClick={toggleFont} className="text-xs px-3 py-1.5 rounded-full bg-primary-container dark:bg-primary-container-dark text-primary hover:bg-primary/20 transition-colors font-body font-medium">
          {font === 'Uthmanic' ? 'Uthmanic' : 'Indo-Pak'} → {font === 'Uthmanic' ? 'Indo-Pak' : 'Uthmanic'}
        </button>
        <TranslationSelector selected={selectedTranslations} available={transAvailable} onChange={toggleTranslation} />
        <TajweedToggle enabled={tajweedEnabled} onToggle={toggleTajweed} />
        <button onClick={toggleWbw} className={`text-xs px-3 py-1.5 rounded-full transition-colors font-body ${wbwEnabled ? 'bg-secondary-container dark:bg-secondary-container-dark text-secondary ring-1 ring-secondary/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
          {wbwEnabled ? 'WBW On' : 'Word-by-Word'}
        </button>
        <TafsirSelector enabled={tafsirEnabled} edition={tafsirEdition} onToggle={toggleTafsir} onSelectEdition={selectEdition} />
        <FontSizeSlider />
      </div>

      {/* Surah Introduction */}
      {surahInfo.summary && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40">
          <button onClick={() => setShowIntro(!showIntro)} className="flex items-center gap-2 text-left w-full" aria-expanded={showIntro}>
            <span className={`material-symbols-outlined text-primary text-[20px] transition-transform ${showIntro ? 'rotate-90' : ''}`}>chevron_right</span>
            <h2 className="text-base font-semibold font-body">Introduction to Surah {surah.englishName}</h2>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showIntro ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3 font-body text-sm">{surahInfo.summary}</p>
            {surahInfo.themes.length > 0 && (
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 font-body">Key Themes</h3>
                <div className="flex flex-wrap gap-1.5">
                  {surahInfo.themes.map((theme, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full font-body">{theme}</span>
                  ))}
                </div>
              </div>
            )}
            {surahInfo.virtues && (
              <div className="bg-primary-container/50 dark:bg-primary-container-dark/30 rounded-xl p-3 mt-2">
                <h3 className="text-xs font-semibold text-primary mb-1 font-body">Virtues &amp; Benefits</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-body">{surahInfo.virtues}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-ayah-spacing">
        {surah.ayahs.map((ayah) => (
          <article
            key={ayah.number}
            ref={(el) => { ayahRefs.current[ayah.number] = el; }}
            data-ayah={ayah.number}
            className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm ring-1 transition-all duration-300 ${
              isCurrentAyah(ayah.number) && isPlaying
                ? 'ring-2 ring-primary bg-primary-container/30 dark:bg-primary-container-dark/30 shadow-elevation-2'
                : 'ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2'
            }`}
          >
            {/* Ayah Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary-container dark:bg-primary-container-dark text-primary text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center font-body">{ayah.number}</span>
                {ayah.audio && (
                  <button onClick={() => handlePlayAyah(ayah)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCurrentAyah(ayah.number) && isPlaying ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-container dark:hover:bg-primary-container-dark'}`} aria-label={isCurrentAyah(ayah.number) && isPlaying ? `Pause ayah ${ayah.number}` : `Play ayah ${ayah.number}`}>
                    <span className="material-symbols-outlined text-[16px]">{isCurrentAyah(ayah.number) && isPlaying ? 'pause' : 'play_arrow'}</span>
                  </button>
                )}
                <button onClick={() => {}} className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary-container/50 dark:hover:bg-primary-container-dark/50 transition-colors" aria-label={`Bookmark ayah ${ayah.number}`}>
                  <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                </button>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => handleCopy(`${ayah.text}\n\n${ayah.translationText}`, ayah.number)} className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary-container/50 dark:hover:bg-primary-container-dark/50 transition-colors" aria-label={`Copy ayah ${ayah.number}`}>
                  <span className="material-symbols-outlined text-[16px]">{copiedAyah === ayah.number ? 'check' : 'content_copy'}</span>
                </button>
                <button onClick={() => handleShare(ayah)} className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary-container/50 dark:hover:bg-primary-container-dark/50 transition-colors" aria-label={`Share ayah ${ayah.number}`}>
                  <span className="material-symbols-outlined text-[16px]">share</span>
                </button>
                <button onClick={() => toggleTafsirAyah(ayah.number)} className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary-container/50 dark:hover:bg-primary-container-dark/50 transition-colors" aria-label={`Tafsir for ayah ${ayah.number}`}>
                  <span className="material-symbols-outlined text-[16px]">menu_book</span>
                </button>
                <button onClick={() => { const el = document.getElementById(`note-${ayah.number}`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className={`p-1.5 rounded-full transition-colors ${getNote(surah.number, ayah.number) ? 'text-secondary bg-secondary-container/50 dark:bg-secondary-container-dark/50' : 'text-gray-400 hover:text-primary hover:bg-primary-container/50 dark:hover:bg-primary-container-dark/50'}`} aria-label={`Note for ayah ${ayah.number}`}>
                  <span className="material-symbols-outlined text-[16px] fill">edit_note</span>
                </button>
              </div>
            </div>

            {/* Arabic Text */}
            <div
              lang="ar"
              dir="rtl"
              className={`text-right mb-3 text-gray-800 dark:text-gray-100 ${fontClass} text-arabic-quran-md`}
              {...(tajweedEnabled && tajweedData[ayah.number] ? {
                dangerouslySetInnerHTML: { __html: parseTajweedText(tajweedData[ayah.number]) }
              } : { children: ayah.text })}
            />

            {/* Translation */}
            <div className="text-gray-600 dark:text-gray-400 text-body-translation leading-relaxed font-body">
              {ayah.translationText}
            </div>

            {/* Word-by-word */}
            {wbwEnabled && (
              <WordByWordLine surahNumber={surah.number} ayahNumber={ayah.number} fetchWords={fetchWords} />
            )}

            {/* Other translations */}
            {ayah.otherTranslations?.map(t => t.text ? (
              <div key={t.id} className="mt-2 pt-2 border-t border-outline-variant/30 dark:border-outline-variant-dark/30">
                <span className="text-[10px] font-semibold text-gray-400 font-body">{transAvailable.find(e => e.id === t.id)?.shortName || t.id}</span>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-0.5 font-body">{t.text}</p>
              </div>
            ) : null)}

            {/* Tafsir */}
            {tafsirEnabled && tafsirData[ayah.number] && (
              <div className="mt-3 border-t border-outline-variant/30 dark:border-outline-variant-dark/30 pt-3">
                <button onClick={() => toggleTafsirAyah(ayah.number)} className="flex items-center gap-2 text-xs text-primary hover:text-primary-600 transition-colors w-full font-body" aria-expanded={!!expandedTafsir[ayah.number]}>
                  <span className={`material-symbols-outlined text-[14px] transition-transform ${expandedTafsir[ayah.number] ? 'rotate-90' : ''}`}>chevron_right</span>
                  <span className="font-medium">{getTafsirEdition(tafsirEdition)?.name || 'Tafsir'}</span>
                  {tafsirLoading && !tafsirData[ayah.number] && <span className="text-gray-400">Loading...</span>}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedTafsir[ayah.number] ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 prose prose-sm dark:prose-invert max-w-none font-body" dangerouslySetInnerHTML={{ __html: tafsirData[ayah.number] }} />
                </div>
              </div>
            )}

            {/* Note */}
            <div id={`note-${ayah.number}`}>
              <AyahNote note={getNote(surah.number, ayah.number)} onSave={(text) => saveNote(surah.number, ayah.number, text)} onDelete={() => deleteNote(surah.number, ayah.number)} />
            </div>
          </article>
        ))}
      </div>

      {/* Prev/Next Surah */}
      <div className="mt-10 flex items-center justify-between">
        {prevSurah ? (
          <Link href={`/surah/${prevSurah}`} className="flex items-center gap-2 text-primary hover:text-primary-600 transition-colors font-body font-medium">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Previous Surah</span>
          </Link>
        ) : <span />}
        {nextSurah ? (
          <Link href={`/surah/${nextSurah}`} className="flex items-center gap-2 text-primary hover:text-primary-600 transition-colors font-body font-medium">
            <span>Next Surah</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
