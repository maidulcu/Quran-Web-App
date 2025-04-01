import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [translation, setTranslation] = useState(() => localStorage.getItem('translation') || 'en.sahih');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [audioEdition, setAudioEdition] = useState(() => localStorage.getItem('audioEdition') || 'ar.alafasy');
  const [fontScript, setFontScript] = useState(() => localStorage.getItem('fontScript') || 'Uthmani');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize'), 10) || 3);
  const [showWordByWord, setShowWordByWord] = useState(() => localStorage.getItem('showWordByWord') === 'true');
  const [showTransliteration, setShowTransliteration] = useState(() => localStorage.getItem('showTransliteration') === 'true');
  const [playbackSpeed, setPlaybackSpeed] = useState(() => localStorage.getItem('playbackSpeed') || '1');
  const [loopMode, setLoopMode] = useState(() => localStorage.getItem('loopMode') || 'none');
  const [autoScroll, setAutoScroll] = useState(() => localStorage.getItem('autoScroll') === 'true');
  const [editions, setEditions] = useState([]);

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/edition/type/translation')
      .then(res => res.json())
      .then(data => setEditions(data.data))
      .catch(() => setEditions([]));
  }, []);

  const getEditionLabel = (id) => {
    const edition = editions.find((ed) => ed.identifier === id);
    return edition?.englishName || id;
  };

  useEffect(() => {
    localStorage.setItem('translation', translation);
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
    localStorage.setItem('audioEdition', audioEdition);
    localStorage.setItem('fontScript', fontScript);
    localStorage.setItem('fontSize', fontSize.toString());
    localStorage.setItem('showWordByWord', showWordByWord.toString());
    localStorage.setItem('showTransliteration', showTransliteration.toString());
    localStorage.setItem('playbackSpeed', playbackSpeed);
    localStorage.setItem('loopMode', loopMode);
    localStorage.setItem('autoScroll', autoScroll.toString());
    document.documentElement.className = theme;
  }, [translation, theme, language, audioEdition, fontScript, fontSize, showWordByWord, showTransliteration, playbackSpeed, loopMode, autoScroll]);

  return (
    <SettingsContext.Provider value={{
      translation,
      setTranslation,
      theme,
      setTheme,
      language,
      setLanguage,
      audioEdition,
      setAudioEdition,
      fontScript,
      setFontScript,
      fontSize,
      setFontSize,
      showWordByWord,
      setShowWordByWord,
      showTransliteration,
      setShowTransliteration,
      playbackSpeed,
      setPlaybackSpeed,
      loopMode,
      setLoopMode,
      autoScroll,
      setAutoScroll,
      editions,
      getEditionLabel,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}
