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
    const [showGameOverModal, setShowGameOverModal] = useState(false);
    const handleCellDrop = (row, col, trayIndex) => {
        placeBlock(trayIndex, row, col);
        setDraggingBlockInfo(null);
    };
    const handleResetGame = () => {
        setShowGameOverModal(false);
        resetGame();
    };
    return (_jsxs("div", { className: "app-container", onDragEnd: () => setDraggingBlockInfo(null), children: [_jsxs("div", { className: "game-header", children: [_jsx("h1", { children: "Block Blast Neo" }), _jsxs("div", { className: "score-board", children: [_jsxs("h2", { children: ["Score: ", score] }), _jsxs("h2", { children: ["High Score: ", highScore] }), _jsxs("h3", { children: ["Combo: ", combo > 1 ? `${combo}x` : '-'] })] })] }), showGameOverModal && (_jsxs("div", { className: "game-over-modal", children: [_jsx("h2", { children: "Game Over" }), _jsx("button", { onClick: handleResetGame, children: "Play Again" })] })), _jsx(Grid, { grid: grid, onCellDrop: handleCellDrop, draggingBlockInfo: draggingBlockInfo, trayBlocks: trayBlocks, getValidPlacement: getValidPlacement, gameOver: gameOver, onGameOverAnimationComplete: () => setShowGameOverModal(true) }), _jsx(BlockTray, { blocks: trayBlocks, onDragStartInfo: setDraggingBlockInfo })] }));
};
export default App;
