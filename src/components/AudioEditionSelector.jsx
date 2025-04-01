import React, { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export default function AudioEditionSelector() {
  const { audioEdition, setAudioEdition } = useContext(SettingsContext);
  const [reciters, setReciters] = useState([]);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse')
      .then(res => res.json())
      .then(data => {
        setReciters(data.data);
      })
      .catch(err => {
        console.error('Failed to fetch audio editions:', err);
        setReciters([]);
      });
  }, []);

  return (
    <select
      value={audioEdition}
      onChange={(e) => setAudioEdition(e.target.value)}
      className="border p-2 rounded text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {reciters.map((reciter) => (
        <option key={reciter.identifier} value={reciter.identifier}>
          {reciter.englishName} ({reciter.identifier})
        </option>
      ))}
    </select>
  );
}
