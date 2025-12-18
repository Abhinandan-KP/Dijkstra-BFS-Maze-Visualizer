export interface NodeType {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
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
  distance: Infinity,
  previousNode: null,
});

export const resetNode = (node: NodeType): NodeType => ({
  ...node,
  isVisited: false,
  isPath: false,
  distance: Infinity,
  previousNode: null,
});
