import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import SurahList from './pages/SurahList';
import SurahDetail from './pages/SurahDetail';
import Search from './pages/Search';
import Bookmarks from './pages/Bookmarks';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import AudioPlayerBar from './components/AudioPlayerBar';
import SettingsDrawer from './components/SettingsDrawer';
import JuzPage from './pages/JuzPage';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <button
          onClick={() => setShowSettings(true)}
          className="fixed bottom-5 right-5 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg"
        >
          ⚙️ Settings
        </button>
        <ScrollToTop />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surahs" element={<SurahList />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/juz" element={<JuzPage />} />
          </Routes>
        </div>
        {showSettings && <SettingsDrawer onClose={() => setShowSettings(false)} />}
        <AudioPlayerBar />
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;