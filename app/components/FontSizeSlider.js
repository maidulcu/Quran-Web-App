'use client';
import { useFontSize } from '../hooks/useFontSize';

export default function FontSizeSlider() {
  const { label, increase, decrease, canIncrease, canDecrease } = useFontSize();

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Size</span>
      <button
        onClick={decrease}
        disabled={!canDecrease}
        className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-medium"
        aria-label="Decrease font size"
      >
        A-
      </button>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-6 text-center tabular-nums">
        {label}
      </span>
      <button
        onClick={increase}
        disabled={!canIncrease}
        className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm font-medium"
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
