import './globals.css';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioPlayerBar from './components/AudioPlayerBar';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import MainWrapper from './components/MainWrapper';

const SITE_URL = 'https://quran.learntrueislam.com';
const BUILD_VERSION = Date.now().toString();

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Al-Quran - Read & Listen to the Holy Quran',
    template: '%s | Al-Quran',
  },
  description: 'Read and listen to the Holy Quran with Arabic text, English translation, and high-quality audio recitations from all 114 Surahs.',
  openGraph: {
    type: 'website',
    siteName: 'Al-Quran',
    locale: 'en_US',
    title: 'Al-Quran - Read & Listen to the Holy Quran',
    description: 'Read and listen to the Holy Quran with Arabic text, English translation, and high-quality audio recitations.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Quran - Read & Listen to the Holy Quran',
    description: 'Read and listen to the Holy Quran with Arabic text, English translation, and high-quality audio recitations.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
        <meta name="build-version" content={BUILD_VERSION} />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
              // Clear cache on version change
              const storedVersion = localStorage.getItem('buildVersion');
              if (storedVersion !== '${BUILD_VERSION}') {
                localStorage.setItem('buildVersion', '${BUILD_VERSION}');
                if ('caches' in window) {
                  caches.keys().then(names => names.forEach(name => caches.delete(name)));
                }
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body className="bg-surface dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors font-body">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-full">
          Skip to content
        </a>
        <ErrorBoundary>
          <AudioPlayerProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <MainWrapper>{children}</MainWrapper>
              <AudioPlayerBar />
              <BottomNav />
              <Footer />
            </div>
          </AudioPlayerProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
