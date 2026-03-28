import React, { useState } from 'react';
import { GridCell, GRID_SIZE } from '../hooks/useGameEngine';
import { BlockDef } from '../utils/shapes';

interface GridProps {
  grid: GridCell[][];
  onCellDrop: (row: number, col: number, trayIndex: number) => void;
  draggingBlockInfo?: { trayIndex: number; grabR: number; grabC: number; } | null;
  trayBlocks?: (BlockDef | null)[];
  getValidPlacement?: (block: BlockDef, row: number, col: number, currentGrid: GridCell[][]) => { r: number, c: number } | null;
}

export const Grid: React.FC<GridProps> = ({ grid, onCellDrop, draggingBlockInfo, trayBlocks, getValidPlacement }) => {
  const [hoverCell, setHoverCell] = useState<{ r: number, c: number } | null>(null);

  const handleDragOver = (e: React.DragEvent, rIdx: number, cIdx: number) => {
    e.preventDefault();
    setHoverCell({ r: rIdx, c: cIdx });
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    setHoverCell(null);
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

  // Calculate ghost cells
  let ghostCells: { r: number, c: number, color: string }[] = [];
  if (hoverCell && draggingBlockInfo && trayBlocks && getValidPlacement) {
    const block = trayBlocks[draggingBlockInfo.trayIndex];
    if (block) {
      const dropRow = hoverCell.r - draggingBlockInfo.grabR;
      const dropCol = hoverCell.c - draggingBlockInfo.grabC;
      const validPlacement = getValidPlacement(block, dropRow, dropCol, grid);
      if (validPlacement) {
        for (let br = 0; br < block.shape.length; br++) {
          for (let bc = 0; bc < block.shape[br].length; bc++) {
            if (block.shape[br][bc] === 1) {
              ghostCells.push({ 
                r: validPlacement.r + br, 
                c: validPlacement.c + bc, 
                color: block.color 
              });
            }
          }
        }
      }
    }
  }

  return (
    <div className="game-grid">
      {grid.map((rowArr, rIdx) => 
        rowArr.map((cellColor, cIdx) => {
          const isGhost = ghostCells.find(g => g.r === rIdx && g.c === cIdx);
          const drawGhost = isGhost && !cellColor;
          const ghostClass = drawGhost ? `bg-${isGhost.color} ghost-preview` : '';
          
          return (
            <div 
              key={`${rIdx}-${cIdx}`}
              className={`grid-cell ${cellColor ? `bg-${cellColor}` : ''} ${ghostClass}`}
              onDragOver={(e) => handleDragOver(e, rIdx, cIdx)}
              onDrop={(e) => handleDrop(e, rIdx, cIdx)}
            />
          );
        })
      )}
    </div>
  );
};
