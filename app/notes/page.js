'use client';
import Link from 'next/link';
import { useNotes } from '../hooks/useNotes';

export default function NotesPage() {
  const { allNotes, count } = useNotes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Notes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {count === 0 ? 'No notes yet' : `${count} note${count === 1 ? '' : 's'}`}
            </p>
          </div>
          <Link
            href="/surahs"
            className="text-sm px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            Browse Surahs
          </Link>
        </div>

        {allNotes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No notes yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Open any ayah and tap the note icon to start writing your reflections.
            </p>
            <Link
              href="/surahs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              Start Reading
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allNotes.map((note) => (
              <Link
                key={`${note.surah}:${note.ayah}`}
                href={`/surah/${note.surah}#ayah-${note.ayah}`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm ring-1 ring-gray-200/60 dark:ring-gray-700/60 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-2 py-0.5 rounded-full">
                    {note.surah}:{note.ayah}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Surah {note.surah}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-gray-600 ml-auto">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {note.text}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
