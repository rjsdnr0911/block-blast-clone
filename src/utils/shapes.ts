export type BlockShape = number[][];
export type BlockColorName = 'cyan' | 'yellow' | 'purple' | 'green' | 'red' | 'blue' | 'orange';

export interface BlockDef {
  id: string;
  shape: BlockShape;
  color: BlockColorName;
}

export const BLOCKS: Record<string, BlockDef> = {
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

export const getRandomBlocks = (count: number = 3): (BlockDef | null)[] => {
  const keys = Object.keys(BLOCKS);
  const selected: (BlockDef | null)[] = [];
  for (let i = 0; i < count; i++) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    selected.push(BLOCKS[randomKey]);
  }
  return selected;
};
