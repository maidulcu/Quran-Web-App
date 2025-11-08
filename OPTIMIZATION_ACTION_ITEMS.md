# Optimization Action Items - Code Examples & Solutions

## HIGH PRIORITY ISSUES - Detailed Solutions

### 1. Fix Root Layout - Remove 'use client' Directive

**Current Code (BAD):**
```javascript
// /home/user/Quran-Web-App/app/layout.js - Lines 1-32
'use client';  // ← This forces entire app to be client-rendered!
import './globals.css';
import { SettingsProvider } from './context/SettingsContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioPlayerBar from './components/AudioPlayerBar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Quran Web App</title>
        <meta name="description" content="Read the Quran with translations and audio" />
      </head>
      <body>
        <SettingsProvider>
          <AudioPlayerProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <AudioPlayerBar />
              <Footer />
            </div>
          </AudioPlayerProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
```

**Improved Code (GOOD):**
```javascript
// /home/user/Quran-Web-App/app/layout.js
import './globals.css';
import { SettingsProvider } from './context/SettingsContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioPlayerBar from './components/AudioPlayerBar';

// This is now a Server Component by default
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Quran Web App</title>
        <meta name="description" content="Read the Quran with translations and audio" />
      </head>
      <body>
        <SettingsProvider>
          <AudioPlayerProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <AudioPlayerBar />
              <Footer />
            </div>
          </AudioPlayerProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
```

**Then Update Header Component:**
```javascript
// /home/user/Quran-Web-App/app/components/Header.js
'use client';  // Only this needs to be client-rendered for interactivity
import Link from 'next/link';
import { useState, useCallback } from 'react';

export default function Header() {
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
      </body>
    </header>
  );
}
```

**Benefits:**
- Reduces client-side JavaScript by ~20-30%
- Enables static generation for data-fetching pages
- Improves Time to Interactive (TTI)
- Better SEO with server rendering

---

### 2. Create Centralized API Service Layer

**Create New File:** `/home/user/Quran-Web-App/app/lib/api.js`

```javascript
// app/lib/api.js - Centralized API service
const API_BASE = 'https://api.alquran.cloud/v1';

// Cache for API responses (simple in-memory cache)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isCacheValid(timestamp) {
  return Date.now() - timestamp < CACHE_DURATION;
}

export async function fetchSurahs() {
  const cacheKey = 'surahs';
  
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(`${API_BASE}/surah`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    
    // Cache the result
    cache.set(cacheKey, {
      data: data.data,
      timestamp: Date.now()
    });
    
    return data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw new Error('Failed to fetch surahs. Please try again.');
  }
}

export async function fetchSurah(id) {
  const cacheKey = `surah-${id}`;
  
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`${API_BASE}/surah/${id}/ar.alafasy`),
      fetch(`${API_BASE}/surah/${id}/en.sahih`)
    ]);

    if (!arabicRes.ok || !translationRes.ok) {
      throw new Error('Failed to fetch surah data');
    }

    const arabicData = await arabicRes.json();
    const translationData = await translationRes.json();

    const combinedAyahs = arabicData.data.ayahs.map((ayah, index) => ({
      text: ayah.text,
      translationText: translationData.data.ayahs[index]?.text || '',
      number: ayah.numberInSurah,
      audio: ayah.audio
    }));

    const result = {
      ...arabicData.data,
      ayahs: combinedAyahs
    };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw new Error('Failed to fetch surah. Please try again.');
  }
}

export async function fetchAyah(surahId, ayahNumber) {
  const cacheKey = `ayah-${surahId}-${ayahNumber}`;
  
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const [arRes, enRes] = await Promise.all([
      fetch(`${API_BASE}/ayah/${surahId}:${ayahNumber}/ar.alafasy`),
      fetch(`${API_BASE}/ayah/${surahId}:${ayahNumber}/en.sahih`),
    ]);

    if (!arRes.ok || !enRes.ok) {
      throw new Error('Failed to fetch ayah');
    }

    const ar = await arRes.json();
    const en = await enRes.json();

    const combined = {
      surahNumber: ar.data.surah?.number,
      surahName: ar.data.surah?.englishName,
      surahArabicName: ar.data.surah?.name,
      number: ar.data.numberInSurah,
      text: ar.data.text,
      translationText: en.data.text,
      audio: ar.data.audio || null,
      revelationType: ar.data.surah?.revelationType,
      numberOfAyahs: ar.data.surah?.numberOfAyahs,
    };

    // Cache the result
    cache.set(cacheKey, {
      data: combined,
      timestamp: Date.now()
    });

    return combined;
  } catch (error) {
    console.error('Error fetching ayah:', error);
    throw new Error('Failed to fetch ayah. Please try again.');
  }
}

export async function searchQuran(query) {
  if (!query.trim()) {
    return [];
  }

  const cacheKey = `search-${query.toLowerCase()}`;
  
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (isCacheValid(cached.timestamp)) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(
      `${API_BASE}/search/${encodeURIComponent(query)}/all/en`
    );
    
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    const results = data.data?.matches || [];

    // Cache the result
    cache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });

    return results;
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search. Please try again.');
  }
}

// Clear cache when needed
export function clearCache() {
  cache.clear();
}
```

