import './globals.css';
import { SettingsProvider } from './context/SettingsContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioPlayerBar from './components/AudioPlayerBar';
import ErrorBoundary from './components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Quran Web App</title>
        <meta name="description" content="Read the Quran with translations and audio" />
      </head>
      <body>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </body>
    </html>
  );
}