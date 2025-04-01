import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AudioPlayerProvider>
          <App />
        </AudioPlayerProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);