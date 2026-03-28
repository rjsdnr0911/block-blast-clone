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

  const handleCellDrop = (row: number, col: number, trayIndex: number) => {
    placeBlock(trayIndex, row, col);
    setDraggingBlockInfo(null);
  };

  return (
    <div className="app-container" onDragEnd={() => setDraggingBlockInfo(null)}>
      <div className="game-header">
        <h1>Block Blast Neo</h1>
        <select 
          value={currentTheme} 
          onChange={e => setTheme(e.target.value as ThemeType)} 
          style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', marginBottom: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <option value="default" style={{color: 'black'}}>Neon Glass (Default)</option>
          <option value="nature" style={{color: 'black'}}>Nature Walk</option>
          <option value="keyboard" style={{color: 'black'}}>Mechanical Keyboard</option>
          <option value="minerals" style={{color: 'black'}}>Mystic Minerals (조약돌/광물 세트)</option>
        </select>
        <div className="score-board">
          <h2>Score: {score}</h2>
          <h2>High Score: {highScore}</h2>
          <h3>Combo: {combo > 1 ? `${combo}x` : '-'}</h3>
        </div>
      </div>
      
      {gameOver && (
        <div className="game-over-modal">
          <h2>Game Over</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <Grid 
        grid={grid} 
        onCellDrop={handleCellDrop} 
        draggingBlockInfo={draggingBlockInfo}
        trayBlocks={trayBlocks}
        getValidPlacement={getValidPlacement}
      />
      <BlockTray 
        blocks={trayBlocks} 
        onDragStartInfo={setDraggingBlockInfo}
      />
    </div>
  );
};

export default App;
