import React, { useState, useCallback } from 'react';
import { HardDrive, Calculator, Shield, Info, Copy, Check } from 'lucide-react';
import Warnings from './Warnings';

const Results = ({ pool, results }) => {
  const [copied, setCopied] = useState(false);

  const getZfsCommands = useCallback(() => {
    return `zpool create \\
    ${pool.name} \\
    ${pool.vdevs.map(vdev => 
      vdev.type + ' ' + vdev.drives.map(() => '/dev/sdX').join(' ')
    ).join(' \\\n  ')}${
      pool.spares.length > 0 
        ? ' \\\n  spare ' + pool.spares.map(() => '/dev/sdX').join(' ') 
        : ''
    }${
      pool.slog.length > 0
        ? ' \\\n  log ' + (pool.slogMirrored ? 'mirror ' : '') + Array(pool.slogMirrored ? 2 : 1).fill('/dev/sdX').join(' ')
        : ''
    }${
      pool.l2arc.length > 0
        ? ' \\\n  cache ' + '/dev/sdX'
        : ''
    } -o ashift=${pool.ashift}`;
  }, [pool]);

  const handleCopy = async () => {
    try {
      const text = getZfsCommands();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-neutral-700 rounded-lg p-4 sm:p-6 transition-colors">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">Pool Summary</h4>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Total Raw Storage */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <HardDrive size={20} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Raw Storage</span>
                <span className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  {results.totalRaw.toFixed(2)} TB
                </span>
              </div>
            </div>
          </div>

          {/* Usable Space */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Calculator size={20} className="text-green-500 dark:text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Usable Space</span>
                <span className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  {results.usableSpace.toFixed(2)} TB
                </span>
              </div>
            </div>
          </div>

          {/* Protection Level */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Shield size={20} className="text-purple-500 dark:text-purple-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Protection Level</span>
                <span className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  {results.protection}
                </span>
              </div>
            </div>
          </div>

          {/* Storage Efficiency */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Info size={20} className="text-yellow-500 dark:text-yellow-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">Storage Efficiency</span>
                <span className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  {results.efficiency.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ZFS Commands */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Estimated ZFS Commands
            </h5>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md 
                       transition-colors flex items-center gap-2"
              aria-label="Copy ZFS commands"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-sm text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="relative bg-gray-50 dark:bg-neutral-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
              {getZfsCommands()}
            </pre>
          </div>
        </div>
      </div>

      <Warnings pool={pool} />
    </div>
  );
};

export default Results;