import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const CompressionSelector = ({ value, onChange }) => {
  const [algorithm, setAlgorithm] = useState(value.split('-')[0] || 'lz4');
  const [level, setLevel] = useState(value.includes('-') ? value.split('-')[1] : '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update parent component when compression settings change
  useEffect(() => {
    if (algorithm === 'off' || algorithm === 'on' || algorithm === 'lz4') {
      onChange(algorithm);
    } else if (level) {
      onChange(`${algorithm}-${level}`);
    } else {
      onChange(algorithm);
    }
  }, [algorithm, level, onChange]);

  return (
    <div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
          Compression Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                   dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
        >
          <option value="off">off (no compression)</option>
          <option value="on">on (default algorithm)</option>
          <option value="lz4">lz4 (recommended)</option>
          <option value="gzip">gzip</option>
          <option value="zstd">zstd (better compression, good performance)</option>
          <option value="zle">zle (zero length encoding)</option>
          <option value="lzjb">lzjb (legacy)</option>
        </select>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
        </button>
        <div className="relative group">
          <Info size={16} className="text-gray-500 dark:text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 
                        bg-white dark:bg-neutral-800 rounded shadow-lg text-xs 
                        text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 
                        transition-opacity pointer-events-none z-10">
            Adjust compression levels for better compression ratio or performance.
            Higher levels = better compression but slower performance.
          </div>
        </div>
      </div>

      {showAdvanced && (
        <div className="ml-4 p-3 border-l-2 border-gray-200 dark:border-neutral-700">
          {algorithm === 'gzip' && (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                GZIP Compression Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                         dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
              >
                <option value="">Default</option>
                <option value="1">1 (fastest)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6 (default)</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9 (best compression)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Lower values = faster compression but larger files.
                Higher values = better compression but slower performance.
              </p>
            </div>
          )}

          {algorithm === 'zstd' && (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                ZSTD Compression Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                         dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
              >
                <option value="">Default (3)</option>
                <option value="1">1 (fastest)</option>
                <option value="2">2</option>
                <option value="3">3 (default)</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19 (best compression)</option>
                <option value="fast-1">fast-1 (fastest)</option>
                <option value="fast-2">fast-2</option>
                <option value="fast-3">fast-3</option>
                <option value="fast-4">fast-4</option>
                <option value="fast-5">fast-5</option>
                <option value="fast-6">fast-6</option>
                <option value="fast-7">fast-7</option>
                <option value="fast-8">fast-8</option>
                <option value="fast-9">fast-9</option>
                <option value="fast-10">fast-10 (less compression)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Standard levels 1-19: Higher values = better compression but slower.
                Fast levels 1-10: Optimized for speed with reasonable compression.
              </p>
            </div>
          )}

          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Current setting:</strong> {value}
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Info size={14} className="mt-0.5 flex-shrink-0" />
        <div>
          <p><strong>Recommendation:</strong> For most workloads, lz4 offers excellent performance/compression balance.</p>
          <p className="mt-1">For archival data, zstd-9 provides better compression with acceptable performance.</p>
        </div>
      </div>
    </div>
  );
};

export default CompressionSelector;