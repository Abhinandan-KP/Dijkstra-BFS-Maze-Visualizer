import { NodeType } from '@/types/Node';

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

  // Ensure start and end are not walls
  newGrid[startNode.row][startNode.col].isStart = true;
  newGrid[endNode.row][endNode.col].isEnd = true;

  return newGrid;
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

  // Add border walls
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
      recursiveDivision(
        grid,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        'horizontal',
        wallsInOrder,
        startNode,
        endNode
      );
    } else {
      recursiveDivision(
        grid,
        rowStart,
        currentRow - 2,
        colStart,
        colEnd,
        'vertical',
        wallsInOrder,
        startNode,
        endNode
      );
    }

    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivision(
        grid,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        'horizontal',
        wallsInOrder,
        startNode,
        endNode
      );
    } else {
      recursiveDivision(
        grid,
        currentRow + 2,
        rowEnd,
        colStart,
        colEnd,
        'vertical',
        wallsInOrder,
        startNode,
        endNode
      );
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
      recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        'horizontal',
        wallsInOrder,
        startNode,
        endNode
      );
    } else {
      recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        colStart,
        currentCol - 2,
        'vertical',
        wallsInOrder,
        startNode,
        endNode
      );
    }

    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        'horizontal',
        wallsInOrder,
        startNode,
        endNode
      );
    } else {
      recursiveDivision(
        grid,
        rowStart,
        rowEnd,
        currentCol + 2,
        colEnd,
        'vertical',
        wallsInOrder,
        startNode,
        endNode
      );
    }
  }
};
