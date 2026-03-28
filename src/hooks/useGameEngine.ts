import { useState, useCallback, useEffect } from 'react';
import { BlockDef, getRandomBlocks, BlockColorName } from '../utils/shapes';
import { useTheme } from '../context/ThemeContext';
import { playSound } from '../utils/audio';

export type GridCell = string | null;
export const GRID_SIZE = 8;

export const createEmptyGrid = (): GridCell[][] => 
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

export function useGameEngine() {
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid());
  const [trayBlocks, setTrayBlocks] = useState<(BlockDef | null)[]>(getRandomBlocks(3));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('blockBlastHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [combo, setCombo] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const { currentTheme } = useTheme();

  const checkGameOver = (currentGrid: GridCell[][], currentTray: (BlockDef | null)[]) => {
    const activeBlocks = currentTray.filter(b => b !== null) as BlockDef[];
    if (activeBlocks.length === 0) return false;

    for (const block of activeBlocks) {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (canPlaceBlock(block, r, c, currentGrid)) {
            return false;
          }
        }
      }
    }
    return true; 
  };

  const processLines = (currentGrid: GridCell[][]) => {
    const rowsToClear = new Set<number>();
    const colsToClear = new Set<number>();

    for (let r = 0; r < GRID_SIZE; r++) {
      if (currentGrid[r].every(cell => cell !== null)) {
        rowsToClear.add(r);
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      let isFull = true;
      for (let r = 0; r < GRID_SIZE; r++) {
        if (currentGrid[r][c] === null) {
          isFull = false;
          break;
        }
      }
      if (isFull) colsToClear.add(c);
    }

    const linesCleared = rowsToClear.size + colsToClear.size;
    if (linesCleared > 0) {
      const newGrid = currentGrid.map(row => [...row]);
      
      rowsToClear.forEach(r => {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (newGrid[r][c] && !newGrid[r][c]!.endsWith('_clearing')) {
            newGrid[r][c] = `${newGrid[r][c]}_clearing`;
          }
        }
      });

      colsToClear.forEach(c => {
        for (let r = 0; r < GRID_SIZE; r++) {
          if (newGrid[r][c] && !newGrid[r][c]!.endsWith('_clearing')) {
            newGrid[r][c] = `${newGrid[r][c]}_clearing`;
          }
        }
      });

      return { newGrid, linesCleared };
    }
    
    return { newGrid: currentGrid, linesCleared: 0 };
  };

  const canPlaceBlock = useCallback((block: BlockDef, row: number, col: number, currentGrid: GridCell[][]) => {
    for (let r = 0; r < block.shape.length; r++) {
      for (let c = 0; c < block.shape[r].length; c++) {
        if (block.shape[r][c] === 1) {
          const targetRow = row + r;
          const targetCol = col + c;
          if (targetRow >= GRID_SIZE || targetCol >= GRID_SIZE || targetRow < 0 || targetCol < 0) return false;
          if (currentGrid[targetRow][targetCol] !== null && !currentGrid[targetRow][targetCol]!.endsWith('_clearing')) return false;
        }
      }
    }
    return true;
  }, []);

  const getValidPlacement = useCallback((block: BlockDef, row: number, col: number, currentGrid: GridCell[][]) => {
    // Snap preference: Exact, then Cardinal, then Diagonal
    const offsets = [
      [0, 0],
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1],
      // Extended snap range (optional, 2 units)
      [-2, 0], [2, 0], [0, -2], [0, 2]
    ];
    
    for (const [dr, dc] of offsets) {
      if (canPlaceBlock(block, row + dr, col + dc, currentGrid)) {
        return { r: row + dr, c: col + dc };
      }
    }
    return null;
  }, [canPlaceBlock]);

  const placeBlock = (trayIndex: number, rawRow: number, rawCol: number): boolean => {
    const block = trayBlocks[trayIndex];
    if (!block) return false;

    const placement = getValidPlacement(block, rawRow, rawCol, grid);
    if (!placement) return false;

    const { r: row, c: col } = placement;

    // Place block
    let newGrid = grid.map(r => [...r]);
    for (let r = 0; r < block.shape.length; r++) {
      for (let c = 0; c < block.shape[r].length; c++) {
        if (block.shape[r][c] === 1) {
          newGrid[row + r][col + c] = block.color;
        }
      }
    }

    // Process lines
    const { newGrid: processedGrid, linesCleared } = processLines(newGrid);
    
    // Update Score
    const blocksPlacedCount = block.shape.flat().filter(x => x === 1).length;
    let earnedScore = blocksPlacedCount * 10;
    
    if (linesCleared > 0) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      earnedScore += (linesCleared * 100) * newCombo;
    } else {
      setCombo(0);
    }
    
    setScore(prev => prev + earnedScore);
    setGrid(processedGrid);

    if (linesCleared > 0) {
      setTimeout(() => {
        setGrid(prev => prev.map(row => row.map(cell => cell && cell.endsWith('_clearing') ? null : cell)));
      }, 300);
    }

    // Update Tray
    const newTray = [...trayBlocks];
    newTray[trayIndex] = null;
    
    playSound(currentTheme, 'drop');
    if (linesCleared > 0) {
      const isPerfectClear = processedGrid.every(row => row.every(cell => cell === null || cell.endsWith('_clearing')));
      const clearAction = isPerfectClear ? 'clear_all' : 'clear_single';
      setTimeout(() => playSound(currentTheme, clearAction), 150);
    }
    
    if (newTray.every(b => b === null)) {
      setTrayBlocks(getRandomBlocks(3));
    } else {
      setTrayBlocks(newTray);
    }

    return true;
  };

  useEffect(() => {
    if (checkGameOver(grid, trayBlocks)) {
      setGameOver(true);
    }
  }, [grid, trayBlocks]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('blockBlastHighScore', score.toString());
    }
  }, [score, highScore]);

  return {
    grid,
    trayBlocks,
    score,
    highScore,
    combo,
    gameOver,
    canPlaceBlock,
    getValidPlacement,
    placeBlock,
    resetGame: () => {
      setGrid(createEmptyGrid());
      setTrayBlocks(getRandomBlocks(3));
      setScore(0);
      setCombo(0);
      setGameOver(false);
    }
  };
}
