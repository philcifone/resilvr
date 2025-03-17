import React, { useState } from 'react';
import { Terminal, Search, Book, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const ZFSCommandReference = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCommands, setExpandedCommands] = useState({});
  const [copiedCommand, setCopiedCommand] = useState(null);

  // Command categories
  const categories = [
    { id: 'all', name: 'All Commands' },
    { id: 'pool', name: 'Pool Management' },
    { id: 'dataset', name: 'Dataset Operations' },
    { id: 'snapshot', name: 'Snapshots & Clones' },
    { id: 'properties', name: 'Properties & Settings' },
    { id: 'maintenance', name: 'Maintenance & Repair' },
  ];

  // ZFS Commands Database
  const commands = [
    {
      command: 'zpool status',
      syntax: 'zpool status [pool_name]',
      category: 'pool',
      description: 'Display the detailed status of ZFS storage pools, including their health, any errors, and the status of each device.',
      manpage: 'Shows the status of all pools or the specified pool if a pool name is provided. Includes information about read, write, and checksum errors.',
      examples: [
        { cmd: 'zpool status', desc: 'Show status of all pools' },
        { cmd: 'zpool status tank', desc: 'Show status of pool named "tank"' },
        { cmd: 'zpool status -v', desc: 'Show verbose status including error logs' }
      ]
    },
    {
      command: 'zpool list',
      syntax: 'zpool list [options] [pool_name]',
      category: 'pool',
      description: 'Display a list of ZFS storage pools with basic information like size, used space, and health status.',
      manpage: 'Lists the given pools along with a health status and space usage. When given no arguments, all pools in the system are listed.',
      examples: [
        { cmd: 'zpool list', desc: 'List all pools' },
        { cmd: 'zpool list -v', desc: 'List all pools with their components (verbose)' },
        { cmd: 'zpool list -o name,size,free', desc: 'List only specific properties' }
      ]
    },
    {
      command: 'zpool create',
      syntax: 'zpool create [options] pool_name vdev_spec...',
      category: 'pool',
      description: 'Create a new ZFS storage pool with the specified virtual devices (vdevs).',
      manpage: 'Creates a new storage pool containing the virtual devices specified on the command line. The pool name must begin with a letter, and can only contain alphanumeric characters as well as underscore, dash, colon, space, and period.',
      examples: [
        { cmd: 'zpool create tank /dev/sda /dev/sdb', desc: 'Create a striped pool named "tank" with two disks' },
        { cmd: 'zpool create tank mirror /dev/sda /dev/sdb', desc: 'Create a mirrored pool' },
        { cmd: 'zpool create -f tank raidz2 /dev/sda /dev/sdb /dev/sdc /dev/sdd', desc: 'Force creation of a RAIDZ2 pool' }
      ]
    },
    {
      command: 'zpool destroy',
      syntax: 'zpool destroy [-f] pool_name',
      category: 'pool',
      description: 'Destroy the given ZFS storage pool, freeing up its virtual devices for other uses.',
      manpage: 'Destroys the given pool, freeing up any devices for other use. This command tries to unmount any active datasets before destroying the pool.',
      examples: [
        { cmd: 'zpool destroy tank', desc: 'Destroy the pool named "tank"' },
        { cmd: 'zpool destroy -f tank', desc: 'Force destroy even if datasets are busy' }
      ]
    },
    {
      command: 'zpool scrub',
      syntax: 'zpool scrub [-s] pool_name',
      category: 'maintenance',
      description: 'Examine all data in the pool to verify its integrity and repair any detected errors when possible.',
      manpage: 'Begins a scrub. The scrub examines all data in the specified pools to verify that it checksums correctly. For replicated (mirror or raidz) devices, ZFS automatically repairs any damage discovered.',
      examples: [
        { cmd: 'zpool scrub tank', desc: 'Start a scrub on pool "tank"' },
        { cmd: 'zpool scrub -s tank', desc: 'Stop a running scrub on pool "tank"' }
      ]
    },
    {
      command: 'zfs list',
      syntax: 'zfs list [options] [dataset_name]',
      category: 'dataset',
      description: 'Display a list of datasets and their properties like space usage, mountpoints, and more.',
      manpage: 'Lists the property information for the given datasets in tabular form. If no datasets are specified, all datasets in the system are displayed.',
      examples: [
        { cmd: 'zfs list', desc: 'List all datasets' },
        { cmd: 'zfs list -r tank', desc: 'Recursively list all datasets under "tank"' },
        { cmd: 'zfs list -t snapshot', desc: 'List all snapshots' }
      ]
    },
    {
      command: 'zfs create',
      syntax: 'zfs create [-p] [-o property=value]... dataset_name',
      category: 'dataset',
      description: 'Create a new ZFS dataset within an existing pool with optional property settings.',
      manpage: 'Creates a new ZFS file system. The new file system will be mounted automatically unless the -u option is used.',
      examples: [
        { cmd: 'zfs create tank/data', desc: 'Create a dataset named "data" in the "tank" pool' },
        { cmd: 'zfs create -p tank/data/documents', desc: 'Create parent datasets if they don\'t exist' },
        { cmd: 'zfs create -o compression=lz4 tank/logs', desc: 'Create with compression enabled' }
      ]
    },
    {
      command: 'zfs destroy',
      syntax: 'zfs destroy [-fnpRrv] dataset_name[@snapshot_name]',
      category: 'dataset',
      description: 'Destroy a ZFS dataset, snapshot, or recursively destroy a dataset and all its descendants.',
      manpage: 'Destroys the given dataset. By default, the command unshares any file systems that are currently shared, unmounts any file systems that are currently mounted, and refuses to destroy a dataset that has active dependents (children or clones).',
      examples: [
        { cmd: 'zfs destroy tank/data', desc: 'Destroy the dataset "tank/data"' },
        { cmd: 'zfs destroy tank/data@snap1', desc: 'Destroy a snapshot named "snap1"' },
        { cmd: 'zfs destroy -r tank/data', desc: 'Recursively destroy dataset and all children' }
      ]
    },
    {
      command: 'zfs snapshot',
      syntax: 'zfs snapshot [-r] dataset_name@snapshot_name',
      category: 'snapshot',
      description: 'Create a point-in-time snapshot of a ZFS dataset or recursively for all descendant datasets.',
      manpage: 'Creates snapshots with the given names. The only valid characters in a snapshot name are alphanumeric characters, the underscore (_), the dash (-), the colon (:), the dot (.), and the space ( ). The maximum length of a snapshot name is 256 characters.',
      examples: [
        { cmd: 'zfs snapshot tank/data@backup', desc: 'Create a snapshot named "backup" of dataset "tank/data"' },
        { cmd: 'zfs snapshot -r tank/data@daily', desc: 'Recursively create snapshots of dataset and all descendants' },
        { cmd: 'zfs snapshot tank/data@$(date +%Y-%m-%d)', desc: 'Create snapshot with date-based name' }
      ]
    },
    {
      command: 'zfs rollback',
      syntax: 'zfs rollback [-rRf] dataset_name@snapshot_name',
      category: 'snapshot',
      description: 'Roll back a dataset to a specific snapshot, discarding all changes made since the snapshot was created.',
      manpage: 'Rolls back the given dataset to a previous snapshot. When a dataset is rolled back, all data that has changed since the snapshot is discarded, and the dataset reverts to the state at the time of the snapshot.',
      examples: [
        { cmd: 'zfs rollback tank/data@yesterday', desc: 'Roll back to snapshot named "yesterday"' },
        { cmd: 'zfs rollback -r tank/data@yesterday', desc: 'Roll back recursively, destroying later snapshots' }
      ]
    },
    {
      command: 'zfs clone',
      syntax: 'zfs clone [-p] [-o property=value]... snapshot_name new_dataset_name',
      category: 'snapshot',
      description: 'Create a writable dataset from a snapshot, allowing you to work with point-in-time data.',
      manpage: 'Creates a clone of the given snapshot. A clone is a writable volume or file system whose initial contents are the same as the snapshot from which it was created.',
      examples: [
        { cmd: 'zfs clone tank/data@snap1 tank/data-clone', desc: 'Create clone named "tank/data-clone" from snapshot' },
        { cmd: 'zfs clone -o compression=lz4 tank/vm@snap1 tank/vm-test', desc: 'Create clone with compression enabled' }
      ]
    },
    {
      command: 'zfs send',
      syntax: 'zfs send [-DvP] [-i snapshot] snapshot_name',
      category: 'snapshot',
      description: 'Generate a stream representation of a snapshot for backup or replication purposes.',
      manpage: 'Creates a stream representation of a snapshot that is written to standard output. The output can be used to send data to other pools and is suitable for backups.',
      examples: [
        { cmd: 'zfs send tank/data@snap1 > backup.zfs', desc: 'Send snapshot to a file' },
        { cmd: 'zfs send -i tank/data@snap1 tank/data@snap2', desc: 'Send incremental stream between snapshots' },
        { cmd: 'zfs send -R tank/data@snap1', desc: 'Send recursive stream including snapshots of all descendants' }
      ]
    },
    {
      command: 'zfs receive',
      syntax: 'zfs receive [-vnFu] dataset_name',
      category: 'snapshot',
      description: 'Receive a ZFS snapshot stream, recreating the snapshot and all its data on the local system.',
      manpage: 'Creates a snapshot whose contents are as specified in the stream provided on standard input. If a full stream is received, a new file system is created as well.',
      examples: [
        { cmd: 'zfs receive tank/newdata < backup.zfs', desc: 'Receive snapshot from a file' },
        { cmd: 'zfs send tank/data@snap1 | ssh host zfs receive tank/data', desc: 'Remote replication via SSH' },
        { cmd: 'zfs receive -F tank/data', desc: 'Force rollback to most recent snapshot if necessary' }
      ]
    },
    {
      command: 'zfs get',
      syntax: 'zfs get [-r|-d depth] [-Hp] [-o field[,...]] [-s source[,...]] [-t type[,...]] (all | property[,...]) [dataset_name...]',
      category: 'properties',
      description: 'Display properties for ZFS datasets, allowing you to see configuration, status, and statistics.',
      manpage: 'Displays properties for the given datasets. If no datasets are specified, then the command displays properties for all datasets on the system.',
      examples: [
        { cmd: 'zfs get all tank/data', desc: 'Show all properties for dataset "tank/data"' },
        { cmd: 'zfs get compression,recordsize tank/data', desc: 'Show specific properties' },
        { cmd: 'zfs get -r compression tank', desc: 'Show property recursively for all descendants' }
      ]
    },
    {
      command: 'zfs set',
      syntax: 'zfs set property=value dataset_name',
      category: 'properties',
      description: 'Set a property on a ZFS dataset, modifying its behavior or characteristics.',
      manpage: 'Sets the property or properties to the given values for each dataset. Only some properties can be edited. See zfsprops(7) for more information on what properties can be set and acceptable values.',
      examples: [
        { cmd: 'zfs set compression=lz4 tank/data', desc: 'Enable LZ4 compression on dataset' },
        { cmd: 'zfs set quota=10G tank/data', desc: 'Set a quota of 10GB on dataset' },
        { cmd: 'zfs set recordsize=8K tank/database', desc: 'Set recordsize for database optimization' }
      ]
    },
    {
      command: 'zfs upgrade',
      syntax: 'zfs upgrade [-v] [-a | dataset_name]',
      category: 'maintenance',
      description: 'Upgrade ZFS datasets to use the latest features supported by the current ZFS version.',
      manpage: 'Upgrades datasets to a newer on-disk version to enable file system features that are not available with the older version.',
      examples: [
        { cmd: 'zfs upgrade -v', desc: 'Show all versions and their features' },
        { cmd: 'zfs upgrade -a', desc: 'Upgrade all datasets' },
        { cmd: 'zfs upgrade tank/data', desc: 'Upgrade specific dataset' }
      ]
    },
    {
      command: 'zpool import',
      syntax: 'zpool import [-d dir] [-f] [-o property=value]... [pool_name | pool_id]',
      category: 'pool',
      description: 'Import a ZFS storage pool that was previously exported or is from another system.',
      manpage: 'Imports pools that are listed in the cachefile, or searches for pools in the specified directories and imports them if they are not currently active.',
      examples: [
        { cmd: 'zpool import', desc: 'List available pools for import' },
        { cmd: 'zpool import tank', desc: 'Import pool named "tank"' },
        { cmd: 'zpool import -d /dev/disk/by-id tank', desc: 'Import using specific device directory' }
      ]
    },
    {
      command: 'zpool export',
      syntax: 'zpool export [-f] pool_name',
      category: 'pool',
      description: 'Export a ZFS storage pool, making it unavailable to the system and ready for import elsewhere.',
      manpage: 'Exports the given pools from the system. All devices are marked as exported, but are still considered in use by other subsystems. The devices can be moved between systems (even those of different endianness) and imported as long as a sufficient number of devices are present.',
      examples: [
        { cmd: 'zpool export tank', desc: 'Export pool named "tank"' },
        { cmd: 'zpool export -f tank', desc: 'Force export even if datasets are busy' }
      ]
    },
    {
      command: 'zpool clear',
      syntax: 'zpool clear pool_name [device]',
      category: 'maintenance',
      description: 'Clear error counts associated with a pool or specific device, useful after addressing hardware issues.',
      manpage: 'Clears device errors in a pool. If no device is specified, all errors within the pool are cleared.',
      examples: [
        { cmd: 'zpool clear tank', desc: 'Clear all errors in pool "tank"' },
        { cmd: 'zpool clear tank /dev/sda', desc: 'Clear errors for specific device in the pool' }
      ]
    },
    {
      command: 'zfs rename',
      syntax: 'zfs rename [-f] old_dataset_name new_dataset_name',
      category: 'dataset',
      description: 'Rename a ZFS dataset or move it within the dataset hierarchy.',
      manpage: 'Renames the given dataset. The new dataset name must be a valid ZFS name. If the new name represents a descendant of the original name, the parent of the new path must exist.',
      examples: [
        { cmd: 'zfs rename tank/test tank/production', desc: 'Rename dataset' },
        { cmd: 'zfs rename tank/www tank/web/server', desc: 'Move dataset to another part of the hierarchy' }
      ]
    }
  ];

  // Filter commands based on search term and category
  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = 
      cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleCommand = (cmd) => {
    setExpandedCommands(prev => ({
      ...prev,
      [cmd]: !prev[cmd]
    }));
  };

  const handleCopy = (command) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 transition-colors">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          ZFS Command Reference
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Essential ZFS commands with explanations and examples
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-700 border border-gray-300 
                     dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200 
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
        
        <div className="flex-initial">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 p-2 bg-white dark:bg-neutral-700 border border-gray-300 
                     dark:border-neutral-600 rounded text-gray-900 dark:text-gray-200"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Command List */}
      <div className="space-y-4">
        {filteredCommands.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No commands match your search criteria.
          </div>
        ) : (
          filteredCommands.map((cmd) => (
            <div 
              key={cmd.command} 
              className="border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden"
            >
              {/* Command Header - Always Visible */}
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-900 
                         cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                onClick={() => toggleCommand(cmd.command)}
              >
                <div className="flex items-center gap-3">
                  <Terminal size={20} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-mono text-gray-900 dark:text-gray-100 font-medium">{cmd.command}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{cmd.description}</p>
                  </div>
                </div>
                <div>
                  {expandedCommands[cmd.command] ? (
                    <ChevronUp size={20} className="text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Command Details */}
              {expandedCommands[cmd.command] && (
                <div className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                  <div className="space-y-4">
                    {/* Syntax */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Syntax:</h5>
                      <div className="relative bg-gray-50 dark:bg-neutral-900 rounded p-3 font-mono text-sm">
                        <button
                          onClick={() => handleCopy(cmd.syntax)}
                          className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 
                                   rounded-md transition-colors"
                          aria-label="Copy syntax"
                        >
                          {copiedCommand === cmd.syntax ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} className="text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                        <code className="text-blue-600 dark:text-blue-400">{cmd.syntax}</code>
                      </div>
                    </div>

                    {/* Man page excerpt */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Book size={16} className="text-gray-500 dark:text-gray-400" />
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">From the man page:</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-900 rounded p-3">
                        {cmd.manpage}
                      </p>
                    </div>

                    {/* Examples */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Examples:</h5>
                      <div className="space-y-2">
                        {cmd.examples.map((ex, idx) => (
                          <div 
                            key={idx} 
                            className="bg-gray-50 dark:bg-neutral-900 rounded p-3 relative"
                          >
                            <button
                              onClick={() => handleCopy(ex.cmd)}
                              className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 
                                       rounded-md transition-colors"
                              aria-label="Copy example"
                            >
                              {copiedCommand === ex.cmd ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} className="text-gray-500 dark:text-gray-400" />
                              )}
                            </button>
                            <code className="font-mono text-sm text-blue-600 dark:text-blue-400">{ex.cmd}</code>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{ex.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Pagination controls could be added here if list gets too long */}
      
      {/* Footer with helpful tips */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Command Line Tips:
        </h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>Most ZFS commands can use tab completion for pool and dataset names</li>
          <li>Use <code className="bg-blue-100 dark:bg-blue-800/50 px-1 py-0.5 rounded">man zfs</code> or <code className="bg-blue-100 dark:bg-blue-800/50 px-1 py-0.5 rounded">man zpool</code> for complete documentation</li>
          <li>Add <code className="bg-blue-100 dark:bg-blue-800/50 px-1 py-0.5 rounded">-n</code> flag to many commands to perform a "dry run" without making changes</li>
          <li>Add <code className="bg-blue-100 dark:bg-blue-800/50 px-1 py-0.5 rounded">-v</code> flag for verbose output in many commands</li>
        </ul>
      </div>
    </div>
  );
};

export default ZFSCommandReference;