import React from 'react';
import ZFSToolsContainer from './ZFSToolsContainer';

const ZFSToolsTab = ({ poolName }) => {
  return (
    <div className="space-y-6">
      <div className="py-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          ZFS Management Tools
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tools to help you manage datasets, snapshots, and reference common commands for your ZFS pool.
        </p>
      </div>
      
      <ZFSToolsContainer poolName={poolName} />
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mt-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> These tools generate commands that you can copy and paste into your terminal.
          Always review commands before executing them in production environments.
        </p>
      </div>
    </div>
  );
};

export default ZFSToolsTab;