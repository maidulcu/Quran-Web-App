import React, { useState, useContext, useEffect } from 'react';
import TranslationSelectorDrawer from './TranslationSelectorDrawer';
import { SettingsContext } from '../context/SettingsContext';

export default function SettingsDrawer({ onClose }) {
  const {
    theme, setTheme,
    fontScript, setFontScript,
    fontSize, setFontSize,
    playbackSpeed, setPlaybackSpeed,
    loopMode, setLoopMode,
    autoScroll, setAutoScroll,
    translation, setTranslation,
    getEditionLabel,
    showWordByWord, setShowWordByWord,
    showTransliteration, setShowTransliteration,
    audioEdition, setAudioEdition,
  } = useContext(SettingsContext);
  const [tab, setTab] = useState('translation');
  const [showTranslationSelector, setShowTranslationSelector] = useState(false);

  const tabs = [
    { key: 'translation', label: 'Translation' },
    { key: 'reading', label: 'Reading' },
    { key: 'audio', label: 'Audio' },
  ];


  return (
    <>
      <div className="fixed top-0 right-0 w-96 h-full bg-white dark:bg-gray-900 shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl">✕</button>
      </div>

      <div className="flex justify-around border-b dark:border-gray-700">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === 'translation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-1">Translation Language</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Choose your preferred language for translations.
              </p>
              <button
                onClick={() => setShowTranslationSelector(true)}
                className="w-full text-left border rounded px-2 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
              >
                {getEditionLabel(translation)}
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-1">Word-by-Word</h3>
              <div className="space-y-2">
                <label className="flex items-center text-sm space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox rounded"
                    checked={showWordByWord}
                    onChange={(e) => setShowWordByWord(e.target.checked)}
                  />
                  <span>Enable Word-by-Word Translation</span>
                </label>
                <label className="flex items-center text-sm space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox rounded"
                    checked={showTransliteration}
                    onChange={(e) => setShowTransliteration(e.target.checked)}
                  />
                  <span>Enable Transliteration</span>
                </label>
              </div>
            </div>
          </div>
        )}
        {tab === 'reading' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-1">Theme</h3>
              <div className="flex space-x-2">
                {['auto', 'light', 'sepia', 'dark'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={`px-3 py-1 border rounded text-sm transition ${
                      theme === mode
                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                The system theme automatically adapts to your light/dark mode settings.
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-1">Quran Font</h3>
              <div className="flex space-x-2 mb-2">
              {['Uthmani', 'IndoPak'].map((script) => (
                  <button
                    key={script}
                    onClick={() => setFontScript(script)}
                    className={`px-3 py-1 border rounded text-sm transition ${
                      fontScript === script
                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {script}
                  </button>
                ))}
              </div>
              <label className="block text-xs mb-1">Style</label>
              <select className="w-full border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-white">
                <option>King Fahad Complex</option>
              </select>
              <label className="block text-xs mt-3 mb-1">Font Size</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setFontSize(Math.max(1, fontSize - 1))}
                  className="px-2 py-1 border rounded text-sm"
                >
                  −
                </button>
                <span className="text-sm">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(5, fontSize + 1))}
                  className="px-2 py-1 border rounded text-sm"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                King Fahad Complex (V1 and V2) Fonts provide higher quality but take longer to load.
              </p>
            </div>
          </div>
        )}
        {tab === 'audio' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-1">Audio Reciter</h3>
              <select
                value={audioEdition}
                onChange={(e) => setAudioEdition(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
              >
                <option value="ar.alafasy">Mishary Alafasy</option>
                <option value="ar.husary">Al-Husary</option>
                <option value="ar.abdurrahmaan">Abdur Rahmaan As-Sudais</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-1">Playback Speed</h3>
              <select
                className="w-full border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-white"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(e.target.value)}
              >
                <option value="0.75">0.75x</option>
                <option value="1">1x (Normal)</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-1">Loop Playback</h3>
              <div className="flex space-x-2">
                {['none', 'ayah', 'surah'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setLoopMode(mode)}
                    className={`px-3 py-1 border rounded text-sm transition ${
                      loopMode === mode
                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="flex items-center text-sm space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox rounded"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                />
                <span>Auto-scroll to current Ayah</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
    {showTranslationSelector && (
      <TranslationSelectorDrawer
        selectedValue={translation}
        onSelect={(val) => {
          setTranslation(val);
          setShowTranslationSelector(false);
        }}
        onClose={() => setShowTranslationSelector(false)}
      />
    )}
    </>
  );
}
