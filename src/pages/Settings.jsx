import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import LanguageSelector from '../components/LanguageSelector';
import TranslationSelector from '../components/TranslationSelector';
import AudioEditionSelector from '../components/AudioEditionSelector';

export default function Settings() {
  const { translation, setTranslation, theme, setTheme } = useContext(SettingsContext);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">⚙️ Settings</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Language</label>
        <LanguageSelector />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Translation</label>
        <TranslationSelector />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Audio Reciter</label>
        <AudioEditionSelector />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Theme</label>
        <div className="flex gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`px-4 py-2 border rounded ${theme === 'light' ? 'bg-gray-200' : ''}`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-4 py-2 border rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : ''}`}
          >
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}
