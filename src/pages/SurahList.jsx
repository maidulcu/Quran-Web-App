import React, { useEffect, useState } from 'react';
import SurahCard from '../components/SurahCard';

export default function SurahList() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch Surahs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8">Loading surahs...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">📖 Surahs of the Quran</h1>
      <p className="text-center text-gray-600 mb-8">
        Browse all 114 chapters of the Holy Quran
      </p>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {surahs.map(surah => (
          <SurahCard key={surah.number} surah={surah} />
        ))}
      </div>
    </div>
  );
}
