import React from 'react';
import { HardDrive, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { DRIVE_SIZES, VDEV_TYPES } from '../../constants';

const VDevList = ({ 
  vdevs,
  onAddVdev,
  onRemoveVdev,
  onUpdateVdev,
  onAddDrive,
  onRemoveDrive
}) => {
  // Get minimum required drives for a given VDEV type
  const getMinDrives = (vdevType) => {
    switch (vdevType) {
      case 'mirror': return 2;
      case 'raidz1': return 3;
      case 'raidz2': return 4;
      case 'raidz3': return 5;
      case 'draid1': return 4;
      case 'draid2': return 5;
      case 'draid3': return 6;
      default: return 1; // stripe
    }
  };

  const handleVdevTypeChange = (vdevIndex, newType) => {
    const vdev = vdevs[vdevIndex];
    const minDrives = getMinDrives(newType);
    let newDrives = [...vdev.drives];

    // Add drives if we need more for the new type
    while (newDrives.length < minDrives) {
      newDrives.push({ ...vdev.drives[0] }); // Clone first drive's specs
    }

    onUpdateVdev(vdevIndex, { 
      type: newType, 
      drives: newDrives
    });
  };

  const handleRemoveDrive = (vdevIndex, driveIndex) => {
    const vdev = vdevs[vdevIndex];
    const minDrives = getMinDrives(vdev.type);
    
    // Allow removal if we have more than minimum required drives
    if (vdev.drives.length > minDrives) {
      onRemoveDrive(vdevIndex, driveIndex);
    }
  };

  const getVdevValidationMessage = (vdev) => {
    const minDrives = getMinDrives(vdev.type);
    if (vdev.drives.length < minDrives) {
      return `${vdev.type} requires at least ${minDrives} drives`;
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">Virtual Devices (VDEVs)</h4>
        <button
          onClick={onAddVdev}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add VDEV</span>
        </button>
      </div>

      <div className="space-y-4">
        {vdevs.map((vdev, vdevIndex) => {
          const validationMessage = getVdevValidationMessage(vdev);
          const minDrives = getMinDrives(vdev.type);

          return (
            <div 
              key={vdevIndex} 
              className="bg-gray-100 dark:bg-neutral-700 rounded-lg p-4 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                  <select
                    value={vdev.type}
                    onChange={(e) => handleVdevTypeChange(vdevIndex, e.target.value)}
                    className="w-full sm:w-auto bg-white dark:bg-neutral-600 text-gray-900 dark:text-gray-200 
                             rounded p-2 border border-gray-300 dark:border-neutral-600 transition-colors"
                  >
                    {VDEV_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={vdev.uniform}
                      onChange={(e) => onUpdateVdev(vdevIndex, { uniform: e.target.checked })}
                      className="rounded border-gray-300 dark:border-neutral-600"
                    />
                    Uniform drives
                  </label>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onAddDrive(vdevIndex)}
                    className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    aria-label="Add drive"
                  >
                    <Plus size={20} />
                  </button>
                  {vdevs.length > 1 && (
                    <button
                      onClick={() => onRemoveVdev(vdevIndex)}
                      className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      aria-label="Remove VDEV"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>

              {validationMessage && (
                <div className="mb-4 flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                  <AlertTriangle size={16} />
                  <span>{validationMessage}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {vdev.drives.map((drive, driveIndex) => (
                  <div key={driveIndex} className="flex items-center gap-2">
                    <HardDrive size={20} className="text-gray-500 dark:text-gray-400" />
                    <select
                      value={drive.size}
                      onChange={(e) => {
                        const newSize = Number(e.target.value);
                        const newDrives = [...vdev.drives];
                        if (vdev.uniform) {
                          newDrives.forEach(d => d.size = newSize);
                        } else {
                          newDrives[driveIndex] = { ...drive, size: newSize };
                        }
                        onUpdateVdev(vdevIndex, { drives: newDrives });
                      }}
                      className="w-24 p-1 bg-white dark:bg-neutral-600 border border-gray-300 dark:border-neutral-500 
                               rounded text-gray-900 dark:text-gray-200 transition-colors"
                    >
                      {DRIVE_SIZES.map(size => (
                        <option key={size} value={size}>{size} TB</option>
                      ))}
                    </select>
                    <select
                      value={drive.unit}
                      onChange={(e) => {
                        const newDrives = [...vdev.drives];
                        newDrives[driveIndex] = { ...drive, unit: e.target.value };
                        onUpdateVdev(vdevIndex, { drives: newDrives });
                      }}
                      className="bg-white dark:bg-neutral-600 text-gray-900 dark:text-gray-200 rounded p-1 
                               border border-gray-300 dark:border-neutral-500 transition-colors"
                    >
                      <option value="TB">TB</option>
                      <option value="GB">GB</option>
                    </select>
                    <button
                      onClick={() => handleRemoveDrive(vdevIndex, driveIndex)}
                      disabled={vdev.drives.length <= minDrives}
                      className={`p-1 ${vdev.drives.length > minDrives 
                        ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300' 
                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'} transition-colors`}
                      aria-label="Remove drive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VDevList;