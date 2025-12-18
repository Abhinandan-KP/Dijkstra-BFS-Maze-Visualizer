export interface NodeType {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  // ADDED: properties to handle weights
  isWeight: boolean; 
  weight: number;    
  distance: number;
  previousNode: NodeType | null;
}

export const createNode = (row: number, col: number): NodeType => ({
  row,
  col,
  isStart: false,
  isEnd: false,
  isWall: false,
  isVisited: false,
  isPath: false,
  // ADDED: default values for new nodes
  isWeight: false,
  weight: 1, // Default weight is 1 (normal cost)
  distance: Infinity,
  previousNode: null,
});

export const resetNode = (node: NodeType): NodeType => ({
  ...node,
  isVisited: false,
  isPath: false,
  distance: Infinity,
  previousNode: null,
  // Note: We do NOT reset isWeight or weight here 
  // so that the weights stay on the grid after the animation finishes.
});
