'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getSurahs } from '../lib/api';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useLastRead } from '../hooks/useLastRead';
import ProgressBar from '../components/ProgressBar';

export default function ProgressPage() {
  const [surahs, setSurahs] = useState([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const { getOverallProgress, getRecentlyRead, progress } = useReadingProgress();
  const { lastRead } = useLastRead();

  useEffect(() => {
    const controller = new AbortController();
    getSurahs().then(data => {
      if (!controller.signal.aborted) {
        setSurahs(data.data);
        setLoadingSurahs(false);
      }
    }).catch(() => {
      if (!controller.signal.aborted) setLoadingSurahs(false);
    });
    return () => controller.abort();
  }, []);

  const overall = useMemo(() => getOverallProgress(), [getOverallProgress]);
  const recentlyRead = useMemo(() => getRecentlyRead(), [getRecentlyRead]);

  const mergedSurahs = useMemo(() => {
    if (!surahs.length) return [];
    return surahs.map(s => {
      const p = progress[String(s.number)];
      return {
        ...s,
        read: p?.maxAyahRead || 0,
        total: p?.totalAyahs || s.numberOfAyahs,
        percent: p ? Math.round((p.maxAyahRead / s.numberOfAyahs) * 100) : 0,
        completed: p ? p.maxAyahRead >= s.numberOfAyahs : false,
        lastRead: p?.lastRead || 0,
        started: !!p,
      };
    });
  }, [surahs, progress]);

  const [sortBy, setSortBy] = useState('recent');
  const [filter, setFilter] = useState('all');

  const displaySurahs = useMemo(() => {
    let list = [...mergedSurahs];

    if (filter === 'started') list = list.filter(s => s.started);
    else if (filter === 'completed') list = list.filter(s => s.completed);
    else if (filter === 'unstarted') list = list.filter(s => !s.started);

    if (sortBy === 'recent') {
      list.sort((a, b) => (b.lastRead || 0) - (a.lastRead || 0));
    } else if (sortBy === 'progress') {
      list.sort((a, b) => b.percent - a.percent || a.number - b.number);
    } else {
      list.sort((a, b) => a.number - b.number);
    }

    return list;
  }, [mergedSurahs, sortBy, filter]);

  if (loadingSurahs) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-headline-lg font-display font-semibold text-center mb-6">Reading Progress</h1>
        <div className="max-w-2xl mx-auto space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-3" />
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-headline-lg font-display font-semibold text-center mb-6">Reading Progress</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Overall stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-body">Overview</h2>
            <span className="text-3xl font-bold text-primary font-body">{overall.percent}%</span>
          </div>
          <ProgressBar percent={overall.percent} size="lg" showLabel={false} />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white font-body">{overall.totalRead.toLocaleString()}</p>
              <p className="text-gray-500 dark:text-gray-400 font-body">Ayahs Read</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white font-body">{overall.totalAyahs.toLocaleString()}</p>
              <p className="text-gray-500 dark:text-gray-400 font-body">Total Ayahs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white font-body">{overall.totalSurahsStarted}</p>
              <p className="text-gray-500 dark:text-gray-400 font-body">Surahs Started</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white font-body">{overall.completedSurahs}</p>
              <p className="text-gray-500 dark:text-gray-400 font-body">Completed</p>
            </div>
          </div>
        </div>

        {/* Continue reading */}
        {lastRead && (
          <Link
            href={`/surah/${lastRead.surahNumber}/${lastRead.ayahNumber}`}
            className="block bg-gradient-to-r from-primary to-primary-600 rounded-2xl p-5 shadow-elevation-2 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">play_arrow</span>
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium font-body">Continue Reading</p>
                <p className="text-white font-semibold font-body">{lastRead.surahName} • Ayah {lastRead.ayahNumber}</p>
              </div>
              <span className="material-symbols-outlined text-white ml-auto text-[20px]">arrow_forward</span>
            </div>
          </Link>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-500 dark:text-gray-400 font-body">Sort:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm bg-white dark:bg-gray-800 border border-outline-variant/50 dark:border-outline-variant-dark/50 rounded-full px-3 py-1.5 text-gray-900 dark:text-gray-100 font-body focus:ring-2 focus:ring-primary"
            >
              <option value="recent">Recently Read</option>
              <option value="number">Surah Number</option>
              <option value="progress">Progress</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm text-gray-500 dark:text-gray-400 font-body">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="text-sm bg-white dark:bg-gray-800 border border-outline-variant/50 dark:border-outline-variant-dark/50 rounded-full px-3 py-1.5 text-gray-900 dark:text-gray-100 font-body focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Surahs</option>
              <option value="started">Started</option>
              <option value="completed">Completed</option>
              <option value="unstarted">Not Started</option>
            </select>
          </div>
        </div>

        {/* Surah progress list */}
        <div className="space-y-2">
          {displaySurahs.map(surah => (
            <Link
              key={surah.number}
              href={`/surah/${surah.number}`}
              className="block bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2 hover:ring-primary/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary-container dark:bg-primary-container-dark flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0 font-body">
                  {surah.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="truncate">
                      <span className="font-medium text-gray-900 dark:text-white text-sm font-body">{surah.englishName}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 font-body">{surah.name}</span>
                    </div>
                    <span className={`text-xs font-medium flex-shrink-0 ml-2 font-body ${
                      surah.completed ? 'text-green-600 dark:text-green-400' : surah.started ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {surah.completed ? 'Complete' : surah.started ? `${surah.read}/${surah.total}` : 'Not started'}
                    </span>
                  </div>
                  <ProgressBar percent={surah.percent} size="sm" showLabel={surah.started} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {displaySurahs.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-[64px] text-gray-300 dark:text-gray-600 mb-4 block">bar_chart</span>
            <p className="text-gray-500 dark:text-gray-400 font-body">No surahs match the current filter.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 font-body">Start reading to track your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}
