import React from 'react';
import { Info } from 'lucide-react';
import { SECTOR_SIZES } from '../../constants';

const Advanced = ({
  ashift,
  slog,
  l2arc,
  slogMirrored,
  onUpdateAshift,
  onToggleSlog,
  onUpdateSlog,
  onToggleL2arc,
  onUpdateL2arc,
  onToggleSlogMirror
}) => {
  return (
    <div>
      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">Advanced Options</h4>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
            Sector Size (ashift)
          </label>
          <select
            value={ashift}
            onChange={(e) => onUpdateAshift(Number(e.target.value))}
            className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 
                     rounded text-gray-900 dark:text-gray-200 transition-colors"
          >
            {SECTOR_SIZES.map(size => (
              <option key={size} value={Math.log2(size)}>
                {size} bytes (ashift={Math.log2(size)})
              </option>
            ))}
          </select>
        </div>
        
        {/* SLOG Configuration */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
              SLOG Device
            </label>
            <div className="relative group">
              <Info size={16} className="text-gray-500 dark:text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-white dark:bg-neutral-800 
                            rounded shadow-lg text-xs text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 
                            transition-opacity pointer-events-none">
                SLOG (ZFS Intent Log) should use low-latency devices. Recommended minimum size is 16GB. 
                For redundancy, consider mirrored SLOG devices.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <select
                value={slog.length > 0 ? 'enabled' : 'disabled'}
                onChange={(e) => onToggleSlog(e.target.value === 'enabled')}
                className="flex-1 p-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 
                         rounded text-gray-900 dark:text-gray-200 transition-colors"
              >
                <option value="disabled">Disabled</option>
                <option value="enabled">Enabled</option>
              </select>
              {slog.length > 0 && (
                <>
                  <input
                    type="number"
                    value={slog[0].size}
                    onChange={(e) => onUpdateSlog({ size: Number(e.target.value) })}
                    className="w-20 p-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 
                             rounded text-gray-900 dark:text-gray-200 transition-colors"
                    min="1"
                  />
                  <select
                    value={slog[0].unit}
                    onChange={(e) => onUpdateSlog({ unit: e.target.value })}
                    className="w-20 p-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 
                             rounded text-gray-900 dark:text-gray-200 transition-colors"
                  >
                    <option value="GB">GB</option>
                    <option value="TB">TB</option>
                  </select>
                </>
              )}
            </div>
            {slog.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={slogMirrored}
                  onChange={(e) => onToggleSlogMirror(e.target.checked)}
                  className="rounded border-gray-300 dark:border-neutral-600"
                />
                Mirror SLOG devices
              </label>
            )}
          </div>
        </div>

        {/* L2ARC Configuration */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
              L2ARC Cache
            </label>
            <div className="relative group">
              <Info size={16} className="text-gray-500 dark:text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-white dark:bg-neutral-800 
                            rounded shadow-lg text-xs text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 
                            transition-opacity pointer-events-none">
                L2ARC provides second-level adaptive replacement cache. Uses system memory (RAM) for metadata, 
                approximately 100 bytes per block cached.
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={l2arc.length > 0 ? 'enabled' : 'disabled'}
              onChange={(e) => onToggleL2arc(e.target.value === 'enabled')}
              className="flex-1 p-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 
                       rounded text-gray-900 dark:text-gray-200 transition-colors"
            >
              <option value="disabled">Disabled</option>
              <option value="enabled">Enabled</option>
            </select>
            {l2arc.length > 0 && (
              <>
                <input
                  type="number"
                  value={l2arc[0].size}
                  onChange={(e) => onUpdateL2arc({ size: Number(e.target.value) })}
                  className="w-20 p-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 
                           rounded text-gray-900 dark:text-gray-200 transition-colors"
                  min="1"
                />
                <select
                  value={l2arc[0].unit}
                  onChange={(e) => onUpdateL2arc({ unit: e.target.value })}
                  className="w-20 p-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 
                           rounded text-gray-900 dark:text-gray-200 transition-colors"
                >
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advanced;