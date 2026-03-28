import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Grid } from './components/Grid';
import { BlockTray } from './components/BlockTray';
import { useTheme } from './context/ThemeContext';
import './index.css';
const App = () => {
    const { grid, trayBlocks, score, highScore, combo, gameOver, getValidPlacement, placeBlock, resetGame } = useGameEngine();
    const { currentTheme, setTheme } = useTheme();
    const [draggingBlockInfo, setDraggingBlockInfo] = useState(null);
    const [pointerPos, setPointerPos] = useState(null);
    const [hoverCell, setHoverCell] = useState(null);
    const [showGameOverModal, setShowGameOverModal] = useState(false);
    const handlePointerDownBlock = (trayIndex, grabR, grabC, e) => {
        // We don't prevent default here as it might block standard touch behaviors on other elements, 
        // but we have touch-action: none in CSS.
        setDraggingBlockInfo({ trayIndex, grabR, grabC });
        setPointerPos({ x: e.clientX, y: e.clientY });
    };
    const handlePointerMove = (e) => {
        if (!draggingBlockInfo)
            return;
        setPointerPos({ x: e.clientX, y: e.clientY });
        // Find grid cell under pointer
        const element = document.elementFromPoint(e.clientX, e.clientY);
        const gridCell = element?.closest('.grid-cell');
        if (gridCell) {
            const r = parseInt(gridCell.getAttribute('data-row') || '-1', 10);
            const c = parseInt(gridCell.getAttribute('data-col') || '-1', 10);
            if (r >= 0 && c >= 0) {
                setHoverCell({ r, c });
            }
            else {
                setHoverCell(null);
            }
        }
        else {
            setHoverCell(null);
        }
    };
    const handlePointerUp = (e) => {
        if (draggingBlockInfo) {
            if (hoverCell) {
                const dropRow = hoverCell.r - draggingBlockInfo.grabR;
                const dropCol = hoverCell.c - draggingBlockInfo.grabC;
                const block = trayBlocks[draggingBlockInfo.trayIndex];
                if (block) {
                    const validPlacement = getValidPlacement(block, dropRow, dropCol, grid);
                    if (validPlacement) {
                        placeBlock(draggingBlockInfo.trayIndex, dropRow, dropCol);
                    }
                }
            }
            setDraggingBlockInfo(null);
            setPointerPos(null);
            setHoverCell(null);
        }
    };
    const handleResetGame = () => {
        setShowGameOverModal(false);
        resetGame();
    };
    return (_jsxs("div", { className: "app-container", onPointerMove: handlePointerMove, onPointerUp: handlePointerUp, onPointerCancel: handlePointerUp, children: [_jsxs("div", { className: "game-header", children: [_jsx("h1", { children: "Block Drop" }), _jsxs("div", { className: "score-board", children: [_jsxs("h2", { children: ["Score: ", score] }), _jsxs("h2", { children: ["High Score: ", highScore] }), _jsxs("h3", { children: ["Combo: ", combo > 1 ? `${combo}x` : '-'] })] })] }), showGameOverModal && (_jsxs("div", { className: "game-over-modal", children: [_jsx("h2", { children: "Game Over" }), _jsx("button", { onClick: handleResetGame, children: "Play Again" })] })), _jsx(Grid, { grid: grid, hoverCell: hoverCell, draggingBlockInfo: draggingBlockInfo, trayBlocks: trayBlocks, getValidPlacement: getValidPlacement, gameOver: gameOver, onGameOverAnimationComplete: () => setShowGameOverModal(true) }), _jsx(BlockTray, { blocks: trayBlocks, onPointerDownBlock: handlePointerDownBlock, draggingBlockInfo: draggingBlockInfo }), draggingBlockInfo && pointerPos && trayBlocks[draggingBlockInfo.trayIndex] && (_jsx("div", { className: "drag-overlay drag-overlay-block", style: { left: pointerPos.x, top: pointerPos.y }, children: trayBlocks[draggingBlockInfo.trayIndex].shape.map((row, rIdx) => (_jsx("div", { className: "block-row", children: row.map((val, cIdx) => (_jsx("div", { className: `block-cell ${val ? `bg-${trayBlocks[draggingBlockInfo.trayIndex].color}` : 'empty'}` }, cIdx))) }, rIdx))) }))] }));
};
export default App;
