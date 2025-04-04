import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner = () => (
  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-yellow-800 dark:text-yellow-200">
        <strong>Warning:</strong> This calculator is for educational purposes only. These tools generate commands that you can copy and paste into your terminal. Always verify commands before executing in production. 
        Double-check device paths before copying and pasting commands. Devices shown as /dev/sdX must be replaced with actual device paths. Always consult the{' '}
        <a 
          href="https://openzfs.github.io/openzfs-docs/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline hover:text-yellow-900 dark:hover:text-yellow-100"
        >
          official OpenZFS documentation.
        </a>
      </div>
    </div>
  </div>
);

export default DisclaimerBanner;