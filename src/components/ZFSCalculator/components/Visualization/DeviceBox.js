import React from 'react';

const DeviceBox = ({ type, index, totalDevices, size, unit, variant }) => {
  const getDeviceStyle = () => {
    switch (variant) {
      case 'mirror-primary':
        return 'bg-blue-900/50 border border-blue-600';
      case 'mirror-copy':
        return 'bg-blue-900/50 border-2 border-blue-400';
      case 'parity':
        return 'bg-purple-900/50 border-2 border-purple-400';
      case 'distributed-parity':
        return 'bg-indigo-900/50 border-2 border-indigo-400';
      case 'spare':
        return 'bg-orange-900/50 border border-orange-700';
      case 'slog':
        return 'bg-yellow-900/50 border border-yellow-700';
      case 'l2arc':
        return 'bg-cyan-900/50 border border-cyan-700';
      default:
        return 'bg-emerald-900/50 border border-emerald-600';
    }
  };

  return (
    <div className="relative">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs ${getDeviceStyle()} transition-colors`}>
        <div className="text-center">
          <div className="text-gray-200">{size}</div>
          <div className="text-gray-400">{unit}</div>
        </div>
      </div>
    </div>
  );
};

export default DeviceBox;