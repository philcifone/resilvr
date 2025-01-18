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
      ? ' \\\n  log ' + '/dev/sdX'
      : ''
  }${
    pool.l2arc.length > 0
      ? ' \\\n  cache ' + '/dev/sdX'
      : ''
  }
  -o ashift=${pool.ashift}`;
  }, [pool]);

  const handleCopy = async () => {
    try {
      const text = getZfsCommands();
      
      // Try the modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        textArea.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
        textArea.remove();
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 dark:bg-neutral-700 rounded-lg p-6 mt-8 transition-colors">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">Pool Summary</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column with stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive size={20} className="text-blue-500 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-gray-200">Total Raw Storage:</span>
              </div>
              <span className="text-gray-900 dark:text-gray-200 font-mono">
                {results.totalRaw.toFixed(2)} TB
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator size={20} className="text-green-500 dark:text-green-400" />
                <span className="text-gray-900 dark:text-gray-200">Usable Space:</span>
              </div>
              <span className="text-gray-900 dark:text-gray-200 font-mono">
                {results.usableSpace.toFixed(2)} TB
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-purple-500 dark:text-purple-400" />
                <span className="text-gray-900 dark:text-gray-200">Protection Level:</span>
              </div>
              <span className="text-gray-900 dark:text-gray-200">
                {results.protection}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={20} className="text-yellow-500 dark:text-yellow-400" />
                <span className="text-gray-900 dark:text-gray-200">Storage Efficiency:</span>
              </div>
              <span className="text-gray-900 dark:text-gray-200">
                {results.efficiency.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Right column with commands */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
              Estimated ZFS Commands:
            </h5>
            <div className="relative bg-white dark:bg-neutral-800 rounded-lg p-4">
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 
                         rounded-md transition-colors z-10 group"
                aria-label="Copy ZFS commands"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
                )}
              </button>
              <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre">
                {getZfsCommands()}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <Warnings pool={pool} />
    </div>
  );
};

export default Results;