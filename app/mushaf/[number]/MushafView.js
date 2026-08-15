'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPage } from '../../lib/api';
import { useFont } from '../../hooks/useFont';
import { useFontSize } from '../../hooks/useFontSize';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useLastReadPage } from '../../hooks/useLastReadPage';
import PageCanvas from './PageCanvas';
import PageControls from './PageControls';

const TOTAL_PAGES = 604;
const THEMES = [
  { id: 'cream', label: 'Cream', bg: 'bg-[#FDFBF7]', color: '#FDFBF7' },
  { id: 'white', label: 'White', bg: 'bg-white', color: '#FFFFFF' },
  { id: 'sepia', label: 'Sepia', bg: 'bg-[#F4ECD8]', color: '#F4ECD8' },
  { id: 'dark', label: 'Dark', bg: 'bg-[#121212]', color: '#121212' },
];

export default function MushafView({ initialData, pageNumber }) {
  const router = useRouter();
  const { fontClass } = useFont();
  useFontSize();
  const { playAudio, currentAyah, isPlaying } = useAudioPlayer();
  const { saveLastReadPage } = useLastReadPage();

  const [pageData, setPageData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [theme, setTheme] = useState('cream');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    if (pageNumber) saveLastReadPage(pageNumber);
  }, [pageNumber, saveLastReadPage]);

  const navigateToPage = useCallback(async (newPage) => {
    if (newPage < 1 || newPage > TOTAL_PAGES || newPage === currentPage) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getPage(newPage);
      setPageData(result.data);
      setCurrentPage(newPage);
      router.push(`/mushaf/${newPage}`, { scroll: false });
      saveLastReadPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Failed to load page. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, router, saveLastReadPage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') navigateToPage(currentPage + 1);
      else if (e.key === 'ArrowRight') navigateToPage(currentPage - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, navigateToPage]);

  const handlePlayAyah = useCallback((ayah) => {
    playAudio({
      audio: ayah.audio,
      surahName: ayah.surah?.englishName,
      number: ayah.numberInSurah,
    });
  }, [playAudio]);

  const getThemeClass = () => {
    switch (theme) {
      case 'cream': return 'mushaf-cream';
      case 'white': return 'mushaf-white';
      case 'dark': return 'mushaf-dark';
      case 'sepia': return 'mushaf-sepia';
      default: return 'mushaf-cream';
    }
  };

  if (error && !pageData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 max-w-md mx-auto">
          <span className="material-symbols-outlined text-[48px] text-error mb-4 block">error</span>
          <h2 className="text-xl font-semibold font-body mb-2">Unable to Load Page</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-body">{error}</p>
          <button onClick={() => navigateToPage(currentPage)} className="px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors font-body font-medium">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getThemeClass()}`} onClick={() => setShowOverlay(!showOverlay)}>
      {/* Page Canvas */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 p-6 sm:p-10 min-h-[60vh] animate-pulse">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        ) : pageData ? (
          <PageCanvas
            pageData={pageData}
            fontClass={fontClass}
            currentAyah={currentAyah}
            isPlaying={isPlaying}
            onPlayAyah={handlePlayAyah}
            theme={theme}
          />
        ) : null}
      </div>

      {/* Last Read Indicator */}
      <div className="fixed left-0 top-1/3 w-1 h-16 bg-primary rounded-r-full z-30">
        <span className="material-symbols-outlined text-white text-[14px] absolute top-1/2 left-0 -translate-y-1/2 translate-x-0.5">bookmark</span>
      </div>

      {/* Floating Overlay Controls */}
      {showOverlay && (
        <div className="absolute inset-0 z-20 pointer-events-none" onClick={(e) => e.stopPropagation()}>
          {/* Top Header */}
          <div className="absolute top-0 left-0 right-0 glass-panel p-4 pointer-events-auto">
            <div className="flex items-center justify-between">
              <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-primary text-[24px]">arrow_back</span>
              </button>
              <div className="text-center">
                <h1 className="font-display font-semibold text-gray-900 dark:text-white">Al-Fatihah</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-body">Juz 1 - Page {currentPage}</p>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined text-gray-500 text-[20px]">settings</span>
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 glass-panel p-4 pointer-events-auto">
            <div className="flex items-center justify-center gap-4 mb-3">
              {/* Translation Toggle */}
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
                <span className="material-symbols-outlined text-[20px]">translate</span>
              </button>

              {/* Play */}
              <button className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-elevation-2 hover:bg-primary-600 transition-colors">
                <span className="material-symbols-outlined text-[28px]">play_arrow</span>
              </button>

              {/* Theme */}
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setShowThemeMenu(!showThemeMenu); }} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
                  <span className="material-symbols-outlined text-[20px]">palette</span>
                </button>
                {showThemeMenu && (
                  <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-outline-variant/30 dark:border-outline-variant-dark/30 p-2 min-w-[120px]">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={(e) => { e.stopPropagation(); setTheme(t.id); setShowThemeMenu(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-body transition-colors ${
                          theme === t.id ? 'bg-primary-container dark:bg-primary-container-dark text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600" style={{ backgroundColor: t.color }} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Page Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-body">1</span>
              <input
                type="range"
                min={1}
                max={TOTAL_PAGES}
                value={currentPage}
                onChange={(e) => navigateToPage(Number(e.target.value))}
                className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <span className="text-xs text-gray-500 font-body">{TOTAL_PAGES}</span>
            </div>
          </div>
        </div>
      )}

      {/* Page Controls */}
      <PageControls
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onNavigate={navigateToPage}
        loading={loading}
      />
    </div>
  );
}
