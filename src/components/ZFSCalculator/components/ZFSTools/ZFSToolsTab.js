import React from 'react';
import { AlertTriangle } from 'lucide-react';
import DisclaimerBanner from '../DisclaimerBanner';
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

      <div>
        <DisclaimerBanner />
      </div>

    </div>
  );
};

export default ZFSToolsTab;