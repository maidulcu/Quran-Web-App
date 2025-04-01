import React, { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export default function LanguageSelector() {
  const { translation, setTranslation } = useContext(SettingsContext);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetch('http://api.alquran.cloud/v1/edition/type/translation')
      .then(res => res.json())
      .then(data => {
        const langs = Array.from(
          new Set(data.data.map((edition) => edition.language))
        ).sort();
        setLanguages(langs);
      })
      .catch(err => {
        console.error('Failed to fetch languages:', err);
        setLanguages(['en']); // fallback
      });
  }, []);

  return (
    <select
      value={translation.split('.')[0]} // assumes format like 'en.sahih'
      onChange={(e) => setTranslation(e.target.value)}
      className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
