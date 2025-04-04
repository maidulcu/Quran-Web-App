import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import MeccanBg from '../assets/meccan-bg.png';
import MedinanBg from '../assets/medinan-bg.png';

const SurahDetail = () => {
  const { id } = useParams();
  const { translation, audioEdition, fontScript } = useContext(SettingsContext);
  const { loadAndPlay, setQueue, isPlaying, currentAyah, togglePlayPause } = useAudioPlayer();
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [translatorName, setTranslatorName] = useState('');

  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        const [arabicRes, translationRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`).then(res => res.json()),
          fetch(`https://api.alquran.cloud/v1/surah/${id}/${translation}`).then(res => res.json())
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

        const editionName = translationRes.data.edition.name;
        setTranslatorName(editionName);

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
  }, [id, translation]);

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

    if (index !== null && (!currentAyah || currentAyah.number !== ayah.number)) {
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

  const shareAyah = (ayah) => {
    const text = `Surah ${surah.englishName} (${surah.number}:${ayah.number})\n\n"${ayah.text}"\n\n— ${ayah.translationText}`;
    const url = `${window.location.origin}/surah/${surah.number}#ayah-${ayah.number}`;

    if (navigator.share) {
      navigator.share({
        title: `Quran ${surah.englishName} ${ayah.number}`,
        text,
        url,
      }).catch(err => console.error('Share failed', err));
    } else {
      navigator.clipboard.writeText(`${text}\n\n${url}`);
      alert('Link copied to clipboard.');
    }
  };

  if (loading || !surah) return <div className="text-center py-6">Loading surah...</div>;

  const surahArtwork = surah.revelationType === 'Meccan' ? MeccanBg : MedinanBg;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-6">
        <div className="flex-shrink-0">
          <img
            src={surahArtwork}
            alt={`${surah.revelationType} artwork`}
            className="h-20 object-contain opacity-80"
          />
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-bold">{surah.englishName}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ayah – {surah.numberOfAyahs}, {surah.revelationType}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={() => {
              if (isPlaying) {
                togglePlayPause();
              } else {
                playAudio(surah.ayahs[0], 0);
              }
            }}
            className="text-teal-600 hover:text-teal-800 text-sm inline-flex items-center"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play Audio'}
          </button>
          <button
            onClick={resumeLast}
            className="text-yellow-600 hover:text-yellow-800 text-sm"
          >
            ⏯ Resume
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {surah.ayahs.map((ayah, index) => (
          <div key={ayah.number} id={`ayah-${ayah.number}`} className="border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-5 shadow-md bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <div className="font-medium text-gray-700 dark:text-gray-300">
                {surah.number}:{ayah.number}
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => playAudio(ayah, index)} title="Play">
                  <span role="img" aria-label="play">▶</span>
                </button>
                <button onClick={() => toggleBookmark(ayah)} title="Bookmark">
                  <span role="img" aria-label="bookmark">{isBookmarked(ayah.number) ? '🔖' : '📑'}</span>
                </button>
                <button onClick={() => shareAyah(ayah)} title="Share">
                  <span role="img" aria-label="share">🔗</span>
                </button>
              </div>
            </div>
            <div
              className={`text-right text-3xl leading-loose tracking-wide text-gray-900 dark:text-white ${
                fontScript === 'IndoPak' ? 'font-indopak' : 'font-quran'
              }`}
            >
              {ayah.text}
            </div>
            <div className="h-2" />
            <div className="text-[10px] font-bold text-teal-700 dark:text-teal-400 tracking-widest uppercase mb-1">
              {translatorName}
            </div>
            <div className="text-base text-justify text-gray-800 dark:text-gray-300">
              {ayah.translationText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahDetail;
