'use client';
import Link from 'next/link';
import { useState, useCallback, memo } from 'react';

const Header = memo(function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-teal-600">
            Quran Web App
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <Link href="/surahs" className="hover:text-teal-600">Surahs</Link>
            <Link href="/search" className="hover:text-teal-600">Search</Link>
            <Link href="/bookmarks" className="hover:text-teal-600">Bookmarks</Link>
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="py-2 hover:text-teal-600">Home</Link>
              <Link href="/surahs" className="py-2 hover:text-teal-600">Surahs</Link>
              <Link href="/search" className="py-2 hover:text-teal-600">Search</Link>
              <Link href="/bookmarks" className="py-2 hover:text-teal-600">Bookmarks</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;