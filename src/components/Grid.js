import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
export const Grid = ({ grid, onCellDrop, draggingBlockInfo, trayBlocks, getValidPlacement }) => {
    const [hoverCell, setHoverCell] = useState(null);
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
    return (_jsx("div", { className: "game-grid", children: grid.map((rowArr, rIdx) => rowArr.map((cellColor, cIdx) => {
            const isGhost = ghostCells.find(g => g.r === rIdx && g.c === cIdx);
            const drawGhost = isGhost && !cellColor;
            const ghostClass = drawGhost ? `bg-${isGhost.color} ghost-preview` : '';
            return (_jsx("div", { className: `grid-cell ${cellColor ? `bg-${cellColor}` : ''} ${ghostClass}`, onDragOver: (e) => handleDragOver(e, rIdx, cIdx), onDrop: (e) => handleDrop(e, rIdx, cIdx) }, `${rIdx}-${cIdx}`));
        })) }));
};
