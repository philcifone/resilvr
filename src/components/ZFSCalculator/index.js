import React, { useState } from 'react';
import { useZFSPool } from './hooks/useZFSPool';
import Toolbar from './components/Toolbar';
import PoolConfig from './components/PoolConfig';
import Visualization from './components/Visualization';
import Results from './components/Results';
import Warnings from './components/Results/Warnings';
import DisclaimerBanner from './components/DisclaimerBanner';
import ZFSToolsTab from './components/ZFSTools/ZFSToolsTab';

const ZFSCalculator = () => {
  const {
    pool,
    results,
    addVdev,
    removeVdev,
    updateVdev,
    addDrive,
    removeDrive,
    addSpare,
    removeSpare,
    updateSpare,
    updatePoolName,
    updateAshift,
    toggleSlog,
    updateSlog,
    toggleL2arc,
    updateL2arc,
    toggleSlogMirror
  } = useZFSPool();

  const [activeTab, setActiveTab] = useState('design');

  const tabs = [
    { id: 'design', label: 'Pool Design' },
    { id: 'tools', label: 'Management Tools' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Toolbar />
      
      <div className="pt-20 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm transition-colors">
            <div className="text-center p-6 pb-0">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                ZFS Storage Pool Designer
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Design, calculate, and manage ZFS storage pools
              </p>
            </div>

            <div className="px-6 pt-4">
              <DisclaimerBanner />
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-neutral-700 px-6 mt-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  } transition-colors`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'design' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                      Pool Name
                    </label>
                    <input
                      type="text"
                      value={pool.name}
                      onChange={(e) => updatePoolName(e.target.value)}
                      className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                               dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200 
                               focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                               transition-colors"
                    />
                  </div>

                  <PoolConfig
                    pool={pool}
                    onAddVdev={addVdev}
                    onRemoveVdev={removeVdev}
                    onUpdateVdev={updateVdev}
                    onAddDrive={addDrive}
                    onRemoveDrive={removeDrive}
                    onAddSpare={addSpare}
                    onRemoveSpare={removeSpare}
                    onUpdateSpare={updateSpare}
                    onUpdateAshift={updateAshift}
                    onToggleSlog={toggleSlog}
                    onUpdateSlog={updateSlog}
                    onToggleL2arc={toggleL2arc}
                    onUpdateL2arc={updateL2arc}
                    onToggleSlogMirror={toggleSlogMirror}
                  />

                  <Warnings pool={pool} />
                  <Visualization pool={pool} />
                  <Results pool={pool} results={results} />
                </div>
              )}

              {activeTab === 'tools' && (
                <ZFSToolsTab poolName={pool.name} />
              )}
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Built with React and Tailwind CSS • Data calculated in real-time
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZFSCalculator;