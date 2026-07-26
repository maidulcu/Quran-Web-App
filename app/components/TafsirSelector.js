'use client';
import { useState, useRef, useEffect } from 'react';
import { TAFSIR_EDITIONS } from '../lib/api';

export default function TafsirSelector({ enabled, edition, onToggle, onSelectEdition }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentEdition = TAFSIR_EDITIONS.find(e => e.id === edition);

  return (
    <div className="flex items-center gap-2" ref={dropdownRef}>
      <span className="text-xs text-gray-500 dark:text-gray-400">Tafsir:</span>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          enabled
            ? 'bg-teal-600'
            : 'bg-gray-300 dark:bg-gray-600'
        }`}
        aria-label={enabled ? 'Disable tafsir' : 'Enable tafsir'}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </button>

      {/* Edition selector */}
      {enabled && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800/50 transition-colors flex items-center gap-1"
          >
            {currentEdition?.name || 'Select'}
            <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 z-50 min-w-[240px] py-1">
              {TAFSIR_EDITIONS.map(e => (
                <button
                  key={e.id}
                  onClick={() => {
                    onSelectEdition(e.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    e.id === edition ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium">{e.name}</div>
                  <div className="text-gray-500 dark:text-gray-400 mt-0.5">{e.description}</div>
                  <div className="text-gray-400 dark:text-gray-500 mt-0.5">
                    {e.language === 'ar' ? 'Arabic' : 'English'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
