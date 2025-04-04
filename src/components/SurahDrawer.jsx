import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SurahDrawer = ({ isOpen, onClose, surahs = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('surah'); // or 'juz'
  const location = useLocation();
  const currentSurahId = parseInt(location.pathname.split('/')[2]);
  const selectedRef = useRef(null);

  useEffect(() => {
    if (isOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  const filteredSurahs = surahs.filter((surah) =>
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.name.includes(searchQuery)
  );

  const surahsByJuz = {};
  filteredSurahs.forEach((surah) => {
    const juzNum = Math.ceil(surah.number / (114 / 30)); // Roughly divide 114 Surahs across 30 Juz
    if (!surahsByJuz[juzNum]) surahsByJuz[juzNum] = [];
    surahsByJuz[juzNum].push(surah);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm h-full shadow-lg p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Select Surah</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">×</button>
        </div>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setViewMode('surah')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'surah'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Surah
          </button>
          <button
            onClick={() => setViewMode('juz')}
            className={`px-3 py-1 text-sm rounded ${
              viewMode === 'juz'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Juz
          </button>
        </div>
        {viewMode === 'juz' && (
          <>
            <input
              type="text"
              placeholder="Search Juz"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-4 px-3 py-2 text-sm border rounded focus:outline-none focus:ring"
            />
            <div className="space-y-2">
              {Array.from({ length: 30 }, (_, i) => i + 1)
                .filter((juzNumber) =>
                  searchQuery === '' || juzNumber.toString().includes(searchQuery)
                )
                .map((juzNumber) => {
                  const isActiveJuz = Math.ceil(currentSurahId / (114 / 30)) === juzNumber;

                  return (
                    <button
                      key={juzNumber}
                      onClick={() => {
                        const el = document.getElementById(`juz-${juzNumber}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`w-full text-left px-4 py-2 rounded ${
                        isActiveJuz
                          ? 'bg-gray-100 dark:bg-gray-800 font-semibold'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      Juz {juzNumber}
                    </button>
                  );
                })}
            </div>
          </>
        )}
        {viewMode === 'surah' && (
          <input
            type="text"
            placeholder="Search Surah"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 px-3 py-2 text-sm border rounded focus:outline-none focus:ring"
          />
        )}
        {viewMode === 'surah' && (
          <div className="space-y-2">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.number}
                to={`/surah/${surah.number}`}
                onClick={onClose}
                ref={surah.number === currentSurahId ? selectedRef : null}
                className={`block px-3 py-2 rounded hover:bg-teal-100 dark:hover:bg-gray-800 ${
                  surah.number === currentSurahId
                    ? 'bg-teal-100 dark:bg-gray-800 font-semibold text-teal-700 dark:text-teal-300'
                    : ''
                }`}
              >
                {surah.number}. {surah.englishName}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};

export default SurahDrawer;
