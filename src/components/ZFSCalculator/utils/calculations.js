export const calculateVdevCapacity = (vdev) => {
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
      case 'draid1':
        return totalDriveSpace * 0.75;
      case 'draid2':
        return totalDriveSpace * 0.7;
      case 'draid3':
        return totalDriveSpace * 0.65;
      default:
        return 0;
    }
  };
  
  export const determineProtectionLevel = (vdevs, spareCount) => {
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
  
  export const calculatePoolCapacity = (pool) => {
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
  
    return {
      totalRaw: rawCapacity,
      usableSpace: usableCapacity,
      protection,
      efficiency
    };
  };