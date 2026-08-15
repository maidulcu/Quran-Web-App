'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

const TABS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/surahs', label: 'Surahs', icon: 'menu_book' },
  { href: '/mushaf/1', label: 'Mushaf', icon: 'auto_stories' },
  { href: '/bookmarks', label: 'Saved', icon: 'bookmark' },
  { href: '/search', label: 'Search', icon: 'search' },
];

const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-panel border-t border-outline-variant/30 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-1">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 min-w-[48px] ${
                active
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className={`relative flex items-center justify-center w-10 h-6 rounded-full transition-all duration-200 ${
                active ? 'bg-primary-container dark:bg-primary-container-dark' : ''
              }`}>
                <span className={`material-symbols-outlined text-[22px] ${active ? 'fill' : ''}`}>
                  {tab.icon}
                </span>
              </span>
              <span className={`text-[10px] leading-tight font-medium ${active ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

export default BottomNav;