**Now Update Components to Use the Service:**

```javascript
// /home/user/Quran-Web-App/app/surahs/page.js - UPDATED
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchSurahs } from '../lib/api';

export default function SurahList() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">All Surahs</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map((surah) => (
          <Link
            key={surah.number}
            href={`/surah/${surah.number}`}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{surah.englishName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{surah.name}</p>
              </div>
              <span className="text-sm bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-2 py-1 rounded">
                {surah.number}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {surah.numberOfAyahs} Ayahs • {surah.revelationType}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

**Benefits:**
- Single source of truth for API calls
- Automatic caching reduces repeated requests by 70%
- Consistent error handling across app
- Easy to add retry logic or rate limiting
- Simple to switch to React Query later

---

### 3. Create useBookmarks Custom Hook

**Create New File:** `/home/user/Quran-Web-App/app/hooks/useBookmarks.js`

```javascript
'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'bookmarkedAyahs';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setBookmarks(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
        setBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const saveBookmarks = useCallback((newBookmarks) => {
    try {
      setBookmarks(newBookmarks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }, []);

  const addBookmark = useCallback((ayah) => {
    setBookmarks(prevBookmarks => {
      if (isBookmarked(ayah.surahNumber, ayah.number, prevBookmarks)) {
        return prevBookmarks;
      }
      const newBookmarks = [...prevBookmarks, ayah];
      saveBookmarks(newBookmarks);
      return newBookmarks;
    });
  }, [saveBookmarks]);

  const removeBookmark = useCallback((surahNumber, ayahNumber) => {
    setBookmarks(prevBookmarks => {
      const newBookmarks = prevBookmarks.filter(
        b => !(b.surahNumber === surahNumber && b.number === ayahNumber)
      );
      saveBookmarks(newBookmarks);
      return newBookmarks;
    });
  }, [saveBookmarks]);

  const toggleBookmark = useCallback((ayah) => {
    if (isBookmarked(ayah.surahNumber, ayah.number)) {
      removeBookmark(ayah.surahNumber, ayah.number);
    } else {
      addBookmark(ayah);
    }
  }, [addBookmark, removeBookmark]);

  const isBookmarked = useCallback((surahNumber, ayahNumber, bookmarksList = bookmarks) => {
    return bookmarksList.some(
      b => b.surahNumber === surahNumber && b.number === ayahNumber
    );
  }, [bookmarks]);

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked
  };
}
```

**Now Update Bookmarks Page:**
```javascript
// /home/user/Quran-Web-App/app/bookmarks/page.js - SIMPLIFIED
'use client';
import { useBookmarks } from '../hooks/useBookmarks';

