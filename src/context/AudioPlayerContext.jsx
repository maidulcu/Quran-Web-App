import React, { createContext, useContext, useReducer, useRef } from 'react';

const AudioPlayerContext = createContext();

const initialState = {
  currentAyah: null,
  isPlaying: false,
  audioUrl: '',
  playbackTime: 0,
  duration: 0,
  queue: [],
  autoPlayEnabled: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_AYAH':
      return {
        ...state,
        currentAyah: action.payload.ayah,
        audioUrl: action.payload.audioUrl,
        isPlaying: true,
      };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_TIME':
      return { ...state, playbackTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'SET_AUTOPLAY':
      return { ...state, autoPlayEnabled: action.payload };
    default:
      return state;
  }
}

export function AudioPlayerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const audioRef = useRef(null);

  const loadAndPlay = (ayah, audioUrl) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    dispatch({ type: 'SET_AYAH', payload: { ayah, audioUrl } });

    audio.addEventListener('loadedmetadata', () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    });

    audio.addEventListener('timeupdate', () => {
      dispatch({ type: 'SET_TIME', payload: audio.currentTime });
    });

    audio.addEventListener('ended', () => {
      const currentIndex = state.queue.findIndex(
        (a) => a.number === state.currentAyah?.number && a.audioUrl === state.audioUrl
      );
      const isLast = currentIndex === state.queue.length - 1;

      if (state.autoPlayEnabled && !isLast && currentIndex >= 0) {
        const next = state.queue[currentIndex + 1];
        if (next) {
          loadAndPlay(next, next.audioUrl);
        }
      } else {
        dispatch({ type: 'SET_PLAYING', payload: false });
        dispatch({ type: 'SET_QUEUE', payload: [] });
        dispatch({ type: 'SET_AUTOPLAY', payload: false });
      }
    });

    audio.play();
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play();
        dispatch({ type: 'SET_PLAYING', payload: true });
      } else {
        audio.pause();
        dispatch({ type: 'SET_PLAYING', payload: false });
      }
    }
  };

  const setQueue = (queue) => {
    dispatch({ type: 'SET_QUEUE', payload: queue });
  };

  const value = {
    ...state,
    loadAndPlay,
    togglePlayPause,
    setQueue,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
