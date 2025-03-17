import React, { useState, useCallback } from 'react';
import { FolderTree, Copy, Check, Settings, Database, HardDrive, Info } from 'lucide-react';
import CompressionSelector from './CompressionSelector';

const ZFSDatasetManager = ({ poolName = 'tank' }) => {
  const [config, setConfig] = useState({
    name: '',
    mountpoint: '',
    compression: 'lz4',
    recordsize: '128K',
    primaryCache: 'all',
    secondaryCache: 'all',
    atime: 'off',
    exec: 'on',
    quota: '',
    quotaUnit: 'G',
    reservation: '',
    reservationUnit: 'G',
    customProperties: []
  });
  
  const [customProperty, setCustomProperty] = useState({ name: '', value: '' });
  const [copied, setCopied] = useState(false);

  const addCustomProperty = () => {
    if (customProperty.name && customProperty.value) {
      setConfig({
        ...config,
        customProperties: [...config.customProperties, { ...customProperty }]
      });
      setCustomProperty({ name: '', value: '' });
    }
  };

  const removeCustomProperty = (index) => {
    setConfig({
      ...config,
      customProperties: config.customProperties.filter((_, i) => i !== index)
    });
  };

  const handleCompressionChange = (value) => {
    setConfig({
      ...config,
      compression: value
    });
  };

  const getCreateCommand = useCallback(() => {
    if (!config.name) return '# Please specify a dataset name';
    
    const fullPath = `${poolName}/${config.name}`;
    const properties = [];
    
    if (config.mountpoint) {
      properties.push(`-o mountpoint=${config.mountpoint}`);
    }
    
    properties.push(`-o compression=${config.compression}`);
    properties.push(`-o recordsize=${config.recordsize}`);
    properties.push(`-o primarycache=${config.primaryCache}`);
    properties.push(`-o secondarycache=${config.secondaryCache}`);
    properties.push(`-o atime=${config.atime}`);
    properties.push(`-o exec=${config.exec}`);
    
    if (config.quota) {
      properties.push(`-o quota=${config.quota}${config.quotaUnit}`);
    }
    
    if (config.reservation) {
      properties.push(`-o reservation=${config.reservation}${config.reservationUnit}`);
    }
    
    // Add custom properties
    config.customProperties.forEach(prop => {
      properties.push(`-o ${prop.name}=${prop.value}`);
    });
    
    return `zfs create ${properties.join(' ')} ${fullPath}`;
  }, [config, poolName]);

  const handleCopy = async () => {
    try {
      const command = getCreateCommand();
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          ZFS Dataset Manager
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create ZFS datasets with customized properties
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Settings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FolderTree size={20} className="text-gray-500 dark:text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">
              Basic Settings
            </h4>
          </div>
          
          {/* Dataset Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Dataset Name*
            </label>
            <div className="flex items-center">
              <span className="bg-gray-100 dark:bg-neutral-700 px-3 py-2 text-gray-600 dark:text-gray-400 rounded-l">
                {poolName}/
              </span>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({...config, name: e.target.value})}
                placeholder="data/documents"
                className="flex-1 p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                         dark:border-neutral-600 rounded-r text-gray-900 dark:text-gray-200"
                required
              />
            </div>
          </div>
          
          {/* Mount Point */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
              Mount Point (optional)
            </label>
            <input
              type="text"
              value={config.mountpoint}
              onChange={(e) => setConfig({...config, mountpoint: e.target.value})}
              placeholder="/mnt/data"
              className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                       dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Performance Settings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-gray-500 dark:text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">
              Performance Settings
            </h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Enhanced Compression */}
            <div className="md:col-span-2">
              <CompressionSelector value={config.compression} onChange={handleCompressionChange} />
            </div>
            
            {/* Record Size */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Record Size
              </label>
              <select
                value={config.recordsize}
                onChange={(e) => setConfig({...config, recordsize: e.target.value})}
                className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                         dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
              >
                <option value="4K">4K</option>
                <option value="8K">8K</option>
                <option value="16K">16K</option>
                <option value="32K">32K</option>
                <option value="64K">64K</option>
                <option value="128K">128K (default)</option>
                <option value="256K">256K</option>
                <option value="512K">512K</option>
                <option value="1M">1M</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <strong>Recommendation:</strong> Use 1M for large sequential files, 8K-32K for databases
              </p>
            </div>
            
            {/* Primary Cache */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Primary Cache (ARC)
              </label>
              <select
                value={config.primaryCache}
                onChange={(e) => setConfig({...config, primaryCache: e.target.value})}
                className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                         dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
              >
                <option value="all">all (metadata + data)</option>
                <option value="metadata">metadata only</option>
                <option value="none">none</option>
              </select>
            </div>
            
            {/* Secondary Cache */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Secondary Cache (L2ARC)
              </label>
              <select
                value={config.secondaryCache}
                onChange={(e) => setConfig({...config, secondaryCache: e.target.value})}
                className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                         dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
              >
                <option value="all">all (metadata + data)</option>
                <option value="metadata">metadata only</option>
                <option value="none">none</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resource Controls */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Database size={20} className="text-gray-500 dark:text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">
              Resource Controls
            </h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Quota */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Quota (maximum size)
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={config.quota}
                  onChange={(e) => setConfig({...config, quota: e.target.value})}
                  placeholder="Optional"
                  min="0"
                  className="flex-1 p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                           dark:border-neutral-600 rounded-l text-gray-900 dark:text-gray-200"
                />
                <select
                  value={config.quotaUnit}
                  onChange={(e) => setConfig({...config, quotaUnit: e.target.value})}
                  className="w-16 p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                           dark:border-neutral-600 rounded-r text-gray-900 dark:text-gray-200 border-l-0"
                >
                  <option value="M">MB</option>
                  <option value="G">GB</option>
                  <option value="T">TB</option>
                </select>
              </div>
            </div>
            
            {/* Reservation */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Reservation (guaranteed size)
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={config.reservation}
                  onChange={(e) => setConfig({...config, reservation: e.target.value})}
                  placeholder="Optional"
                  min="0"
                  className="flex-1 p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                           dark:border-neutral-600 rounded-l text-gray-900 dark:text-gray-200"
                />
                <select
                  value={config.reservationUnit}
                  onChange={(e) => setConfig({...config, reservationUnit: e.target.value})}
                  className="w-16 p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                           dark:border-neutral-600 rounded-r text-gray-900 dark:text-gray-200 border-l-0"
                >
                  <option value="M">MB</option>
                  <option value="G">GB</option>
                  <option value="T">TB</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HardDrive size={20} className="text-gray-500 dark:text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">
              Additional Settings
            </h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* atime */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Access Time (atime)
              </label>
              <select
                value={config.atime}
                onChange={(e) => setConfig({...config, atime: e.target.value})}
                className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                         dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
              >
                <option value="on">on</option>
                <option value="off">off</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Setting to 'off' improves performance but doesn't track when files are read
              </p>
            </div>
            
            {/* exec */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Executable Files (exec)
              </label>
              <select
                value={config.exec}
                onChange={(e) => setConfig({...config, exec: e.target.value})}
                className="w-full p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                         dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
              >
                <option value="on">on</option>
                <option value="off">off</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Setting to 'off' prevents execution of programs in this dataset
              </p>
            </div>
          </div>
        </div>

        {/* Custom Properties */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-gray-500 dark:text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">
              Custom Properties
            </h4>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              value={customProperty.name}
              onChange={(e) => setCustomProperty({...customProperty, name: e.target.value})}
              placeholder="Property name"
              className="flex-1 min-w-[200px] p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                       dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
            />
            <input
              type="text"
              value={customProperty.value}
              onChange={(e) => setCustomProperty({...customProperty, value: e.target.value})}
              placeholder="Property value"
              className="flex-1 min-w-[200px] p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                       dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
            />
            <button
              onClick={addCustomProperty}
              disabled={!customProperty.name || !customProperty.value}
              className={`px-4 py-2 ${(!customProperty.name || !customProperty.value) 
                ? 'bg-gray-300 dark:bg-neutral-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition-colors`}
            >
              Add Property
            </button>
            
            {/* Display Custom Properties */}
            {config.customProperties.length > 0 && (
              <div className="w-full mt-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                  Added Custom Properties:
                </p>
                <div className="space-y-2">
                  {config.customProperties.map((prop, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-neutral-900 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{prop.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">=</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{prop.value}</span>
                      </div>
                      <button
                        onClick={() => removeCustomProperty(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Command Output */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-300">
              ZFS Create Command:
            </h5>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-md 
                       transition-colors flex items-center gap-2"
              aria-label="Copy command"
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
            <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap break-all">
              {getCreateCommand()}
            </pre>
          </div>
        </div>

        {/* Compression Info Card */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            ZFS Compression Reference:
          </h5>
          <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h6 className="font-medium mb-1">Algorithm Comparison</h6>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>lz4:</strong> Best balance of speed and compression for most workloads</li>
                  <li><strong>zstd:</strong> Better compression than lz4 with good performance</li>
                  <li><strong>gzip:</strong> Higher compression ratio but CPU intensive</li>
                  <li><strong>zle:</strong> Only compresses zeros, very fast</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-1">Use Cases</h6>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Databases:</strong> lz4 or zstd-fast</li>
                  <li><strong>VM Images:</strong> lz4 or zstd (level 1-3)</li>
                  <li><strong>Media files:</strong> zstd (level 3-5)</li>
                  <li><strong>Backups/Archives:</strong> zstd (level 7-19) or gzip-9</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZFSDatasetManager;