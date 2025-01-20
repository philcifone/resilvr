import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_POOL_CONFIG } from '../constants';
import { calculatePoolCapacity } from '../utils/calculations';

export function useZFSPool() {
  const [pool, setPool] = useState(DEFAULT_POOL_CONFIG);
  const [results, setResults] = useState({
    totalRaw: 0,
    usableSpace: 0,
    protection: '',
    efficiency: 0
  });

  const addVdev = useCallback(() => {
    setPool(prev => ({
      ...prev,
      vdevs: [...prev.vdevs, {
        type: 'raidz1',
        drives: [{size: 4, unit: 'TB'}, {size: 4, unit: 'TB'}, {size: 4, unit: 'TB'}],
        uniform: true
      }]
    }));
  }, []);

  const removeVdev = useCallback((index) => {
    setPool(prev => ({
      ...prev,
      vdevs: prev.vdevs.filter((_, i) => i !== index)
    }));
  }, []);

  const updateVdev = useCallback((index, updates) => {
    setPool(prev => ({
      ...prev,
      vdevs: prev.vdevs.map((vdev, i) => 
        i === index ? { ...vdev, ...updates } : vdev
      )
    }));
  }, []);

  const addDrive = useCallback((vdevIndex, drive = {size: 4, unit: 'TB'}) => {
    setPool(prev => ({
      ...prev,
      vdevs: prev.vdevs.map((vdev, i) => 
        i === vdevIndex 
          ? { ...vdev, drives: [...vdev.drives, drive] }
          : vdev
      )
    }));
  }, []);

  const removeDrive = useCallback((vdevIndex, driveIndex) => {
    setPool(prev => ({
      ...prev,
      vdevs: prev.vdevs.map((vdev, i) => 
        i === vdevIndex
          ? { ...vdev, drives: vdev.drives.filter((_, j) => j !== driveIndex) }
          : vdev
      )
    }));
  }, []);

  const addSpare = useCallback(() => {
    setPool(prev => ({
      ...prev,
      spares: [...prev.spares, {size: 4, unit: 'TB'}]
    }));
  }, []);

  const removeSpare = useCallback((index) => {
    setPool(prev => ({
      ...prev,
      spares: prev.spares.filter((_, i) => i !== index)
    }));
  }, []);

  const updateSpare = useCallback((index, updates) => {
    setPool(prev => ({
      ...prev,
      spares: prev.spares.map((spare, i) => 
        i === index ? { ...spare, ...updates } : spare
      )
    }));
  }, []);

  const updatePoolName = useCallback((name) => {
    setPool(prev => ({ ...prev, name }));
  }, []);

  const updateAshift = useCallback((ashift) => {
    setPool(prev => ({ ...prev, ashift }));
  }, []);

  const toggleSlog = useCallback((enabled) => {
    setPool(prev => ({
      ...prev,
      slog: enabled ? [{size: 16, unit: 'GB'}] : [],
      slogMirrored: false // Reset mirror state when toggling SLOG
    }));
  }, []);

  const updateSlog = useCallback((updates) => {
    setPool(prev => ({
      ...prev,
      slog: [{ ...prev.slog[0], ...updates }]
    }));
  }, []);

  const toggleSlogMirror = useCallback((mirrored) => {
    setPool(prev => ({
      ...prev,
      slogMirrored: mirrored
    }));
  }, []);

  const toggleL2arc = useCallback((enabled) => {
    setPool(prev => ({
      ...prev,
      l2arc: enabled ? [{size: 256, unit: 'GB'}] : []
    }));
  }, []);

  const updateL2arc = useCallback((updates) => {
    setPool(prev => ({
      ...prev,
      l2arc: [{ ...prev.l2arc[0], ...updates }]
    }));
  }, []);

  useEffect(() => {
    setResults(calculatePoolCapacity(pool));
  }, [pool]);

  return {
    pool,
    results,
    addVdev,
    removeVdev,
    updateVdev,
    addDrive,
    removeDrive,
    addSpare,
    removeSpare,
    updateSpare,
    updatePoolName,
    updateAshift,
    toggleSlog,
    updateSlog,
    toggleL2arc,
    updateL2arc,
    toggleSlogMirror  // Added this to the return object
  };
}