import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [translation, setTranslation] = useState('en.sahih');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [translationEdition, setTranslationEdition] = useState('en.sahih');
  const [audioEdition, setAudioEdition] = useState('ar.alafasy');

  useEffect(() => {
    const savedTranslation = localStorage.getItem('translation');
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');
    const savedTranslationEdition = localStorage.getItem('translationEdition');
    const savedAudioEdition = localStorage.getItem('audioEdition');
    if (savedTranslation) setTranslation(savedTranslation);
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTranslationEdition) setTranslationEdition(savedTranslationEdition);
    if (savedAudioEdition) setAudioEdition(savedAudioEdition);
  }, []);

  useEffect(() => {
    localStorage.setItem('translation', translation);
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
    localStorage.setItem('translationEdition', translationEdition);
    localStorage.setItem('audioEdition', audioEdition);
    document.documentElement.className = theme;
  }, [translation, theme, language, translationEdition, audioEdition]);

  return (
    <SettingsContext.Provider value={{
      translation,
      setTranslation,
      theme,
      setTheme,
      language,
      setLanguage,
      translationEdition,
      setTranslationEdition,
      audioEdition,
      setAudioEdition
    }}>
      {children}
    </SettingsContext.Provider>
  );
}
