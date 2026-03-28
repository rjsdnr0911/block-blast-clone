import React, { useState, useEffect } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Grid } from './components/Grid';
import { BlockTray } from './components/BlockTray';
import { useTheme, ThemeType } from './context/ThemeContext';
import './index.css';

const App: React.FC = () => {
  const { grid, trayBlocks, score, highScore, combo, gameOver, getValidPlacement, placeBlock, resetGame } = useGameEngine();
  const { currentTheme, setTheme } = useTheme();

  const [draggingBlockInfo, setDraggingBlockInfo] = useState<{ trayIndex: number, grabR: number, grabC: number } | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number, y: number } | null>(null);
  const [hoverCell, setHoverCell] = useState<{ r: number, c: number } | null>(null);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const handlePointerDownBlock = (trayIndex: number, grabR: number, grabC: number, e: React.PointerEvent) => {
    // We don't prevent default here as it might block standard touch behaviors on other elements, 
    // but we have touch-action: none in CSS.
    setDraggingBlockInfo({ trayIndex, grabR, grabC });
    setPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingBlockInfo) return;
    setPointerPos({ x: e.clientX, y: e.clientY });
    
    // Offset the hit-test point by -60px Y to match the top-offset of the visual block, 
    // so the ghost preview aligns exactly with the drag overlay hovering above the finger.
    const element = document.elementFromPoint(e.clientX, e.clientY - 60);
    const gridCell = element?.closest('.grid-cell');
    
    if (gridCell) {
      const r = parseInt(gridCell.getAttribute('data-row') || '-1', 10);
      const c = parseInt(gridCell.getAttribute('data-col') || '-1', 10);
      if (r >= 0 && c >= 0) {
        setHoverCell({ r, c });
      } else {
        setHoverCell(null);
      }
    } else {
      setHoverCell(null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
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

  return (
    <div 
      className="app-container" 
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
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
        hoverCell={hoverCell}
        draggingBlockInfo={draggingBlockInfo}
        trayBlocks={trayBlocks}
        getValidPlacement={getValidPlacement}
        gameOver={gameOver}
        onGameOverAnimationComplete={() => setShowGameOverModal(true)}
      />
      <BlockTray 
        blocks={trayBlocks} 
        onPointerDownBlock={handlePointerDownBlock}
        draggingBlockInfo={draggingBlockInfo}
      />

      {draggingBlockInfo && pointerPos && trayBlocks[draggingBlockInfo.trayIndex] && (
        <div 
          className="drag-overlay drag-overlay-block" 
          style={{ 
            left: pointerPos.x, 
            top: pointerPos.y,
            transform: `translate(calc(-${(draggingBlockInfo.grabC * 34) + 17}px), calc(-${(draggingBlockInfo.grabR * 34) + 17 + 60}px)) scale(1.1)`
          }}
        >
          {trayBlocks[draggingBlockInfo.trayIndex]!.shape.map((row, rIdx) => (
            <div key={rIdx} className="block-row">
              {row.map((val, cIdx) => (
                 <div 
                   key={cIdx} 
                   className={`block-cell ${val ? `bg-${trayBlocks[draggingBlockInfo.trayIndex]!.color}` : 'empty'}`} 
                 />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
