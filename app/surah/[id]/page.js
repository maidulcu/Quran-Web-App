'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function SurahDetail() {
  const { id } = useParams();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        const [arabicRes, translationRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`),
          fetch(`https://api.alquran.cloud/v1/surah/${id}/en.sahih`)
        ]);

        const arabicData = await arabicRes.json();
        const translationData = await translationRes.json();

        const combinedAyahs = arabicData.data.ayahs.map((ayah, index) => ({
          text: ayah.text,
          translationText: translationData.data.ayahs[index]?.text || '',
          number: ayah.numberInSurah
        }));

        setSurah({
          ...arabicData.data,
          ayahs: combinedAyahs
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surah:', error);
        setLoading(false);
      }
    };

    if (id) fetchSurah();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!surah) return <div className="text-center py-8">Surah not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{surah.englishName}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {surah.numberOfAyahs} Ayahs • {surah.revelationType}
        </p>
      </div>

      <div className="space-y-6">
        {surah.ayahs.map((ayah) => (
          <div key={ayah.number} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-2">
              {surah.number}:{ayah.number}
            </div>
            <div className="text-right text-2xl font-quran leading-loose mb-4">
              {ayah.text}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {ayah.translationText}
            </div>
            <div className="mt-4 text-right">
              <Link href={`/surah/${surah.number}/${ayah.number}`} className="text-teal-600 hover:text-teal-700">
                {surah.number}:{ayah.number}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
