import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SurahList from './pages/SurahList';
import SurahDetail from './pages/SurahDetail';
import Search from './pages/Search';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import Header from './components/Header';
import ScrollToTop from './components/ScrollToTop';
import AudioPlayerBar from './components/AudioPlayerBar';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ScrollToTop />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surahs" element={<SurahList />} />
          <Route path="/surah/:id" element={<SurahDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <AudioPlayerBar />
      <Footer />
    </div>
  );
}

export default App;