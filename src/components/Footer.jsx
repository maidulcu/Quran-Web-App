import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <p className="mb-2">
        Made with ❤️ for the Ummah — {new Date().getFullYear()}
      </p>
      <p>
        <Link to="/about" className="text-blue-600 dark:text-blue-400 hover:underline">About</Link>
        {' • '}
        <Link to="/settings" className="text-blue-600 dark:text-blue-400 hover:underline">Settings</Link>
      </p>
    </footer>
  );
}
