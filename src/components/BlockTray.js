import { jsx as _jsx } from "react/jsx-runtime";
export const BlockTray = ({ blocks, onPointerDownBlock, draggingBlockInfo }) => {
    return (_jsx("div", { className: "block-tray", children: blocks.map((block, idx) => {
            const isDraggingThis = draggingBlockInfo?.trayIndex === idx;
            return (_jsx("div", { className: `tray-slot ${isDraggingThis ? 'dragging' : ''}`, children: block && (_jsx("div", { className: "draggable-block", style: { touchAction: 'none' }, children: block.shape.map((row, r) => (_jsx("div", { className: "block-row", children: row.map((val, c) => (_jsx("div", { onPointerDown: (e) => {
                                if (val) {
                                    onPointerDownBlock(idx, r, c, e);
                                }
                            }, className: `block-cell ${val ? `bg-${block.color}` : 'empty'}` }, c))) }, r))) })) }, idx));
        }) }));
};
