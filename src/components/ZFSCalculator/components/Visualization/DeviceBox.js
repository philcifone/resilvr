import React from 'react';

const DeviceBox = ({ type, index, totalDevices, size, unit, variant }) => {
  const getDeviceStyle = () => {
    switch (variant) {
      case 'mirror-primary':
        return 'bg-blue-100 dark:bg-blue-900/50 border border-blue-600 text-blue-900 dark:text-blue-100';
      case 'mirror-copy':
        return 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-400 text-blue-900 dark:text-blue-100';
      case 'parity':
        return 'bg-purple-100 dark:bg-purple-900/50 border-2 border-purple-400 text-purple-900 dark:text-purple-100';
      case 'distributed-parity':
        return 'bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-400 text-indigo-900 dark:text-indigo-100';
      case 'spare':
        return 'bg-orange-100 dark:bg-orange-900/50 border border-orange-700 text-orange-900 dark:text-orange-100';
      case 'slog':
        return 'bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-700 text-yellow-900 dark:text-yellow-100';
      case 'l2arc':
        return 'bg-cyan-100 dark:bg-cyan-900/50 border border-cyan-700 text-cyan-900 dark:text-cyan-100';
      default:
        return 'bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-600 text-emerald-900 dark:text-emerald-100';
    }
  };

  return (
    <div className="relative">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs ${getDeviceStyle()} transition-colors`}>
        <div className="text-center">
          <div className="font-medium">{size}</div>
          <div className="opacity-90">{unit}</div>
        </div>
      </div>
    </div>
  );
};

export default DeviceBox;