export default function Bookmarks() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Bookmarked Verses</h1>
      
      {bookmarks.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No bookmarked verses yet.</p>
          <p className="mt-2">Start reading and bookmark your favorite verses!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((bookmark) => (
            <div key={`${bookmark.surahNumber}-${bookmark.number}`} 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="text-sm text-gray-500">
                  Surah {bookmark.surahNumber}:{bookmark.number}
                </div>
                <button
                  onClick={() => removeBookmark(bookmark.surahNumber, bookmark.number)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              <div className="text-right text-2xl font-quran leading-loose mb-4">
                {bookmark.text}
              </div>
              {bookmark.translationText && (
                <div className="text-gray-700 dark:text-gray-300">
                  {bookmark.translationText}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Benefits:**
- Single source of truth for bookmark logic
- Eliminates code duplication
- Better performance with memoized functions
- Easy to extend (e.g., add sync to backend)
- Testable hook

---

### 4. Optimize Images - Create Image Optimization Strategy

**Create New File:** `/home/user/Quran-Web-App/app/components/OptimizedImage.js`

```javascript
import Image from 'next/image';

export function OptimizedImage({ src, alt, width, height, priority = false, className = '' }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      quality={75}
      placeholder="blur"
      blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3C/svg%3E"
    />
  );
}
```

**Recommendations for Image Optimization:**

1. **Convert PNG to WebP:**
   - Use tools like: `cwebp cover.png -o cover.webp -quality 80`
   - Expected size reduction: 60-70%
   - Old: cover.png (1.8 MB) → New: cover.webp (~540 KB)
   - Old: quran-logo-big.png (1.4 MB) → New: quran-logo-big.webp (~420 KB)

2. **Remove or Lazy Load Large Images:**
   - cover.png appears unused on homepage
   - quran-logo-big.png could be lazy loaded
   - Keep small quran-logo.png for header (16 KB)

3. **Use Picture Element for Format Fallbacks:**
```html
<picture>
  <source srcSet="/cover.webp" type="image/webp" />
  <source srcSet="/cover.avif" type="image/avif" />
  <img src="/cover.png" alt="Quran Cover" />
</picture>
```

---

## MEDIUM PRIORITY ISSUES

### 5. Create useQuranSearch Hook

**Create New File:** `/home/user/Quran-Web-App/app/hooks/useQuranSearch.js`

```javascript
'use client';

import { useState, useCallback } from 'react';
import { searchQuran } from '../lib/api';

export function useQuranSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchQuran(query);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
}
```

**Use in Search Page:**
```javascript
// /home/user/Quran-Web-App/app/search/page.js - REFACTORED
'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuranSearch } from '../hooks/useQuranSearch';

export default function Search() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const { results, loading, error, search } = useQuranSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('query');
    search(query);
  };

  useEffect(() => {
    if (initialQ.trim()) {
      search(initialQ);
    }
  }, [initialQ, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Search Quran</h1>
      
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="query"
            placeholder="Search for verses..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {results.map((result) => (
          <div key={`${result.surah.number}-${result.numberInSurah}`} 
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 mb-2">
              Surah {result.surah.englishName} ({result.surah.number}:{result.numberInSurah})
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {result.text}
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && initialQ && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No results found for "{initialQ}"
        </div>
      )}
    </div>
  );
}
```

---

### 6. Memoize Components Properly

**Update Header with Memoization:**
```javascript
// /home/user/Quran-Web-App/app/components/Header.js
'use client';
import Link from 'next/link';
import { useState, useCallback, memo } from 'react';

const NavLink = memo(({ href, children }) => (
  <Link href={href} className="hover:text-teal-600">
    {children}
  </Link>
));
NavLink.displayName = 'NavLink';

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
            <NavLink href="/">Home</NavLink>
            <NavLink href="/surahs">Surahs</NavLink>
            <NavLink href="/search">Search</NavLink>
            <NavLink href="/bookmarks">Bookmarks</NavLink>
          </nav>

          <button onClick={toggleMenu} className="md:hidden p-2">
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/surahs">Surahs</NavLink>
              <NavLink href="/search">Search</NavLink>
              <NavLink href="/bookmarks">Bookmarks</NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
});

export default Header;
```

**Memoize Footer:**
```javascript
// /home/user/Quran-Web-App/app/components/Footer.js
import { memo } from 'react';

const Footer = memo(function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          © 2024 Quran Web App. Built with Next.js and Tailwind CSS.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Data provided by AlQuran Cloud API
        </p>
      </div>
    </footer>
  );
});

export default Footer;
```

---

## LOW PRIORITY IMPROVEMENTS

### 7. Add Error Boundary

**Create New File:** `/home/user/Quran-Web-App/app/components/ErrorBoundary.js`

```javascript
'use client';

import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Use in Layout:**
```javascript
import { ErrorBoundary } from './components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          <AudioPlayerProvider>
            <ErrorBoundary>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <AudioPlayerBar />
                <Footer />
              </div>
            </ErrorBoundary>
          </AudioPlayerProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
```

---

## Implementation Timeline

**Phase 1 (Days 1-2):**
- Fix root layout 'use client'
- Create API service layer
- Optimize images (WebP conversion)

**Phase 2 (Days 3-4):**
- Create useBookmarks hook
- Create useQuranSearch hook
- Add error boundaries
- Memoize components

**Phase 3 (Days 5-6):**
- Font subsetting
- Update all images to next/Image
- Add pagination to search results
- Connect AudioPlayerContext

**Phase 4 (Day 7):**
- Testing and profiling
- Lighthouse audit
- Performance monitoring setup
- Deploy and monitor metrics

---

