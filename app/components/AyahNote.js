'use client';
import { useState, useRef, useEffect } from 'react';

export default function AyahNote({ note, onSave, onDelete }) {
  const [editing, setEditing] = useState(!note);
  const [text, setText] = useState(note?.text || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSave(trimmed);
    } else {
      onDelete();
    }
    setEditing(false);
  };

  const handleDelete = () => {
    setText('');
    onDelete();
    setEditing(false);
  };

  if (!editing && !note) return null;

  return (
    <div className="mt-3 border-t border-gray-100 dark:border-gray-700/50 pt-3">
      {editing ? (
        <div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="Write a note about this ayah..."
            className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 resize-none outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            rows={2}
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleSave}
              className="text-xs px-3 py-1 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => { setText(note?.text || ''); setEditing(false); }}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            {note && (
              <button
                onClick={handleDelete}
                className="text-xs px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="group cursor-pointer"
          onClick={() => setEditing(true)}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/></svg>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">My Note</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {note.text}
          </p>
        </div>
      )}
    </div>
  );
}
