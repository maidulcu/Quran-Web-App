'use client';
import Link from 'next/link';
import { useState, useCallback, useEffect, memo } from 'react';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/surahs', label: 'Surahs' },
  { href: '/mushaf/1', label: 'Mushaf' },
  { href: '/juzs', label: 'Juz' },
  { href: '/search', label: 'Search' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/progress', label: 'Progress' },
];

const Header = memo(function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const isActive = useCallback((href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }, [pathname]);

  return (
    <header className={`sticky top-0 z-40 transition-shadow duration-300 ${scrolled ? 'shadow-elevation-2' : ''} bg-white/95 dark:bg-surface-container-dark/95 backdrop-blur-glass`}>
      <div className="flex items-center justify-between px-4 h-14">
        {/* Leading: Avatar with reading progress */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-full bg-primary-container dark:bg-primary-container-dark flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary text-lg fill">person</span>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-outline-variant dark:text-outline-variant-dark" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="65, 100" className="text-primary" />
            </svg>
          </div>
          <span className="text-headline-lg-mobile font-display font-semibold text-primary dark:text-primary-300 hidden sm:block">
            Al-Quran
          </span>
        </Link>

        {/* Center title (mobile) */}
        <span className="text-headline-lg-mobile font-display font-semibold text-primary dark:text-primary-300 sm:hidden">
          Al-Quran
        </span>

        {/* Trailing: Settings + Desktop nav */}
        <div className="flex items-center gap-1">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm rounded-full transition-colors font-body ${
                  isActive(item.href)
                    ? 'bg-primary-container dark:bg-primary-container-dark text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {dark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Settings (mobile hamburger) */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMenuOpen ? 'close' : 'settings'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col space-y-1 px-4 border-t border-outline-variant/30 pt-2">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`py-2.5 px-4 rounded-full transition-colors font-body ${
                isActive(item.href)
                  ? 'bg-primary-container dark:bg-primary-container-dark text-primary font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
});

export default Header;
