export const BLOCKS = {
    // 1x1
    'dot': { id: 'dot', color: 'cyan', shape: [[1]] },
    // Lines (1~5 길이를 가진 일자 블록)
    'h2': { id: 'h2', color: 'green', shape: [[1, 1]] },
    'v2': { id: 'v2', color: 'green', shape: [[1], [1]] },
    'h3': { id: 'h3', color: 'yellow', shape: [[1, 1, 1]] },
    'v3': { id: 'v3', color: 'yellow', shape: [[1], [1], [1]] },
    'h4': { id: 'h4', color: 'red', shape: [[1, 1, 1, 1]] },
    'v4': { id: 'v4', color: 'red', shape: [[1], [1], [1], [1]] },
    'h5': { id: 'h5', color: 'purple', shape: [[1, 1, 1, 1, 1]] },
    'v5': { id: 'v5', color: 'purple', shape: [[1], [1], [1], [1], [1]] },
    // Squares (정사각형)
    'sq2': { id: 'sq2', color: 'orange', shape: [[1, 1], [1, 1]] },
    'sq3': { id: 'sq3', color: 'red', shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
    // Small L (2x2 크기 꺾인 블록)
    'l_sm_1': { id: 'l_sm_1', color: 'blue', shape: [[1, 0], [1, 1]] },
    'l_sm_2': { id: 'l_sm_2', color: 'blue', shape: [[0, 1], [1, 1]] },
    'l_sm_3': { id: 'l_sm_3', color: 'blue', shape: [[1, 1], [1, 0]] },
    'l_sm_4': { id: 'l_sm_4', color: 'blue', shape: [[1, 1], [0, 1]] },
    // Medium L (2x3 / 3x2 비율 꺾인 블록)
    'l_md_h1': { id: 'l_md_h1', color: 'orange', shape: [[1, 1, 1], [1, 0, 0]] },
    'l_md_h2': { id: 'l_md_h2', color: 'orange', shape: [[1, 1, 1], [0, 0, 1]] },
    'l_md_h3': { id: 'l_md_h3', color: 'orange', shape: [[1, 0, 0], [1, 1, 1]] },
    'l_md_h4': { id: 'l_md_h4', color: 'orange', shape: [[0, 0, 1], [1, 1, 1]] },
    'l_md_v1': { id: 'l_md_v1', color: 'orange', shape: [[1, 1], [1, 0], [1, 0]] },
    'l_md_v2': { id: 'l_md_v2', color: 'orange', shape: [[1, 1], [0, 1], [0, 1]] },
    'l_md_v3': { id: 'l_md_v3', color: 'orange', shape: [[1, 0], [1, 0], [1, 1]] },
    'l_md_v4': { id: 'l_md_v4', color: 'orange', shape: [[0, 1], [0, 1], [1, 1]] },
    // Large L (3x3 크기 크게 꺾인 블록)
    'l_lg_1': { id: 'l_lg_1', color: 'cyan', shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },
    'l_lg_2': { id: 'l_lg_2', color: 'cyan', shape: [[0, 0, 1], [0, 0, 1], [1, 1, 1]] },
    'l_lg_3': { id: 'l_lg_3', color: 'cyan', shape: [[1, 1, 1], [1, 0, 0], [1, 0, 0]] },
    'l_lg_4': { id: 'l_lg_4', color: 'cyan', shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]] },
    // Rectangles (2x3 / 3x2 꽉 찬 직사각형)
    'rect_h': { id: 'rect_h', color: 'blue', shape: [[1, 1, 1], [1, 1, 1]] },
    'rect_v': { id: 'rect_v', color: 'blue', shape: [[1, 1], [1, 1], [1, 1]] },
    // T-shapes (2x3 비율)
    't_1': { id: 't_1', color: 'purple', shape: [[1, 1, 1], [0, 1, 0]] },
    't_2': { id: 't_2', color: 'purple', shape: [[0, 1, 0], [1, 1, 1]] },
    't_3': { id: 't_3', color: 'purple', shape: [[1, 0], [1, 1], [1, 0]] },
    't_4': { id: 't_4', color: 'purple', shape: [[0, 1], [1, 1], [0, 1]] },
    // Z and S shapes (가로 및 세로)
    'z_shape_h': { id: 'z_shape_h', color: 'green', shape: [[1, 1, 0], [0, 1, 1]] },
    's_shape_h': { id: 's_shape_h', color: 'green', shape: [[0, 1, 1], [1, 1, 0]] },
    'z_shape_v': { id: 'z_shape_v', color: 'green', shape: [[0, 1], [1, 1], [1, 0]] },
    's_shape_v': { id: 's_shape_v', color: 'green', shape: [[1, 0], [1, 1], [0, 1]] }
};
import { GRID_SIZE } from '../hooks/useGameEngine';
export const isBlockPlaceable = (block, grid) => {
    for (let r = 0; r <= GRID_SIZE - block.shape.length; r++) {
        for (let c = 0; c <= GRID_SIZE - block.shape[0].length; c++) {
            let canPlace = true;
            for (let br = 0; br < block.shape.length; br++) {
                for (let bc = 0; bc < block.shape[br].length; bc++) {
                    if (block.shape[br][bc] === 1 && grid[r + br][c + bc] !== null) {
                        canPlace = false;
                        break;
                    }
                }
                if (!canPlace)
                    break;
            }
            if (canPlace)
                return true;
        }
    }
    return false;
};
// block categories 
const EASY_BLOCKS = ['dot', 'h2', 'v2', 'sq2', 'l_sm_1', 'l_sm_2', 'l_sm_3', 'l_sm_4'];
const MEDIUM_BLOCKS = ['h3', 'v3', 't_1', 't_2', 't_3', 't_4', 'z_shape_h', 's_shape_h', 'z_shape_v', 's_shape_v'];
const HARD_BLOCKS = ['h4', 'v4', 'h5', 'v5', 'sq3', 'rect_h', 'rect_v', 'l_md_h1', 'l_md_h2', 'l_md_h3', 'l_md_h4', 'l_md_v1', 'l_md_v2', 'l_md_v3', 'l_md_v4', 'l_lg_1', 'l_lg_2', 'l_lg_3', 'l_lg_4'];
const COMBO_SETS = [
    ['sq3', 'sq3', 'rect_v'], // Horizontal Boom (3 rows = 3+3+2)
    ['sq3', 'sq3', 'rect_h'], // Vertical Boom (3 cols)
    ['h5', 'h2', 'dot'], // Long Line (1 row)
    ['v5', 'v2', 'dot'], // Tall Line (1 col)
    ['sq2', 'sq2', 'h4'], // 2 rows boom
    ['rect_h', 'rect_h', 'h2'] // Horizontal Boom (2 rows = 3+3+2)
];
export const getRandomBlocks = (count = 3) => {
    const keys = Object.keys(BLOCKS);
    const selected = [];
    for (let i = 0; i < count; i++) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        selected.push(BLOCKS[randomKey]);
    }
    return selected;
};
export const getAdaptiveBlocks = (count = 3, grid) => {
    let filled = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] !== null)
                filled++;
        }
    }
    const occupancy = filled / (GRID_SIZE * GRID_SIZE);
    const selected = [];
    // Pity System
    if (occupancy > 0.6) {
        console.log("DDA: Triggered Pity System (Occupancy: " + (occupancy * 100).toFixed(1) + "%)");
        const placeableEasy = EASY_BLOCKS.filter(key => isBlockPlaceable(BLOCKS[key], grid));
        if (placeableEasy.length > 0) {
            const pityKey = placeableEasy[Math.floor(Math.random() * placeableEasy.length)];
            selected.push(BLOCKS[pityKey]);
        }
        else {
            selected.push(BLOCKS['dot']); // ultimate pity fallback
        }
        const remainingPool = [...MEDIUM_BLOCKS, ...HARD_BLOCKS];
        while (selected.length < count) {
            const randomKey = remainingPool[Math.floor(Math.random() * remainingPool.length)];
            selected.push(BLOCKS[randomKey]);
        }
        return selected.sort(() => Math.random() - 0.5); // shuffle
    }
    // Synergy Combo Feeder Sets 
    if (Math.random() < 0.15 && occupancy < 0.4) {
        console.log("DDA: Triggered Synergy Set!");
        const set = COMBO_SETS[Math.floor(Math.random() * COMBO_SETS.length)];
        return set.map(key => BLOCKS[key]);
    }
    // Dynamic Weights (Normal mode)
    console.log("DDA: Standard Weighted Spawning");
    let pool = [];
    if (occupancy < 0.2) {
        pool = [...HARD_BLOCKS, ...HARD_BLOCKS, ...MEDIUM_BLOCKS, ...EASY_BLOCKS];
    }
    else if (occupancy > 0.4) {
        pool = [...EASY_BLOCKS, ...MEDIUM_BLOCKS, ...HARD_BLOCKS];
    }
    else {
        pool = [...HARD_BLOCKS, ...MEDIUM_BLOCKS, ...MEDIUM_BLOCKS, ...EASY_BLOCKS, ...EASY_BLOCKS];
    }
    for (let i = 0; i < count; i++) {
        const randomKey = pool[Math.floor(Math.random() * pool.length)];
        selected.push(BLOCKS[randomKey]);
    }
    return selected;
};
