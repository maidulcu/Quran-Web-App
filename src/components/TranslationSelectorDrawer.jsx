import React, { useEffect, useState } from 'react';

export default function TranslationSelectorDrawer({ selectedValue, onSelect, onClose }) {
  const [translations, setTranslations] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/edition/type/translation')
      .then(res => res.json())
      .then(data => {
        setTranslations(data.data);
      });
  }, []);

  useEffect(() => {
    const grouped = translations.reduce((acc, edition) => {
      const lang = edition.language || 'Other';
      if (!acc[lang]) acc[lang] = [];
      acc[lang].push(edition);
      return acc;
    }, {});
    setGrouped(grouped);
  }, [translations]);

  const handleSelect = (editionId) => {
    onSelect(editionId);
  };

  const filtered = (group) =>
    group.filter((ed) =>
      ed.name.toLowerCase().includes(search.toLowerCase()) ||
      ed.englishName.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-gray-900 z-50 overflow-y-auto shadow-lg">
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Translations</h2>
        <button onClick={onClose} className="text-lg">✕</button>
      </div>

      <div className="p-4 border-b dark:border-gray-700">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by translator name"
          className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="p-4 space-y-6">
        {Object.keys(grouped).sort().map((lang) => (
          <div key={lang}>
            <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">{lang}</h3>
            <ul className="space-y-2">
              {filtered(grouped[lang]).map((ed) => (
                <li key={ed.identifier}>
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="radio"
                      name="translation"
                      value={ed.identifier}
                      checked={selectedValue === ed.identifier}
                      onChange={() => handleSelect(ed.identifier)}
                    />
                    <span>{ed.englishName}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
