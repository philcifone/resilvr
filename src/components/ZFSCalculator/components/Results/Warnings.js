import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Warnings = ({ pool }) => {
  // Helper functions remain the same
  const hasMixedVdevTypes = () => {
    const types = new Set(pool.vdevs.map(vdev => vdev.type));
    return types.size > 1;
  };

  const hasSuboptimalRaidz = () => {
    return pool.vdevs.some(vdev => {
      if (vdev.type.startsWith('raidz')) {
        const dataDisks = vdev.drives.length - Number(vdev.type.slice(-1));
        return !isPowerOf2(dataDisks);
      }
      return false;
    });
  };

  const isPowerOf2 = (n) => {
    return n && (n & (n - 1)) === 0;
  };

  // Common warning styles
  const warningClasses = "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4";
  const iconClasses = "w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0";
  const textClasses = "text-sm text-yellow-800 dark:text-yellow-200";

  // Error styling for stripe warning
  const errorClasses = "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4";
  const errorIconClasses = "w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0";
  const errorTextClasses = "text-sm text-red-800 dark:text-red-200";

  return (
    <div className="space-y-4">
      {hasMixedVdevTypes() && (
        <div className={warningClasses}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={iconClasses} />
            <div className={textClasses}>
              Mixing different VDEV types (e.g., mirror with RAIDZ) is not recommended. 
              This can lead to inconsistent performance and complicate capacity planning.
            </div>
          </div>
        </div>
      )}
      
      {pool.vdevs.some(vdev => vdev.type === 'raidz1' && vdev.drives.length > 8) && (
        <div className={warningClasses}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={iconClasses} />
            <div className={textClasses}>
              RAIDZ1 vdevs with more than 8 drives increase rebuild times and failure risk.
            </div>
          </div>
        </div>
      )}
      
      {hasSuboptimalRaidz() && (
        <div className={warningClasses}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={iconClasses} />
            <div className={textClasses}>
              For optimal RAIDZ performance, the number of data disks (total disks minus parity) 
              should be a power of 2 (e.g., 2, 4, 8).
            </div>
          </div>
        </div>
      )}
      
      {pool.vdevs.some(vdev => vdev.type === 'stripe') && (
        <div className={errorClasses}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={errorIconClasses} />
            <div className={errorTextClasses}>
              Stripe vdevs provide no redundancy. Data loss will occur if any drive fails.
            </div>
          </div>
        </div>
      )}
      
      {pool.slog.length > 0 && !pool.slog.some(device => device.size >= 16 && device.unit === 'GB') && (
        <div className={warningClasses}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={iconClasses} />
            <div className={textClasses}>
              SLOG devices should be at least 16GB for optimal performance.
            </div>
          </div>
        </div>
      )}

      {pool.slog.length > 0 && !pool.slogMirrored && (
        <div className={warningClasses}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={iconClasses} />
            <div className={textClasses}>
              Consider using mirrored SLOG devices to prevent write performance degradation if the SLOG fails.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warnings;