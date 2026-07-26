import './globals.css';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioPlayerBar from './components/AudioPlayerBar';
import ErrorBoundary from './components/ErrorBoundary';

const SITE_URL = 'https://quran-web-app.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Quran Web App - Read & Listen to the Holy Quran',
    template: '%s | Quran Web App',
  },
  description: 'Read and listen to the Holy Quran with Arabic text, English translation, and high-quality audio recitations from all 114 Surahs.',
  openGraph: {
    type: 'website',
    siteName: 'Quran Web App',
    locale: 'en_US',
    title: 'Quran Web App - Read & Listen to the Holy Quran',
    description: 'Read and listen to the Holy Quran with Arabic text, English translation, and high-quality audio recitations.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quran Web App - Read & Listen to the Holy Quran',
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
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
          Skip to content
        </a>
        <ErrorBoundary>
          <AudioPlayerProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <AudioPlayerBar />
              <Footer />
            </div>
          </AudioPlayerProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
