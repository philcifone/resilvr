import React from 'react';
import DeviceBox from './DeviceBox';

const ColorKey = () => (
  <div className="flex flex-wrap gap-4 mb-4 p-3 bg-white dark:bg-neutral-800 rounded-lg">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-emerald-900/50 border border-emerald-600" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Data</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-blue-900/50 border border-blue-600" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Mirror Copy</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-purple-900/50 border border-purple-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Parity</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-indigo-900/50 border border-indigo-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Distributed Parity</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-orange-900/50 border border-orange-700" />
      <span className="text-sm text-gray-600 dark:text-gray-400">Hot Spare</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-yellow-900/50 border border-yellow-700" />
      <span className="text-sm text-gray-600 dark:text-gray-400">SLOG</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-cyan-900/50 border border-cyan-700" />
      <span className="text-sm text-gray-600 dark:text-gray-400">L2ARC</span>
    </div>
  </div>
);

const Visualization = ({ pool }) => {
  return (
    <div className="bg-gray-100 dark:bg-neutral-700 rounded-lg p-6 mt-8 transition-colors">
      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">Pool Visualization</h4>
      
      <ColorKey />
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Pool name */}
          <div className="text-center mb-4 text-lg font-medium text-gray-900 dark:text-gray-200">
            Pool: {pool.name}
          </div>
          
          {/* Pool container */}
          <div className="flex flex-col gap-4">
            {/* VDEVs */}
            <div className="flex flex-wrap gap-4">
              {pool.vdevs.map((vdev, vdevIndex) => (
                <div 
                  key={vdevIndex}
                  className="flex-1 min-w-[200px] bg-white dark:bg-neutral-800 p-4 rounded-lg 
                           border border-gray-200 dark:border-neutral-600 transition-colors"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    VDEV {vdevIndex + 1} ({vdev.type})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vdev.drives.map((drive, driveIndex) => {
                      let variant = 'data';
                      if (vdev.type === 'mirror') {
                        variant = driveIndex > 0 ? 'mirror-copy' : 'mirror-primary';
                      } else if (vdev.type.startsWith('raidz')) {
                        if (driveIndex >= vdev.drives.length - Number(vdev.type.slice(-1))) {
                          variant = 'parity';
                        }
                      } else if (vdev.type.startsWith('draid')) {
                        if (driveIndex >= vdev.drives.length - Number(vdev.type.slice(-1))) {
                          variant = 'distributed-parity';
                        }
                      }
                      
                      return (
                        <DeviceBox
                          key={driveIndex}
                          type={vdev.type}
                          index={driveIndex}
                          totalDevices={vdev.drives.length}
                          size={drive.size}
                          unit={drive.unit}
                          variant={variant}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Special devices */}
            {(pool.spares.length > 0 || pool.slog.length > 0 || pool.l2arc.length > 0) && (
              <div className="flex gap-4 flex-wrap">
                {/* Hot spares */}
                {pool.spares.length > 0 && (
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Hot Spares</div>
                    <div className="flex gap-2">
                      {pool.spares.map((spare, index) => (
                        <DeviceBox
                          key={index}
                          type="spare"
                          size={spare.size}
                          unit={spare.unit}
                          variant="spare"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* SLOG */}
                {pool.slog.length > 0 && (
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">SLOG (ZIL)</div>
                    <div className="flex gap-2">
                      {pool.slog.map((device, index) => (
                        <DeviceBox
                          key={index}
                          type="slog"
                          size={device.size}
                          unit={device.unit}
                          variant="slog"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* L2ARC */}
                {pool.l2arc.length > 0 && (
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-600">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">L2ARC Cache</div>
                    <div className="flex gap-2">
                      {pool.l2arc.map((device, index) => (
                        <DeviceBox
                          key={index}
                          type="l2arc"
                          size={device.size}
                          unit={device.unit}
                          variant="l2arc"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-white dark:bg-neutral-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 transition-colors">
        <strong className="text-gray-900 dark:text-gray-300">Note:</strong> Data is striped across VDEVs, with each VDEV maintaining its own redundancy. 
        For example, with a mirror VDEV and a RAIDZ3 VDEV, you would need to lose all drives in the mirror VDEV OR 4 drives in the RAIDZ3 VDEV for data loss to occur.
      </div>
    </div>
  );
};

export default Visualization;