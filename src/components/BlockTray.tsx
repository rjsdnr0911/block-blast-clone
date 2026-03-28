import React, { useState } from 'react';
import { BlockDef } from '../utils/shapes';

interface BlockTrayProps {
  blocks: (BlockDef | null)[];
  onPointerDownBlock: (index: number, grabR: number, grabC: number, e: React.PointerEvent) => void;
  draggingBlockInfo: { trayIndex: number; grabR: number; grabC: number } | null;
}

export const BlockTray: React.FC<BlockTrayProps> = ({ blocks, onPointerDownBlock, draggingBlockInfo }) => {
  return (
    <div className="block-tray">
      {blocks.map((block, idx) => {
        const isDraggingThis = draggingBlockInfo?.trayIndex === idx;
        return (
          <div 
            key={idx} 
            className={`tray-slot ${isDraggingThis ? 'dragging' : ''}`}
          >
            {block && (
              <div 
                className="draggable-block" 
                style={{ touchAction: 'none' }}
              >
                {block.shape.map((row, r) => (
                  <div key={r} className="block-row">
                    {row.map((val, c) => (
                      <div 
                        key={c} 
                        onPointerDown={(e) => {
                          if (val) {
                            onPointerDownBlock(idx, r, c, e);
                          }
                        }}
                        className={`block-cell ${val ? `bg-${block.color}` : 'empty'}`} 
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
