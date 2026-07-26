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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Reading Progress</h1>
        <div className="max-w-2xl mx-auto space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-xl animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-3" />
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Reading Progress</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Overall stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Overview</h2>
            <span className="text-3xl font-bold text-teal-600">{overall.percent}%</span>
          </div>
          <ProgressBar percent={overall.percent} size="lg" showLabel={false} />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overall.totalRead.toLocaleString()}</p>
              <p className="text-gray-500 dark:text-gray-400">Ayahs Read</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overall.totalAyahs.toLocaleString()}</p>
              <p className="text-gray-500 dark:text-gray-400">Total Ayahs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overall.totalSurahsStarted}</p>
              <p className="text-gray-500 dark:text-gray-400">Surahs Started</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overall.completedSurahs}</p>
              <p className="text-gray-500 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        {/* Continue reading */}
        {lastRead && (
          <Link
            href={`/surah/${lastRead.surahNumber}/${lastRead.ayahNumber}`}
            className="block bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-900/30 dark:to-teal-800/20 rounded-xl p-5 ring-1 ring-teal-200/60 dark:ring-teal-700/40 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">Continue Reading</p>
                <p className="text-gray-900 dark:text-white font-semibold">{lastRead.surahName} • Ayah {lastRead.ayahNumber}</p>
              </div>
              <svg className="w-5 h-5 text-teal-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-500 dark:text-gray-400">Sort:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-gray-100"
            >
              <option value="recent">Recently Read</option>
              <option value="number">Surah Number</option>
              <option value="progress">Progress</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm text-gray-500 dark:text-gray-400">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-900 dark:text-gray-100"
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
              href={surah.started ? `/surah/${surah.number}/${surah.read}` : `/surah/${surah.number}`}
              className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 hover:shadow-md hover:ring-teal-200/60 dark:hover:ring-teal-700/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">
                  {surah.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="truncate">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{surah.englishName}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{surah.name}</span>
                    </div>
                    <span className={`text-xs font-medium flex-shrink-0 ml-2 ${
                      surah.completed ? 'text-green-600 dark:text-green-400' : surah.started ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
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
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <p className="text-gray-500 dark:text-gray-400">No surahs match the current filter.</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Start reading to track your progress!</p>
          </div>
        )}
      </div>
    </div>
  );
}
