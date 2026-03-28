import React, { useState } from 'react';
import { BlockDef } from '../utils/shapes';

interface BlockTrayProps {
  blocks: (BlockDef | null)[];
}

export const BlockTray: React.FC<BlockTrayProps> = ({ blocks }) => {
  const [grabOffset, setGrabOffset] = useState({ r: 0, c: 0 });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    const payload = JSON.stringify({ trayIndex: index, grabR: grabOffset.r, grabC: grabOffset.c });
    e.dataTransfer.setData('text/plain', payload);
  };

  return (
    <div className="block-tray">
      {blocks.map((block, idx) => (
        <div 
          key={idx} 
          className="tray-slot"
        >
          {block && (
            <div 
              className="draggable-block" 
              draggable 
              onDragStart={(e) => handleDragStart(e, idx)}
            >
              {block.shape.map((row, r) => (
                <div key={r} className="block-row">
                  {row.map((val, c) => (
                    <div 
                      key={c} 
                      onPointerDown={() => setGrabOffset({ r, c })}
                      className={`block-cell ${val ? `bg-${block.color}` : 'empty'}`} 
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
