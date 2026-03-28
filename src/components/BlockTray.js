import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
export const BlockTray = ({ blocks, onDragStartInfo }) => {
    const [grabOffset, setGrabOffset] = useState({ r: 0, c: 0 });
    const handleDragStart = (e, index) => {
        const payload = JSON.stringify({ trayIndex: index, grabR: grabOffset.r, grabC: grabOffset.c });
        e.dataTransfer.setData('text/plain', payload);
        onDragStartInfo({ trayIndex: index, grabR: grabOffset.r, grabC: grabOffset.c });
    };
    return (_jsx("div", { className: "block-tray", children: blocks.map((block, idx) => (_jsx("div", { className: "tray-slot", children: block && (_jsx("div", { className: "draggable-block", draggable: true, onDragStart: (e) => handleDragStart(e, idx), children: block.shape.map((row, r) => (_jsx("div", { className: "block-row", children: row.map((val, c) => (_jsx("div", { onPointerDown: () => setGrabOffset({ r, c }), className: `block-cell ${val ? `bg-${block.color}` : 'empty'}` }, c))) }, r))) })) }, idx))) }));
};
