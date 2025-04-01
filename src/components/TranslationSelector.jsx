import React, { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export default function TranslationSelector() {
  const { language, translationEdition, setTranslationEdition } = useContext(SettingsContext);
  const [editions, setEditions] = useState([]);

  useEffect(() => {
    if (!language) return;

    fetch(`https://api.alquran.cloud/v1/edition/language/${language}`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.data.filter(e => e.type === 'translation');
        setEditions(filtered);
      })
      .catch(err => {
        console.error('Failed to fetch translation editions:', err);
        setEditions([]);
      });
  }, [language]);

  return (
    <select
      value={translationEdition}
      onChange={(e) => setTranslationEdition(e.target.value)}
      className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {editions.map(edition => (
        <option key={edition.identifier} value={edition.identifier}>
          {edition.identifier} – {edition.englishName}
        </option>
      ))}
    </select>
  );
}
