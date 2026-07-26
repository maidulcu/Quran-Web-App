'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPage } from '../../lib/api';
import { useFont } from '../../hooks/useFont';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { useLastReadPage } from '../../hooks/useLastReadPage';
import PageCanvas from './PageCanvas';
import PageControls from './PageControls';

const TOTAL_PAGES = 604;

export default function MushafView({ initialData, pageNumber }) {
  const router = useRouter();
  const { fontClass } = useFont();
  const { playAudio, currentAyah, isPlaying } = useAudioPlayer();
  const { saveLastReadPage } = useLastReadPage();

  const [pageData, setPageData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save reading progress
  useEffect(() => {
    if (pageNumber) saveLastReadPage(pageNumber);
  }, [pageNumber, saveLastReadPage]);

  // Client-side navigation
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

  // Keyboard navigation
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
      number:ayah.numberInSurah,
    });
  }, [playAudio]);

  if (error && !pageData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to Load Page</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={() => navigateToPage(currentPage)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Canvas */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 p-6 sm:p-10 min-h-[60vh] animate-pulse">
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
          />
        ) : null}
      </div>

      {/* Page Controls - Fixed at bottom */}
      <PageControls
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onNavigate={navigateToPage}
        loading={loading}
      />
    </div>
  );
}
