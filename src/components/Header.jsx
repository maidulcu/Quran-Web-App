import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';

export default function Header() {
  const { theme, setTheme } = useContext(SettingsContext);

  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-blue-600 font-semibold' : 'text-gray-700';

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="text-xl font-bold">
        <NavLink to="/" className="text-gray-800 dark:text-white">Quran Web App</NavLink>
      </div>
      <nav className="flex items-center space-x-4">
        <NavLink to="/surahs" className={navLinkClass}>Surahs</NavLink>
        <NavLink to="/search" className={navLinkClass}>Search</NavLink>
        <NavLink to="/bookmarks" className={navLinkClass}>Bookmarks</NavLink>
        <NavLink to="/settings" className={navLinkClass}>Settings</NavLink>
        <button onClick={toggleTheme} className="ml-2 text-xl">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  );
}