import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
