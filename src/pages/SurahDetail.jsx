import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import AyahItem from '../components/AyahItem';

const SurahDetail = () => {
  const { id } = useParams();
  const { translationEdition, audioEdition } = useContext(SettingsContext);
  const { loadAndPlay, setQueue, isPlaying } = useAudioPlayer();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        const [arabicRes, translationRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`).then(res => res.json()),
          fetch(`https://api.alquran.cloud/v1/surah/${id}/${translationEdition}`).then(res => res.json())
        ]);

        const arabicAyahs = arabicRes.data.ayahs;
        const translatedAyahs = translationRes.data.ayahs;

        const combinedAyahs = arabicAyahs.map((ayah, index) => ({
          text: ayah.text,
          translationText: translatedAyahs[index]?.text || '',
          number: ayah.numberInSurah
        }));

        setSurah({
          ...arabicRes.data,
          ayahs: combinedAyahs
        });

        const saved = localStorage.getItem('bookmarkedAyahs');
        if (saved) {
          setBookmarks(JSON.parse(saved));
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch Surah detail:', err);
        setLoading(false);
      }
    };

    fetchSurahData();
  }, [id, translationEdition]);

  const toggleBookmark = (ayah) => {
    let updated;
    const exists = bookmarks.find(b => b.number === ayah.number);
    if (exists) {
      updated = bookmarks.filter(b => b.number !== ayah.number);
    } else {
      updated = [...bookmarks, ayah];
    }
    setBookmarks(updated);
    localStorage.setItem('bookmarkedAyahs', JSON.stringify(updated));
  };

  const playAudio = (ayah, index = null) => {
    const globalAyah = {
      surahNumber: surah.number,
      number: ayah.number,
      text: ayah.text,
    };
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/${audioEdition}/${ayah.number}.mp3`;

    if (index !== null) {
      const queue = surah.ayahs.slice(index).map((a) => ({
        number: a.number,
        text: a.text,
        surahNumber: surah.number,
        audioUrl: `https://cdn.islamic.network/quran/audio/128/${audioEdition}/${a.number}.mp3`
      }));
      setQueue(queue);
    }

    loadAndPlay(globalAyah, audioUrl);

    if (index !== null) {
      setCurrentIndex(index);
      localStorage.setItem(`lastPlayedIndex-${surah.number}`, index);
    } else {
      setCurrentIndex(null);
    }
  };

  const resumeLast = () => {
    const last = localStorage.getItem(`lastPlayedIndex-${surah?.number}`);
    const index = last ? parseInt(last, 10) : 0;
    const ayah = surah.ayahs[index];
    playAudio(ayah, index);
  };

  const isBookmarked = (number) => bookmarks.some(b => b.number === number);

  useEffect(() => {
    if (!isPlaying && currentIndex !== null && surah?.ayahs?.length > 0 && currentIndex < surah.ayahs.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextAyah = surah.ayahs[nextIndex];
      playAudio(nextAyah, nextIndex);
    }
  }, [isPlaying]);

  if (loading || !surah) return <div className="text-center py-6">Loading surah...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Surah {surah.englishName}</h2>

      <div className="text-center mb-6 space-x-4">
        <button
          onClick={() => playAudio(surah.ayahs[0], 0)}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          ▶ Play All
        </button>
        <button
          onClick={resumeLast}
          className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          ⏯ Resume Last
        </button>
      </div>

      <div className="space-y-6">
        {surah.ayahs.map((ayah, index) => (
          <AyahItem
            key={ayah.number}
            ayah={ayah}
            bookmarked={isBookmarked(ayah.number)}
            toggleBookmark={() => toggleBookmark(ayah)}
            playAudio={() => playAudio(ayah, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
