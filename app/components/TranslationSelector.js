'use client';
import { useState, useRef, useEffect } from 'react';

export default function TranslationSelector({ selected, available, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const mainLabel = selected.length === 1
    ? available.find(e => e.id === selected[0])?.shortName || selected[0]
    : `${selected.length} translations`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`text-xs px-3 py-1 rounded-full transition-colors ${
          selected.length > 1
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 ring-1 ring-blue-300 dark:ring-blue-700'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label="Select translations"
        aria-expanded={open}
      >
        {mainLabel}
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 py-2 min-w-[200px] z-50">
          {available.map(ed => {
            const active = selected.includes(ed.id);
            return (
              <button
                key={ed.id}
                onClick={() => onChange(ed.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                  active
                    ? 'text-teal-700 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-900/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  active
                    ? 'border-teal-600 bg-teal-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {active && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="font-medium">{ed.shortName}</span>
                  <span className="text-xs text-gray-400">{ed.name}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
