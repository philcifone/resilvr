import React from 'react';
import ThemeToggle from '../ThemeToggle';

const Toolbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ZFS Pool Designer
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/philcifone"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 mr-12 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-blue-600 dark:text-blue-400 underline"
            aria-label="View on GitHub"
          >
            View on GitHub
          </a>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Toolbar;
