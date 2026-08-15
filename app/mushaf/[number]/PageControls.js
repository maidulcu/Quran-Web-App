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
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40 glass-panel border-t border-outline-variant/20">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-body"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Prev
        </button>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sm font-body">
          <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">Page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={String(currentPage)}
            className="w-16 px-2 py-1 text-center border border-outline-variant/50 dark:border-outline-variant-dark/50 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="text-gray-500 dark:text-gray-400">of {totalPages}</span>
        </form>

        <button
          onClick={() => onNavigate(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-body"
        >
          Next
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
