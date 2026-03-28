import React, { useState } from 'react';
import { BlockDef } from '../utils/shapes';

interface BlockTrayProps {
  blocks: (BlockDef | null)[];
  onDragStartInfo: (info: { trayIndex: number; grabR: number; grabC: number; } | null) => void;
}

export const BlockTray: React.FC<BlockTrayProps> = ({ blocks, onDragStartInfo }) => {
  const [grabOffset, setGrabOffset] = useState({ r: 0, c: 0 });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    const payload = JSON.stringify({ trayIndex: index, grabR: grabOffset.r, grabC: grabOffset.c });
    e.dataTransfer.setData('text/plain', payload);
    onDragStartInfo({ trayIndex: index, grabR: grabOffset.r, grabC: grabOffset.c });
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
