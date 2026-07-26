'use client';
import { useState, useCallback } from 'react';

export default function PageControls({ currentPage, totalPages, onNavigate, loading }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const page = Number(inputValue);
    if (page >= 1 && page <= totalPages) {
      onNavigate(page);
      setInputValue('');
    }
  }, [inputValue, totalPages, onNavigate]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Previous */}
        <button
          onClick={() => onNavigate(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Prev
        </button>

        {/* Page input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">Page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={String(currentPage)}
            className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <span className="text-gray-500 dark:text-gray-400">of {totalPages}</span>
        </form>

        {/* Next */}
        <button
          onClick={() => onNavigate(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
