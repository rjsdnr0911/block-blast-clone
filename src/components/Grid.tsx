import React from 'react';
import { GridCell, GRID_SIZE } from '../hooks/useGameEngine';

interface GridProps {
  grid: GridCell[][];
  onCellDrop: (row: number, col: number, trayIndex: number) => void;
}

export const Grid: React.FC<GridProps> = ({ grid, onCellDrop }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('text/plain');
    try {
      const data = JSON.parse(dataStr);
      if (data && typeof data.trayIndex === 'number') {
        onCellDrop(row - data.grabR, col - data.grabC, data.trayIndex);
      }
    } catch {
      // Fallback
      const trayIndex = parseInt(dataStr, 10);
      if (!isNaN(trayIndex)) {
        onCellDrop(row, col, trayIndex);
      }
    }
  };

  return (
    <div className="game-grid">
      {grid.map((rowArr, rIdx) => 
        rowArr.map((cellColor, cIdx) => (
          <div 
            key={`${rIdx}-${cIdx}`}
            className={`grid-cell ${cellColor ? `bg-${cellColor}` : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, rIdx, cIdx)}
          />
        ))
      )}
    </div>
  );
};
