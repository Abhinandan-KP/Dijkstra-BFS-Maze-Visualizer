import { NodeType, createNode } from '@/types/Node';

export const generateRandomMaze = (
  grid: NodeType[][],
  startNode: { row: number; col: number },
  endNode: { row: number; col: number }
): NodeType[][] => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: false,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      previousNode: null,
    }))
  );

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (
        (row === startNode.row && col === startNode.col) ||
        (row === endNode.row && col === endNode.col)
      ) {
        continue;
      }

      if (Math.random() < 0.3) {
        newGrid[row][col].isWall = true;
      }
    }
  }

  newGrid[startNode.row][startNode.col].isStart = true;
  newGrid[endNode.row][endNode.col].isEnd = true;

  return newGrid;
};

export const generateRecursiveBacktrackerMaze = (
  rows: number,
  cols: number,
  startNode: { row: number; col: number },
  endNode: { row: number; col: number }
): NodeType[][] => {
  const newGrid: NodeType[][] = [];
  for (let row = 0; row < rows; row++) {
    const currentRow: NodeType[] = [];
    for (let col = 0; col < cols; col++) {
      const node = createNode(row, col);
      node.isWall = true;
      currentRow.push(node);
    }
    newGrid.push(currentRow);
  }

  const visited: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));

  const stack: { row: number; col: number }[] = [];

  const startR = 1;
  const startC = 1;
  
  newGrid[startR][startC].isWall = false;
  visited[startR][startC] = true;
  stack.push({ row: startR, col: startC });

  const directions = [
    { dr: -2, dc: 0 },
    { dr: 2, dc: 0 },
    { dr: 0, dc: -2 },
    { dr: 0, dc: 2 },
  ];

  const getUnvisitedNeighbors = (row: number, col: number) => {
    const neighbors: { row: number; col: number; wallRow: number; wallCol: number }[] = [];
    
    for (const { dr, dc } of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const wallRow = row + dr / 2;
      const wallCol = col + dc / 2;

      if (
        newRow > 0 &&
        newRow < rows - 1 &&
        newCol > 0 &&
        newCol < cols - 1 &&
        !visited[newRow][newCol]
      ) {
        neighbors.push({ row: newRow, col: newCol, wallRow, wallCol });
      }
    }

    return neighbors;
  };

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current.row, current.col);

    if (neighbors.length > 0) {
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      const chosen = neighbors[randomIndex];

      newGrid[chosen.wallRow][chosen.wallCol].isWall = false;
      newGrid[chosen.row][chosen.col].isWall = false;
      visited[chosen.row][chosen.col] = true;

      stack.push({ row: chosen.row, col: chosen.col });
    } else {
      stack.pop();
    }
  }

  clearAreaAround(newGrid, startNode.row, startNode.col, rows, cols);
  clearAreaAround(newGrid, endNode.row, endNode.col, rows, cols);

  newGrid[startNode.row][startNode.col].isWall = false;
  newGrid[startNode.row][startNode.col].isStart = true;
  newGrid[endNode.row][endNode.col].isWall = false;
  newGrid[endNode.row][endNode.col].isEnd = true;

  connectToMaze(newGrid, startNode.row, startNode.col, rows, cols);
  connectToMaze(newGrid, endNode.row, endNode.col, rows, cols);

  return newGrid;
};

const clearAreaAround = (
  grid: NodeType[][],
  row: number,
  col: number,
  rows: number,
  cols: number
) => {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        grid[newRow][newCol].isWall = false;
      }
    }
  }
};

const connectToMaze = (
  grid: NodeType[][],
  row: number,
  col: number,
  rows: number,
  cols: number
) => {
  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
  
  for (const { dr, dc } of shuffledDirs) {
    let currentRow = row + dr;
    let currentCol = col + dc;
    
    while (
      currentRow > 0 &&
      currentRow < rows - 1 &&
      currentCol > 0 &&
      currentCol < cols - 1
    ) {
      if (!grid[currentRow][currentCol].isWall) {
        return;
      }
      grid[currentRow][currentCol].isWall = false;
      currentRow += dr;
      currentCol += dc;
    }
  }
};

