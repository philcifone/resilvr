// Common drive sizes in TB (as of 2024)
export const DRIVE_SIZES = [
    1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 30
  ];
  
  // ZFS-specific constants
  export const SECTOR_SIZES = [512, 4096, 8192, 16384];
  export const VDEV_TYPES = [
    { value: 'stripe', label: 'Stripe (no redundancy)' },
    { value: 'mirror', label: 'Mirror' },
    { value: 'raidz1', label: 'RAIDZ-1' },
    { value: 'raidz2', label: 'RAIDZ-2' },
    { value: 'raidz3', label: 'RAIDZ-3' },
    { value: 'draid1', label: 'dRAID-1' },
    { value: 'draid2', label: 'dRAID-2' },
    { value: 'draid3', label: 'dRAID-3' }
  ];
  
  export const DEFAULT_POOL_CONFIG = {
    name: 'tank',
    vdevs: [{
      type: 'raidz1',
      drives: [{size: 4, unit: 'TB'}, {size: 4, unit: 'TB'}, {size: 4, unit: 'TB'}],
      uniform: true
    }],
    spares: [],
    slog: [],
    l2arc: [],
    ashift: 12
  };