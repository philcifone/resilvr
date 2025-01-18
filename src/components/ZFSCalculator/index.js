import React from 'react';
import { useZFSPool } from './hooks/useZFSPool';
import Toolbar from './components/Toolbar';
import VDevList from './components/PoolConfig/VDevList';
import SparesList from './components/PoolConfig/SparesList';
import Advanced from './components/PoolConfig/Advanced';
import Visualization from './components/Visualization';
import Results from './components/Results';
import Warnings from './components/Results/Warnings';
import DisclaimerBanner from './components/DisclaimerBanner';

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
    updateL2arc
  } = useZFSPool();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Toolbar />
      
      <div className="pt-20 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 transition-colors">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                ZFS Storage Pool Designer
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Design and calculate ZFS storage pools with advanced features
              </p>
            </div>

            <DisclaimerBanner />

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

              <VDevList
                vdevs={pool.vdevs}
                onAddVdev={addVdev}
                onRemoveVdev={removeVdev}
                onUpdateVdev={updateVdev}
                onAddDrive={addDrive}
                onRemoveDrive={removeDrive}
              />

              <SparesList
                spares={pool.spares}
                onAddSpare={addSpare}
                onRemoveSpare={removeSpare}
                onUpdateSpare={updateSpare}
              />

              <Advanced
                ashift={pool.ashift}
                slog={pool.slog}
                l2arc={pool.l2arc}
                onUpdateAshift={updateAshift}
                onToggleSlog={toggleSlog}
                onUpdateSlog={updateSlog}
                onToggleL2arc={toggleL2arc}
                onUpdateL2arc={updateL2arc}
              />

              <Warnings pool={pool} />
              <Visualization pool={pool} />
              <Results pool={pool} results={results} />
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Built by Phil and Claude with React and Tailwind CSS • Data calculated in real-time
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZFSCalculator;