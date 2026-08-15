'use client';
import Link from 'next/link';
import { useNotes } from '../hooks/useNotes';

export default function NotesPage() {
  const { allNotes, count } = useNotes();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-headline-lg font-display font-semibold text-gray-900 dark:text-white">My Notes</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-body">
              {count === 0 ? 'No notes yet' : `${count} note${count === 1 ? '' : 's'}`}
            </p>
          </div>
          <Link
            href="/surahs"
            className="text-sm px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-600 transition-colors font-medium font-body"
          >
            Browse Surahs
          </Link>
        </div>

        {allNotes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40">
            <span className="material-symbols-outlined text-[64px] text-gray-300 dark:text-gray-600 mb-4 block">edit_note</span>
            <h2 className="text-lg font-semibold font-body mb-2">No notes yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto font-body">
              Open any ayah and tap the note icon to start writing your reflections.
            </p>
            <Link
              href="/surahs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white hover:bg-primary-600 transition-colors font-medium font-body"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              Start Reading
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allNotes.map((note) => (
              <Link
                key={`${note.surah}:${note.ayah}`}
                href={`/surah/${note.surah}#ayah-${note.ayah}`}
                className="block bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm ring-1 ring-outline-variant/40 dark:ring-outline-variant-dark/40 hover:shadow-elevation-2 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-primary-container dark:bg-primary-container-dark text-primary px-2 py-0.5 rounded-full font-body">
                    {note.surah}:{note.ayah}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-body">
                    Surah {note.surah}
                  </span>
                  <span className="text-xs text-gray-300 dark:text-gray-600 ml-auto font-body">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 font-body">
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
