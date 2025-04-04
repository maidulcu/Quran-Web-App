import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';
import SurahDrawer from './SurahDrawer';

export default function Header() {
  const { theme, setTheme } = useContext(SettingsContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [surahs, setSurahs] = useState([]);
  const location = useLocation();
  const isSurahPage = location.pathname.startsWith('/surah/');

  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-blue-600 font-semibold' : 'text-gray-700';

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    fetch('https://api.alquran.cloud/v1/surah')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setSurahs(data.data);
        }
      })
      .catch((err) => console.error('Failed to load Surahs', err));
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="text-xl font-bold">
      <NavLink to="/" className="flex items-center space-x-2 text-gray-800 dark:text-white">
      <img src="/quran-logo.png" alt="Quran Logo" className="h-8 w-auto" />
    </NavLink>
      </div>
      <nav className="flex items-center space-x-4">
        {isSurahPage && (
          <>
            <button onClick={() => setDrawerOpen(true)} className="text-sm font-medium text-teal-600 hover:text-teal-800">
              📖 Surahs
            </button>
            <SurahDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} surahs={surahs} />
          </>
        )}
        <NavLink to="/search" className={navLinkClass}>Search</NavLink>
        <NavLink to="/bookmarks" className={navLinkClass}>Bookmarks</NavLink>
        <button onClick={toggleTheme} className="ml-2 text-xl">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  );
}