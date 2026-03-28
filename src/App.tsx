import React, { useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Grid } from './components/Grid';
import { BlockTray } from './components/BlockTray';
import { useTheme, ThemeType } from './context/ThemeContext';
import './index.css';

const App: React.FC = () => {
  const { grid, trayBlocks, score, highScore, combo, gameOver, getValidPlacement, placeBlock, resetGame } = useGameEngine();
  const { currentTheme, setTheme } = useTheme();

  const [draggingBlockInfo, setDraggingBlockInfo] = useState<{ trayIndex: number, grabR: number, grabC: number } | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const handleCellDrop = (row: number, col: number, trayIndex: number) => {
    placeBlock(trayIndex, row, col);
    setDraggingBlockInfo(null);
  };

  const handleResetGame = () => {
    setShowGameOverModal(false);
    resetGame();
  };

  return (
    <div className="app-container" onDragEnd={() => setDraggingBlockInfo(null)}>
      <div className="game-header">
        <h1>Block Drop</h1>

        <div className="score-board">
          <h2>Score: {score}</h2>
          <h2>High Score: {highScore}</h2>
          <h3>Combo: {combo > 1 ? `${combo}x` : '-'}</h3>
        </div>
      </div>
      
      {showGameOverModal && (
        <div className="game-over-modal">
          <h2>Game Over</h2>
          <button onClick={handleResetGame}>Play Again</button>
        </div>
      )}

      <Grid 
        grid={grid} 
        onCellDrop={handleCellDrop} 
        draggingBlockInfo={draggingBlockInfo}
        trayBlocks={trayBlocks}
        getValidPlacement={getValidPlacement}
        gameOver={gameOver}
        onGameOverAnimationComplete={() => setShowGameOverModal(true)}
      />
      <BlockTray 
        blocks={trayBlocks} 
        onDragStartInfo={setDraggingBlockInfo}
      />
    </div>
  );
};

export default App;
