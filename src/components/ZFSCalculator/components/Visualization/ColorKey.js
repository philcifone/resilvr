import React from 'react';

const ColorKey = () => (
  <div className="flex flex-wrap gap-4 mb-4 p-3 bg-white dark:bg-neutral-800 rounded-lg">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-600" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Data</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/50 border border-blue-600" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Mirror Copy</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-900/50 border border-purple-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Parity</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Distributed Parity</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-orange-100 dark:bg-orange-900/50 border border-orange-700" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Hot Spare</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-700" />
      <span className="text-sm text-gray-600 dark:text-gray-400">SLOG</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-cyan-100 dark:bg-cyan-900/50 border border-cyan-700" />
      <span className="text-sm text-gray-600 dark:text-gray-400">L2ARC</span>
    </div>
  </div>
);

export default ColorKey;