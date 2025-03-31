import React, { useState, useMemo } from 'react';
import { HardDrive, Database, Clock, Book } from 'lucide-react';
import ZFSSnapshotManager from './ZFSSnapshotManager';
import ZFSDatasetManager from './ZFSDatasetManager';
import ZFSCommandReference from './ZFSCommandReference';

const ZFSToolsContainer = ({ poolName = 'tank' }) => {
  const [activeTab, setActiveTab] = useState('datasets');

  const tabs = useMemo(() => [
    { id: 'datasets', label: 'Datasets', icon: <Database size={16} /> },
    { id: 'snapshots', label: 'Snapshots', icon: <Clock size={16} /> },
    { id: 'commands', label: 'Command Reference', icon: <Book size={16} /> },
  ], []);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden transition-colors">
      {/* Header with pool name */}
      <div className="bg-gray-100 dark:bg-neutral-700 p-4 transition-colors">
        <div className="flex items-center gap-2">
          <HardDrive className="text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            ZFS Tools: {poolName}
          </span>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-neutral-700 transition-colors">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700'
            } transition-colors`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'datasets' && (
          <ZFSDatasetManager key="dataset-manager" poolName={poolName} />
        )}
        {activeTab === 'snapshots' && (
          <ZFSSnapshotManager key="snapshot-manager" poolName={poolName} />
        )}
        {activeTab === 'commands' && (
          <ZFSCommandReference key="command-reference" />
        )}
      </div>
    </div>
  );
};

export default ZFSToolsContainer;