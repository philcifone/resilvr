import React from 'react';
import DeviceBox from './DeviceBox';
import ColorKey from './ColorKey';

const Visualization = ({ pool }) => {
  return (
    <div className="bg-gray-100 dark:bg-neutral-700 rounded-lg p-6 mt-8 transition-colors">
      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">Pool Visualization</h4>
      
      <ColorKey />
      
      {/* Pool name */}
      <div className="text-center mb-4 text-lg font-medium text-gray-900 dark:text-gray-200">
        Pool: {pool.name}
      </div>
      
      {/* Pool container */}
      <div className="flex flex-col gap-4">
        {/* VDEVs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pool.vdevs.map((vdev, vdevIndex) => (
                <div 
                  key={vdevIndex}
                  className="bg-white dark:bg-neutral-800 p-4 rounded-lg 
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
      
      <div className="mt-4 p-3 bg-white dark:bg-neutral-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 transition-colors">
        <strong className="text-gray-900 dark:text-gray-300">Important: </strong>  Data is striped across VDEVs. If any single VDEV fails completely, the entire pool will be lost.
      </div>
    </div>
  );
};

export default Visualization;