import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner = () => (
  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-yellow-800 dark:text-yellow-200">
        <strong>Educational Tool Only:</strong> This calculator is a learning project and should not be used as the sole basis for production system design. Always consult the{' '}
        <a 
          href="https://openzfs.github.io/openzfs-docs/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline hover:text-yellow-900 dark:hover:text-yellow-100"
        >
          official OpenZFS documentation
        </a>
        {' '}and experienced administrators. Calculations are approximate and may not reflect real-world performance.
      </div>
    </div>
  </div>
);

export default DisclaimerBanner;