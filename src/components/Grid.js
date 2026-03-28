import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { GRID_SIZE } from '../hooks/useGameEngine';
export const Grid = ({ grid, onCellDrop, draggingBlockInfo, trayBlocks, getValidPlacement, gameOver, onGameOverAnimationComplete }) => {
    const [hoverCell, setHoverCell] = useState(null);
    const [cascadeGrid, setCascadeGrid] = useState(null);
    useEffect(() => {
        if (gameOver) {
            let tempGrid = grid.map(r => [...r]);
            setCascadeGrid(tempGrid);
            let r = GRID_SIZE - 1;
            const interval = setInterval(() => {
                if (r < 0) {
                    clearInterval(interval);
                    if (onGameOverAnimationComplete)
                        onGameOverAnimationComplete();
                    return;
                }
                tempGrid = tempGrid.map((row, idx) => {
                    if (idx === r) {
                        return row.map(() => 'cascade');
                    }
                    return row;
                });
                setCascadeGrid(tempGrid);
                r--;
            }, 50);
            return () => clearInterval(interval);
        }
        else {
            setCascadeGrid(null);
        }
    }, [gameOver, grid, onGameOverAnimationComplete]);
    const handleDragOver = (e, rIdx, cIdx) => {
        e.preventDefault();
        setHoverCell({ r: rIdx, c: cIdx });
    };
    const handleDrop = (e, row, col) => {
        e.preventDefault();
        setHoverCell(null);
        const dataStr = e.dataTransfer.getData('text/plain');
        try {
            const data = JSON.parse(dataStr);
            if (data && typeof data.trayIndex === 'number') {
                onCellDrop(row - data.grabR, col - data.grabC, data.trayIndex);
            }
        }
        catch {
            // Fallback
            const trayIndex = parseInt(dataStr, 10);
            if (!isNaN(trayIndex)) {
                onCellDrop(row, col, trayIndex);
            }
        }
    };
    // Calculate ghost cells
    let ghostCells = [];
    if (hoverCell && draggingBlockInfo && trayBlocks && getValidPlacement && !gameOver) {
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
    // Calculate clearing preview cells
    let clearingCells = [];
    if (ghostCells.length > 0 && !gameOver) {
        const simGrid = grid.map(r => [...r]);
        ghostCells.forEach(g => {
            simGrid[g.r][g.c] = g.color;
        });
        const fullRows = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            if (simGrid[r].every(c => c !== null))
                fullRows.push(r);
        }
        const fullCols = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            let isFull = true;
            for (let r = 0; r < GRID_SIZE; r++) {
                if (simGrid[r][c] === null) {
                    isFull = false;
                    break;
                }
            }
            if (isFull)
                fullCols.push(c);
        }
        fullRows.forEach(r => {
            for (let c = 0; c < GRID_SIZE; c++)
                clearingCells.push({ r, c });
        });
        fullCols.forEach(c => {
            for (let r = 0; r < GRID_SIZE; r++) {
                if (!clearingCells.find(cell => cell.r === r && cell.c === c)) {
                    clearingCells.push({ r, c });
                }
            }
        });
    }
    const displayGrid = cascadeGrid || grid;
    return (_jsx("div", { className: "game-grid", onMouseLeave: () => setHoverCell(null), children: displayGrid.map((rowArr, rIdx) => rowArr.map((cellColor, cIdx) => {
            const isGhost = (!cascadeGrid) && ghostCells.find(g => g.r === rIdx && g.c === cIdx);
            const drawGhost = isGhost && !(grid[rIdx][cIdx]);
            const ghostClass = drawGhost ? `bg-${isGhost.color} ghost-preview` : '';
            const isClearing = (!cascadeGrid) && clearingCells.find(c => c.r === rIdx && c.c === cIdx);
            const clearingClass = isClearing ? 'clearing-preview' : '';
            const bgClass = cellColor === 'cascade' ? 'bg-gameOver' : (cellColor ? `bg-${cellColor}` : '');
            return (_jsx("div", { className: `grid-cell ${bgClass} ${ghostClass} ${clearingClass}`, onDragOver: (e) => handleDragOver(e, rIdx, cIdx), onDrop: (e) => handleDrop(e, rIdx, cIdx) }, `${rIdx}-${cIdx}`));
        })) }));
};
