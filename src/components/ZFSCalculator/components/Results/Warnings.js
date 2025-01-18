import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Warnings = ({ pool }) => {
  // Helper to check if pool has mixed VDEV types
  const hasMixedVdevTypes = () => {
    const types = new Set(pool.vdevs.map(vdev => vdev.type));
    return types.size > 1;
  };

  // Helper to check for optimal RAIDZ width
  const hasSuboptimalRaidz = () => {
    return pool.vdevs.some(vdev => {
      if (vdev.type.startsWith('raidz')) {
        const dataDisks = vdev.drives.length - Number(vdev.type.slice(-1));
        // RAIDZ should ideally be power of 2 plus parity
        return !isPowerOf2(dataDisks);
      }
      return false;
    });
  };

  const isPowerOf2 = (n) => {
    return n && (n & (n - 1)) === 0;
  };

  return (
    <div className="space-y-4">
      {hasMixedVdevTypes() && (
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 
                     bg-yellow-100 dark:bg-yellow-400/10 p-4 rounded-lg transition-colors">
          <AlertTriangle size={20} />
          <span>
            Mixing different VDEV types (e.g., mirror with RAIDZ) is not recommended. 
            This can lead to inconsistent performance and complicate capacity planning.
          </span>
        </div>
      )}
      
      {pool.vdevs.some(vdev => vdev.type === 'raidz1' && vdev.drives.length > 8) && (
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 
                     bg-yellow-100 dark:bg-yellow-400/10 p-4 rounded-lg transition-colors">
          <AlertTriangle size={20} />
          <span>RAIDZ1 vdevs with more than 8 drives increase rebuild times and failure risk.</span>
        </div>
      )}
      
      {hasSuboptimalRaidz() && (
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 
                     bg-yellow-100 dark:bg-yellow-400/10 p-4 rounded-lg transition-colors">
          <AlertTriangle size={20} />
          <span>
            For optimal RAIDZ performance, the number of data disks (total disks minus parity) 
            should be a power of 2 (e.g., 2, 4, 8).
          </span>
        </div>
      )}
      
      {pool.vdevs.some(vdev => vdev.type === 'stripe') && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 
                     bg-red-100 dark:bg-red-400/10 p-4 rounded-lg transition-colors">
          <AlertTriangle size={20} />
          <span>Stripe vdevs provide no redundancy. Data loss will occur if any drive fails.</span>
        </div>
      )}
      
      {pool.slog.length > 0 && !pool.slog.some(device => device.size >= 16) && (
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 
                     bg-yellow-100 dark:bg-yellow-400/10 p-4 rounded-lg transition-colors">
          <AlertTriangle size={20} />
          <span>SLOG devices should be at least 16GB for optimal performance.</span>
        </div>
      )}

      {pool.slog.length === 1 && (
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 
                     bg-yellow-100 dark:bg-yellow-400/10 p-4 rounded-lg transition-colors">
          <AlertTriangle size={20} />
          <span>Consider using mirrored SLOG devices to prevent write performance degradation if the SLOG fails.</span>
        </div>
      )}
    </div>
  );
};

export default Warnings;