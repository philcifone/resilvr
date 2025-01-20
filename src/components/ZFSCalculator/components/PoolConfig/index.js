import React from 'react';
import VDevList from './VDevList';
import SparesList from './SparesList';
import Advanced from './Advanced';

const PoolConfig = ({
  pool,
  onAddVdev,
  onRemoveVdev,
  onUpdateVdev,
  onAddDrive,
  onRemoveDrive,
  onAddSpare,
  onRemoveSpare,
  onUpdateSpare,
  onUpdateAshift,
  onToggleSlog,
  onUpdateSlog,
  onToggleL2arc,
  onUpdateL2arc,
  onToggleSlogMirror  // Add this prop
}) => {
  return (
    <div className="space-y-6">
      {/* VDEVs */}
      <VDevList
        vdevs={pool.vdevs}
        onAddVdev={onAddVdev}
        onRemoveVdev={onRemoveVdev}
        onUpdateVdev={onUpdateVdev}
        onAddDrive={onAddDrive}
        onRemoveDrive={onRemoveDrive}
      />

      {/* Hot Spares */}
      <SparesList
        spares={pool.spares}
        onAddSpare={onAddSpare}
        onRemoveSpare={onRemoveSpare}
        onUpdateSpare={onUpdateSpare}
      />

      {/* Advanced Options */}
      <Advanced
        ashift={pool.ashift}
        slog={pool.slog}
        l2arc={pool.l2arc}
        slogMirrored={pool.slogMirrored}  // Add this prop
        onUpdateAshift={onUpdateAshift}
        onToggleSlog={onToggleSlog}
        onUpdateSlog={onUpdateSlog}
        onToggleL2arc={onToggleL2arc}
        onUpdateL2arc={onUpdateL2arc}
        onToggleSlogMirror={onToggleSlogMirror}  // Add this prop
      />
    </div>
  );
};

export default PoolConfig;