export const generateRecursiveMaze = (
  grid: NodeType[][],
  startNode: { row: number; col: number },
  endNode: { row: number; col: number }
): { grid: NodeType[][]; wallsInOrder: [number, number][] } => {
  const newGrid = grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: false,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      previousNode: null,
    }))
  );

  const wallsInOrder: [number, number][] = [];
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
        if (
          !(row === startNode.row && col === startNode.col) &&
          !(row === endNode.row && col === endNode.col)
        ) {
          wallsInOrder.push([row, col]);
        }
      }
    }
  }

  recursiveDivision(
    newGrid,
    1,
    rows - 2,
    1,
    cols - 2,
    'horizontal',
    wallsInOrder,
    startNode,
    endNode
  );

  newGrid[startNode.row][startNode.col].isStart = true;
  newGrid[endNode.row][endNode.col].isEnd = true;

  return { grid: newGrid, wallsInOrder };
};

const recursiveDivision = (
  grid: NodeType[][],
  rowStart: number,
  rowEnd: number,
  colStart: number,
  colEnd: number,
  orientation: 'horizontal' | 'vertical',
  wallsInOrder: [number, number][],
  startNode: { row: number; col: number },
  endNode: { row: number; col: number }
) => {
  if (rowEnd < rowStart || colEnd < colStart) return;

  if (orientation === 'horizontal') {
    const possibleRows: number[] = [];
    for (let row = rowStart; row <= rowEnd; row += 2) {
      possibleRows.push(row);
    }
    if (possibleRows.length === 0) return;

    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentRow = possibleRows[randomRowIndex];

    const possibleCols: number[] = [];
    for (let col = colStart - 1; col <= colEnd + 1; col += 2) {
      possibleCols.push(col);
    }
    if (possibleCols.length === 0) return;

    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const randomCol = possibleCols[randomColIndex];

    for (let col = colStart - 1; col <= colEnd + 1; col++) {
      if (col === randomCol) continue;
      if (
        (currentRow === startNode.row && col === startNode.col) ||
        (currentRow === endNode.row && col === endNode.col)
      )
        continue;
      wallsInOrder.push([currentRow, col]);
    }

    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivision(grid, rowStart, currentRow - 2, colStart, colEnd, 'horizontal', wallsInOrder, startNode, endNode);
    } else {
      recursiveDivision(grid, rowStart, currentRow - 2, colStart, colEnd, 'vertical', wallsInOrder, startNode, endNode);
    }

    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivision(grid, currentRow + 2, rowEnd, colStart, colEnd, 'horizontal', wallsInOrder, startNode, endNode);
    } else {
      recursiveDivision(grid, currentRow + 2, rowEnd, colStart, colEnd, 'vertical', wallsInOrder, startNode, endNode);
    }
  } else {
    const possibleCols: number[] = [];
    for (let col = colStart; col <= colEnd; col += 2) {
      possibleCols.push(col);
    }
    if (possibleCols.length === 0) return;

    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentCol = possibleCols[randomColIndex];

    const possibleRows: number[] = [];
    for (let row = rowStart - 1; row <= rowEnd + 1; row += 2) {
      possibleRows.push(row);
    }
    if (possibleRows.length === 0) return;

    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomRow = possibleRows[randomRowIndex];

    for (let row = rowStart - 1; row <= rowEnd + 1; row++) {
      if (row === randomRow) continue;
      if (
        (row === startNode.row && currentCol === startNode.col) ||
        (row === endNode.row && currentCol === endNode.col)
      )
        continue;
      wallsInOrder.push([row, currentCol]);
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivision(grid, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal', wallsInOrder, startNode, endNode);
    } else {
      recursiveDivision(grid, rowStart, rowEnd, colStart, currentCol - 2, 'vertical', wallsInOrder, startNode, endNode);
    }

    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivision(grid, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal', wallsInOrder, startNode, endNode);
    } else {
      recursiveDivision(grid, rowStart, rowEnd, currentCol + 2, colEnd, 'vertical', wallsInOrder, startNode, endNode);
    }
  }
};
