import React, { useState, useEffect } from 'react';
import { Calculator, HardDrive, Shield, Info, Server, Plus, Trash2, AlertTriangle } from 'lucide-react';

const ZFSCalculator = () => {
  // Common drive sizes in TB (as of 2024)
const DRIVE_SIZES = [
    1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 30
];

const [pool, setPool] = useState({
    name: 'tank',
    vdevs: [{
      type: 'raidz1',
      drives: [{size: 4, unit: 'TB'}, {size: 4, unit: 'TB'}, {size: 4, unit: 'TB'}],
      uniform: true // All drives in this vdev must be the same size
    }],
    spares: [],
    slog: [],
    l2arc: [],
    ashift: 12 // Default ashift for modern drives
  });

  const [results, setResults] = useState({
    totalRaw: 0,
    usableSpace: 0,
    protection: '',
    efficiency: 0
  });

  // ZFS-specific constants
  const SECTOR_SIZES = [512, 4096, 8192, 16384];
  const VDEV_TYPES = [
    { value: 'stripe', label: 'Stripe (no redundancy)' },
    { value: 'mirror', label: 'Mirror' },
    { value: 'raidz1', label: 'RAIDZ-1' },
    { value: 'raidz2', label: 'RAIDZ-2' },
    { value: 'raidz3', label: 'RAIDZ-3' },
    { value: 'draid1', label: 'dRAID-1' },
    { value: 'draid2', label: 'dRAID-2' },
    { value: 'draid3', label: 'dRAID-3' }
  ];

  const calculateVdevCapacity = (vdev) => {
    const totalDriveSpace = vdev.drives.reduce((sum, drive) => 
      sum + drive.size * (drive.unit === 'TB' ? 1 : drive.unit === 'GB' ? 0.001 : 0), 0);

    switch (vdev.type) {
      case 'stripe':
        return totalDriveSpace;
      case 'mirror':
        return totalDriveSpace / vdev.drives.length;
      case 'raidz1':
        return totalDriveSpace * ((vdev.drives.length - 1) / vdev.drives.length);
      case 'raidz2':
        return totalDriveSpace * ((vdev.drives.length - 2) / vdev.drives.length);
      case 'raidz3':
        return totalDriveSpace * ((vdev.drives.length - 3) / vdev.drives.length);
      // dRAID calculations (simplified)
      case 'draid1':
        return totalDriveSpace * 0.75; // Approximate for visualization
      case 'draid2':
        return totalDriveSpace * 0.7;
      case 'draid3':
        return totalDriveSpace * 0.65;
      default:
        return 0;
    }
  };

  const calculatePoolCapacity = () => {
    // Calculate raw capacity
    const rawCapacity = pool.vdevs.reduce((sum, vdev) => {
      return sum + vdev.drives.reduce((vdevSum, drive) => 
        vdevSum + drive.size * (drive.unit === 'TB' ? 1 : drive.unit === 'GB' ? 0.001 : 0), 0);
    }, 0);

    // Calculate usable capacity
    const usableCapacity = pool.vdevs.reduce((sum, vdev) => 
      sum + calculateVdevCapacity(vdev), 0);

    // Calculate efficiency
    const efficiency = (usableCapacity / rawCapacity) * 100;

    // Calculate protection level
    const protection = determineProtectionLevel(pool.vdevs, pool.spares.length);

    setResults({
      totalRaw: rawCapacity,
      usableSpace: usableCapacity,
      protection,
      efficiency
    });
  };

  const determineProtectionLevel = (vdevs, spareCount) => {
    const protectionLevels = vdevs.map(vdev => {
      switch (vdev.type) {
        case 'stripe': return 'None';
        case 'mirror': return `${vdev.drives.length - 1} drive failures per vdev`;
        case 'raidz1': return '1 drive failure per vdev';
        case 'raidz2': return '2 drive failures per vdev';
        case 'raidz3': return '3 drive failures per vdev';
        case 'draid1': return '1 drive failure + distributed spare';
        case 'draid2': return '2 drive failures + distributed spare';
        case 'draid3': return '3 drive failures + distributed spare';
        default: return 'Unknown';
      }
    });

    const lowestProtection = protectionLevels.reduce((min, current) => 
      current === 'None' ? 'None' : min === 'None' ? current : min);

    return `${lowestProtection}${spareCount > 0 ? ` + ${spareCount} hot spare${spareCount > 1 ? 's' : ''}` : ''}`;
  };

  const addVdev = () => {
    setPool(prev => ({
      ...prev,
      vdevs: [...prev.vdevs, {
        type: 'raidz1',
        drives: [{size: 4, unit: 'TB'}, {size: 4, unit: 'TB'}, {size: 4, unit: 'TB'}]
      }]
    }));
  };

  const removeVdev = (index) => {
    setPool(prev => ({
      ...prev,
      vdevs: prev.vdevs.filter((_, i) => i !== index)
    }));
  };

  const updateVdev = (index, updates) => {
    setPool(prev => ({
      ...prev,
      vdevs: prev.vdevs.map((vdev, i) => 
        i === index ? { ...vdev, ...updates } : vdev
      )
    }));
  };

  const addDrive = (vdevIndex, drive = {size: 4, unit: 'TB'}) => {
    setPool(prev => ({
      ...prev,
      vdevs: prev.vdevs.map((vdev, i) => 
        i === vdevIndex 
          ? { ...vdev, drives: [...vdev.drives, drive] }
          : vdev
      )
    }));
  };

  const removeDrive = (vdevIndex, driveIndex) => {
    setPool(prev => ({
      ...prev,
      vdevs: prev.vdevs.map((vdev, i) => 
        i === vdevIndex
          ? { ...vdev, drives: vdev.drives.filter((_, j) => j !== driveIndex) }
          : vdev
      )
    }));
  };

  const addSpare = () => {
    setPool(prev => ({
      ...prev,
      spares: [...prev.spares, {size: 4, unit: 'TB'}]
    }));
  };

  const removeSpare = (index) => {
    setPool(prev => ({
      ...prev,
      spares: prev.spares.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    calculatePoolCapacity();
  }, [pool]);

  return (
    <div className="bg-neutral-800 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-display text-gray-200 mb-2">ZFS Storage Pool Designer</h3>
        <p className="text-gray-400">Design and calculate ZFS storage pools with advanced features</p>
      </div>

      {/* Pool Configuration */}
      <div className="space-y-6">
        {/* Pool Name */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Pool Name
          </label>
          <input
            type="text"
            value={pool.name}
            onChange={(e) => setPool(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
          />
        </div>

        {/* VDEVs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-200">Virtual Devices (VDEVs)</h4>
            <button
              onClick={addVdev}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={16} />
              Add VDEV
            </button>
          </div>

          <div className="space-y-4">
            {pool.vdevs.map((vdev, vdevIndex) => (
              <div key={vdevIndex} className="bg-neutral-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <select
                    value={vdev.type}
                    onChange={(e) => updateVdev(vdevIndex, { type: e.target.value })}
                    className="bg-neutral-600 text-gray-200 rounded p-2"
                  >
                    {VDEV_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={vdev.uniform}
                      onChange={(e) => updateVdev(vdevIndex, { uniform: e.target.checked })}
                      className="rounded border-neutral-600"
                    />
                    Uniform drives
                  </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addDrive(vdevIndex)}
                      className="p-1 text-blue-400 hover:text-blue-300"
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      onClick={() => removeVdev(vdevIndex)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {vdev.drives.map((drive, driveIndex) => (
                    <div key={driveIndex} className="flex items-center gap-2">
                      <HardDrive size={20} className="text-gray-400" />
                      <select
                        value={drive.size}
                        onChange={(e) => {
                          const newSize = Number(e.target.value);
                          const newDrives = [...vdev.drives];
                          if (vdev.uniform) {
                            // Update all drives in the vdev to maintain uniformity
                            newDrives.forEach(d => d.size = newSize);
                          } else {
                            newDrives[driveIndex] = { ...drive, size: newSize };
                          }
                          updateVdev(vdevIndex, { drives: newDrives });
                        }}
                        className="w-24 p-1 bg-neutral-600 border border-neutral-500 rounded text-gray-200"
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
                          updateVdev(vdevIndex, { drives: newDrives });
                        }}
                        className="bg-neutral-600 text-gray-200 rounded p-1"
                      >
                        <option value="TB">TB</option>
                        <option value="GB">GB</option>
                      </select>
                      <button
                        onClick={() => removeDrive(vdevIndex, driveIndex)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Spares */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-200">Hot Spares</h4>
            <button
              onClick={addSpare}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Spare
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pool.spares.map((spare, index) => (
              <div key={index} className="flex items-center gap-2">
                <HardDrive size={20} className="text-orange-400" />
                <input
                  type="number"
                  value={spare.size}
                  onChange={(e) => {
                    const newSpares = [...pool.spares];
                    newSpares[index] = { ...spare, size: Number(e.target.value) };
                    setPool(prev => ({ ...prev, spares: newSpares }));
                  }}
                  className="w-20 p-1 bg-neutral-600 border border-neutral-500 rounded text-gray-200"
                />
                <select
                  value={spare.unit}
                  onChange={(e) => {
                    const newSpares = [...pool.spares];
                    newSpares[index] = { ...spare, unit: e.target.value };
                    setPool(prev => ({ ...prev, spares: newSpares }));
                  }}
                  className="bg-neutral-600 text-gray-200 rounded p-1"
                >
                  <option value="TB">TB</option>
                  <option value="GB">GB</option>
                </select>
                <button
                  onClick={() => removeSpare(index)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div>
          <h4 className="text-lg font-medium text-gray-200 mb-4">Advanced Options</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Sector Size (ashift)
              </label>
              <select
                value={pool.ashift}
                onChange={(e) => setPool(prev => ({ ...prev, ashift: Number(e.target.value) }))}
                className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
              >
                {SECTOR_SIZES.map(size => (
                  <option key={size} value={Math.log2(size)}>
                    {size} bytes (ashift={Math.log2(size)})
                  </option>
                ))}
              </select>
            </div>
            
            {/* SLOG Configuration */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-200">
                  SLOG Device
                </label>
                <div className="relative group">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-neutral-800 rounded shadow-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    SLOG (ZFS Intent Log) should use low-latency devices. Recommended minimum size is 16GB. For redundancy, consider mirrored SLOG devices.
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={pool.slog.length > 0 ? 'enabled' : 'disabled'}
                  onChange={(e) => {
                    if (e.target.value === 'enabled' && pool.slog.length === 0) {
                      setPool(prev => ({ ...prev, slog: [{size: 16, unit: 'GB'}] }));
                    } else if (e.target.value === 'disabled') {
                      setPool(prev => ({ ...prev, slog: [] }));
                    }
                  }}
                  className="flex-1 p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
                >
                  <option value="disabled">Disabled</option>
                  <option value="enabled">Enabled</option>
                </select>
                {pool.slog.length > 0 && (
                  <input
                    type="number"
                    value={pool.slog[0].size}
                    onChange={(e) => setPool(prev => ({
                      ...prev,
                      slog: [{ ...prev.slog[0], size: Number(e.target.value) }]
                    }))}
                    className="w-20 p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
                  />
                )}
                {pool.slog.length > 0 && (
                  <select
                    value={pool.slog[0].unit}
                    onChange={(e) => setPool(prev => ({
                      ...prev,
                      slog: [{ ...prev.slog[0], unit: e.target.value }]
                    }))}
                    className="w-20 p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
                  >
                    <option value="GB">GB</option>
                    <option value="TB">TB</option>
                  </select>
                )}
              </div>
            </div>

            {/* L2ARC Configuration */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-200">
                  L2ARC Cache
                </label>
                <div className="relative group">
                  <Info size={16} className="text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-neutral-800 rounded shadow-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    L2ARC provides second-level adaptive replacement cache. Uses system memory (RAM) for metadata, approximately 100 bytes per block cached.
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={pool.l2arc.length > 0 ? 'enabled' : 'disabled'}
                  onChange={(e) => {
                    if (e.target.value === 'enabled' && pool.l2arc.length === 0) {
                      setPool(prev => ({ ...prev, l2arc: [{size: 256, unit: 'GB'}] }));
                    } else if (e.target.value === 'disabled') {
                      setPool(prev => ({ ...prev, l2arc: [] }));
                    }
                  }}
                  className="flex-1 p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
                >
                  <option value="disabled">Disabled</option>
                  <option value="enabled">Enabled</option>
                </select>
                {pool.l2arc.length > 0 && (
                  <input
                    type="number"
                    value={pool.l2arc[0].size}
                    onChange={(e) => setPool(prev => ({
                      ...prev,
                      l2arc: [{ ...prev.l2arc[0], size: Number(e.target.value) }]
                    }))}
                    className="w-20 p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
                  />
                )}
                {pool.l2arc.length > 0 && (
                  <select
                    value={pool.l2arc[0].unit}
                    onChange={(e) => setPool(prev => ({
                      ...prev,
                      l2arc: [{ ...prev.l2arc[0], unit: e.target.value }]
                    }))}
                    className="w-20 p-2 bg-neutral-700 border border-neutral-600 rounded text-gray-200"
                  >
                    <option value="GB">GB</option>
                    <option value="TB">TB</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pool Visualization */}
        <div className="bg-neutral-700 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-medium text-gray-200 mb-4">Pool Visualization</h4>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Pool container */}
              <div className="flex flex-col gap-4">
                {/* VDEVs */}
                <div className="flex flex-wrap gap-4">
                  {pool.vdevs.map((vdev, vdevIndex) => (
                    <div 
                      key={vdevIndex}
                      className="flex-1 min-w-[200px] bg-neutral-800 p-4 rounded-lg border border-neutral-600"
                    >
                      <div className="text-sm text-gray-400 mb-2">VDEV {vdevIndex + 1} ({vdev.type})</div>
                      <div className="flex flex-wrap gap-2">
                        {vdev.drives.map((drive, driveIndex) => (
                          <div 
                            key={driveIndex}
                            className="relative"
                          >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xs
                              ${vdev.type === 'mirror' 
                                ? driveIndex > 0 
                                  ? 'bg-blue-900/50 border-2 border-blue-400' // Mirror copy
                                  : 'bg-blue-900/50 border border-blue-600'   // Mirror primary
                                : vdev.type.startsWith('raidz') 
                                  ? driveIndex >= vdev.drives.length - Number(vdev.type.slice(-1))
                                    ? 'bg-purple-900/50 border-2 border-purple-400' // Parity drive
                                    : 'bg-emerald-900/50 border border-emerald-600' // Data drive
                                  : vdev.type.startsWith('draid')
                                    ? driveIndex >= vdev.drives.length - Number(vdev.type.slice(-1))
                                      ? 'bg-indigo-900/50 border-2 border-indigo-400' // Distributed parity
                                      : 'bg-emerald-900/50 border border-emerald-600' // Data drive
                                    : 'bg-emerald-900/50 border border-emerald-600'   // Standard data drive
                              } transition-colors`}
                            >
                              <div className="text-center">
                                <div className="text-gray-200">{drive.size}</div>
                                <div className="text-gray-400">TB</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special devices */}
                {(pool.spares.length > 0 || pool.slog.length > 0 || pool.l2arc.length > 0) && (
                  <div className="flex gap-4">
                    {/* Hot spares */}
                    {pool.spares.length > 0 && (
                      <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-600">
                        <div className="text-sm text-gray-400 mb-2">Hot Spares</div>
                        <div className="flex gap-2">
                          {pool.spares.map((spare, index) => (
                            <div 
                              key={index}
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-xs bg-orange-900/50 border border-orange-700"
                            >
                              <div className="text-center">
                                <div className="text-gray-200">{spare.size}</div>
                                <div className="text-gray-400">TB</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SLOG */}
                    {pool.slog.length > 0 && (
                      <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-600">
                        <div className="text-sm text-gray-400 mb-2">SLOG (ZIL)</div>
                        <div className="flex gap-2">
                          {pool.slog.map((device, index) => (
                            <div 
                              key={index}
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-xs bg-yellow-900/50 border border-yellow-700"
                            >
                              <div className="text-center">
                                <div className="text-gray-200">{device.size}</div>
                                <div className="text-gray-400">{device.unit}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* L2ARC */}
                    {pool.l2arc.length > 0 && (
                      <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-600">
                        <div className="text-sm text-gray-400 mb-2">L2ARC Cache</div>
                        <div className="flex gap-2">
                          {pool.l2arc.map((device, index) => (
                            <div 
                              key={index}
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-xs bg-cyan-900/50 border border-cyan-700"
                            >
                              <div className="text-center">
                                <div className="text-gray-200">{device.size}</div>
                                <div className="text-gray-400">{device.unit}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-sm text-gray-400">
            <strong className="text-gray-300">Note:</strong> This visualization is simplified for planning purposes. 
            Actual ZFS implementation uses dynamic block allocation and sophisticated algorithms for data, parity, 
            and metadata distribution. M = Mirror copy, P = Parity data, D = Distributed parity.
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-neutral-700 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-medium text-gray-200 mb-4">Pool Summary</h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive size={20} className="text-blue-400" />
                  <span className="text-gray-200">Total Raw Storage:</span>
                </div>
                <span className="text-gray-200 font-mono">{results.totalRaw.toFixed(2)} TB</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator size={20} className="text-green-400" />
                  <span className="text-gray-200">Usable Space:</span>
                </div>
                <span className="text-gray-200 font-mono">{results.usableSpace.toFixed(2)} TB</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-purple-400" />
                  <span className="text-gray-200">Protection Level:</span>
                </div>
                <span className="text-gray-200">{results.protection}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={20} className="text-yellow-400" />
                  <span className="text-gray-200">Storage Efficiency:</span>
                </div>
                <span className="text-gray-200">{results.efficiency.toFixed(1)}%</span>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Estimated ZFS Commands:</h5>
              <pre className="text-sm text-gray-400 overflow-x-auto">
                {`zpool create \\
  ${pool.name} \\
  ${pool.vdevs.map(vdev => 
    vdev.type + ' ' + vdev.drives.map(() => '/dev/sdX').join(' ')
  ).join(' \\\n  ')}${
  pool.spares.length > 0 
    ? ' \\\n  spare ' + pool.spares.map(() => '/dev/sdX').join(' ') 
    : ''
  }${
  pool.slog.length > 0
    ? ' \\\n  log ' + '/dev/sdX'
    : ''
  }${
  pool.l2arc.length > 0
    ? ' \\\n  cache ' + '/dev/sdX'
    : ''
  }
  -o ashift=${pool.ashift}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Recommendations and Warnings */}
        <div className="mt-6 space-y-4">
          {pool.vdevs.some(vdev => vdev.type === 'raidz1' && vdev.drives.length > 8) && (
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-4 rounded-lg">
              <AlertTriangle size={20} />
              <span>RAIDZ1 vdevs with more than 8 drives increase rebuild times and failure risk.</span>
            </div>
          )}
          
          {pool.vdevs.some(vdev => vdev.type === 'stripe') && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-lg">
              <AlertTriangle size={20} />
              <span>Stripe vdevs provide no redundancy. Data loss will occur if any drive fails.</span>
            </div>
          )}
          
          {pool.slog.length > 0 && !pool.slog.some(device => device.size >= 16) && (
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-4 rounded-lg">
              <AlertTriangle size={20} />
              <span>SLOG devices should be at least 16GB for optimal performance.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZFSCalculator;