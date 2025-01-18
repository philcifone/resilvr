import React from 'react';
import { HardDrive, Plus, Trash2 } from 'lucide-react';
import { DRIVE_SIZES } from '../../constants';

const SparesList = ({ spares, onAddSpare, onRemoveSpare, onUpdateSpare }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">Hot Spares</h4>
        <button
          onClick={() => onAddSpare()}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Spare</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spares.map((spare, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-700 p-3 rounded-lg transition-colors">
            <HardDrive size={20} className="text-orange-500 dark:text-orange-400" />
            <select
              value={spare.size}
              onChange={(e) => onUpdateSpare(index, { size: Number(e.target.value) })}
              className="w-24 p-1 bg-white dark:bg-neutral-600 border border-gray-300 
                       dark:border-neutral-500 rounded text-gray-900 dark:text-gray-200 
                       transition-colors"
            >
              {DRIVE_SIZES.map(size => (
                <option key={size} value={size}>{size} TB</option>
              ))}
            </select>
            <select
              value={spare.unit}
              onChange={(e) => onUpdateSpare(index, { unit: e.target.value })}
              className="bg-white dark:bg-neutral-600 text-gray-900 dark:text-gray-200 
                       rounded p-1 border border-gray-300 dark:border-neutral-500 
                       transition-colors"
            >
              <option value="TB">TB</option>
              <option value="GB">GB</option>
            </select>
            <button
              onClick={() => onRemoveSpare(index)}
              className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 
                       dark:hover:text-red-300 transition-colors ml-auto"
              aria-label="Remove spare"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SparesList;