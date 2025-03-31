import React, { useState, useCallback, useMemo } from 'react';
import { Clock, Copy, Check, Info } from 'lucide-react';

const ZFSSnapshotManager = ({ poolName = 'tank' }) => {
  const [config, setConfig] = useState({
    datasetPath: '',
    recursive: false,
    customName: '',
    schedule: {
      enabled: false,
      interval: '1h',
      retain: 24
    }
  });
  const [copied, setCopied] = useState(false);

  const getSnapshotCommand = useMemo(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotName = config.customName || timestamp;
    const recursiveFlag = config.recursive ? '-r' : '';
    const fullDatasetPath = config.datasetPath 
      ? `${poolName}/${config.datasetPath}` 
      : poolName;
    
    return `zfs snapshot ${recursiveFlag} ${fullDatasetPath}@${snapshotName}`;
  }, [
    config.customName,
    config.recursive,
    config.datasetPath,
    poolName
  ]);

  const getScheduleCommand = useMemo(() => {
    if (!config.schedule.enabled) return '';
    
    const fullDatasetPath = config.datasetPath 
      ? `${poolName}/${config.datasetPath}` 
      : poolName;
      
    return `zfs-auto-snapshot --keep=${config.schedule.retain} --interval=${config.schedule.interval} ${fullDatasetPath}`;
  }, [
    config.schedule.enabled,
    config.schedule.retain,
    config.schedule.interval,
    config.datasetPath,
    poolName
  ]);

  const getCommandExplanation = useMemo(() => {
    const parts = [];
    const fullDatasetPath = config.datasetPath 
      ? `${poolName}/${config.datasetPath}` 
      : poolName;
    
    // Base snapshot command explanation
    parts.push({
      command: 'zfs snapshot',
      explanation: 'Creates a read-only copy of the dataset at the current point in time.'
    });

    if (config.recursive) {
      parts.push({
        command: '-r flag',
        explanation: 'Creates recursive snapshots of all descendent datasets, maintaining a consistent state across the entire dataset hierarchy.'
      });
    }

    parts.push({
      command: `${fullDatasetPath}@${config.customName || '<timestamp>'}`,
      explanation: 'Specifies the snapshot name using "@" to separate dataset from snapshot identifier. Timestamps ensure unique names.'
    });

    if (config.schedule.enabled) {
      parts.push({
        command: 'zfs-auto-snapshot',
        explanation: 'Automated snapshot management utility for scheduled snapshots.'
      });
      parts.push({
        command: `--keep=${config.schedule.retain}`,
        explanation: `Maintains only the specified number of recent snapshots (${config.schedule.retain}), automatically removing older ones.`
      });
      parts.push({
        command: `--interval=${config.schedule.interval}`,
        explanation: `Creates new snapshots at the specified interval (${config.schedule.interval}). Shorter intervals provide more granular recovery points but consume more space.`
      });
    }

    return parts;
  }, [
    config.datasetPath,
    config.recursive,
    config.customName,
    config.schedule.enabled,
    config.schedule.retain,
    config.schedule.interval,
    poolName
  ]);

  const handleCopy = useCallback(async () => {
    try {
      const commands = [getSnapshotCommand, getScheduleCommand]
        .filter(Boolean)
        .join('\n');
      await navigator.clipboard.writeText(commands);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }, [getSnapshotCommand, getScheduleCommand]);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 transition-colors">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          ZFS Snapshot Manager
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create and schedule ZFS snapshots for point-in-time data recovery
        </p>
      </div>

      <div className="space-y-6">
        {/* Dataset Path Input */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
            Dataset Path (optional)
          </label>
          <div className="flex items-center">
            <span className="bg-gray-100 dark:bg-neutral-700 px-3 py-2 text-gray-600 dark:text-gray-400 rounded-l">
              {poolName}/
            </span>
            <input
              type="text"
              value={config.datasetPath}
              onChange={(e) => setConfig({...config, datasetPath: e.target.value})}
              placeholder="data/documents"
              className="flex-1 p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                       dark:border-neutral-600 rounded-r text-gray-900 dark:text-gray-200"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty to snapshot the entire pool
          </p>
        </div>

        {/* Basic Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recursive"
              checked={config.recursive}
              onChange={(e) => setConfig({...config, recursive: e.target.checked})}
              className="rounded border-gray-300 dark:border-neutral-600"
            />
            <label htmlFor="recursive" className="text-gray-900 dark:text-gray-200">
              Recursive (include all child datasets)
            </label>
            <div className="relative group ml-2">
              <Info size={16} className="text-gray-500 dark:text-gray-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-white 
                            dark:bg-neutral-700 rounded shadow-lg text-xs text-gray-600 dark:text-gray-300 
                            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Creates snapshots of all descendant datasets, maintaining consistency across the hierarchy
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Custom Snapshot Name (optional)
            </label>
            <input
              type="text"
              value={config.customName}
              onChange={(e) => setConfig({...config, customName: e.target.value})}
              placeholder="backup-2024"
              className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                       dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              If left empty, an ISO timestamp will be used
            </p>
          </div>
        </div>

        {/* Scheduling */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-gray-500 dark:text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">
              Automatic Snapshots
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableSchedule"
              checked={config.schedule.enabled}
              onChange={(e) => setConfig({
                ...config, 
                schedule: {...config.schedule, enabled: e.target.checked}
              })}
              className="rounded border-gray-300 dark:border-neutral-600"
            />
            <label htmlFor="enableSchedule" className="text-gray-900 dark:text-gray-200">
              Enable scheduled snapshots
            </label>
          </div>

          {config.schedule.enabled && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                  Interval
                </label>
                <select
                  value={config.schedule.interval}
                  onChange={(e) => setConfig({
                    ...config,
                    schedule: {...config.schedule, interval: e.target.value}
                  })}
                  className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                           dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
                >
                  <option value="15min">15 minutes</option>
                  <option value="30min">30 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="6h">6 hours</option>
                  <option value="12h">12 hours</option>
                  <option value="1d">1 day</option>
                  <option value="1w">1 week</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                  Retain Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.schedule.retain}
                  onChange={(e) => setConfig({
                    ...config,
                    schedule: {...config.schedule, retain: parseInt(e.target.value)}
                  })}
                  className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                           dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Command Output & Explanation */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-300">
              ZFS Commands:
            </h5>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md 
                       transition-colors flex items-center gap-2"
              aria-label="Copy commands"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-sm text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="relative bg-gray-50 dark:bg-neutral-900 rounded-lg p-4">
            <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre">
              {[getSnapshotCommand, getScheduleCommand].filter(Boolean).join('\n')}
            </pre>
          </div>

          {/* Command Explanation */}
          <div className="mt-4 space-y-3">
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-300">
              Command Explanation:
            </h5>
            {getCommandExplanation.map((part, index) => (
              <div key={index} className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-lg">
                <code className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                  {part.command}
                </code>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {part.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Best Practices */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Best Practices:
            </h5>
            <ul className="list-disc list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>Use meaningful snapshot names for easier identification</li>
              <li>Consider retention policies based on dataset change rate and backup needs</li>
              <li>Use recursive snapshots when consistency across child datasets is required</li>
              <li>Monitor snapshot space usage with `zfs list -t snapshot`</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZFSSnapshotManager;