/**
 * Maze Generation Algorithms
 * 
 * This module provides various maze generation algorithms for the pathfinding visualizer.
 * The primary algorithm is the Recursive Backtracker (randomized DFS) which creates
 * more interesting and challenging mazes compared to random wall placement.
 */

import { NodeType, createNode } from '@/types/Node';

/**
 * Simple random maze generator - places walls randomly with 30% probability.
 * Creates sparse, easy-to-solve mazes.
 */
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

/**
 * Recursive Backtracker Maze Generator (Randomized DFS)
 * 
 * This algorithm creates a "perfect" maze (one with exactly one path between
 * any two points) using depth-first search with random neighbor selection.
 * 
 * Algorithm steps:
 * 1. Start with a grid full of walls
 * 2. Choose a random starting cell and mark it as a passage
 * 3. While there are unvisited cells:
 *    a. If the current cell has unvisited neighbors:
 *       - Choose a random unvisited neighbor
 *       - Remove the wall between current and neighbor
 *       - Push current cell to stack and move to neighbor
 *    b. Otherwise, backtrack by popping from stack
 * 
 * The result is a maze with long corridors and interesting dead ends.
 */
export const generateRecursiveBacktrackerMaze = (
  rows: number,
  cols: number,
  startNode: { row: number; col: number },
  endNode: { row: number; col: number }
): NodeType[][] => {
  // Initialize grid with all walls
  const newGrid: NodeType[][] = [];
  for (let row = 0; row < rows; row++) {
    const currentRow: NodeType[] = [];
    for (let col = 0; col < cols; col++) {
      const node = createNode(row, col);
      node.isWall = true; // Start with all walls
      currentRow.push(node);
    }
    newGrid.push(currentRow);
  }

  // Track which cells have been visited by the maze generator
  const visited: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));

  // Stack for backtracking
  const stack: { row: number; col: number }[] = [];

  // Start from cell (1, 1) to leave border walls
  const startR = 1;
  const startC = 1;
  
  // Mark starting cell as passage and visited
  newGrid[startR][startC].isWall = false;
  visited[startR][startC] = true;
  stack.push({ row: startR, col: startC });

  // Direction vectors for moving 2 cells at a time (to leave walls between passages)
  const directions = [
    { dr: -2, dc: 0 },  // Up
    { dr: 2, dc: 0 },   // Down
    { dr: 0, dc: -2 },  // Left
    { dr: 0, dc: 2 },   // Right
  ];

  /**
   * Get unvisited neighbors that are 2 cells away (maze cells, not wall cells)
   */
  const getUnvisitedNeighbors = (row: number, col: number) => {
    const neighbors: { row: number; col: number; wallRow: number; wallCol: number }[] = [];
    
    for (const { dr, dc } of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      const wallRow = row + dr / 2;
      const wallCol = col + dc / 2;

      // Check bounds (leave 1 cell border)
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

  // Main maze generation loop using iterative DFS
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current.row, current.col);

    if (neighbors.length > 0) {
      // Choose a random unvisited neighbor
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      const chosen = neighbors[randomIndex];

      // Remove wall between current cell and chosen neighbor
      newGrid[chosen.wallRow][chosen.wallCol].isWall = false;
      
      // Mark chosen cell as passage and visited
      newGrid[chosen.row][chosen.col].isWall = false;
      visited[chosen.row][chosen.col] = true;

      // Push chosen cell to stack
      stack.push({ row: chosen.row, col: chosen.col });
    } else {
      // Backtrack - no unvisited neighbors
      stack.pop();
    }
  }

  // Ensure start and end nodes are not walls and are accessible
  // Clear area around start node
  clearAreaAround(newGrid, startNode.row, startNode.col, rows, cols);
  // Clear area around end node
  clearAreaAround(newGrid, endNode.row, endNode.col, rows, cols);

  // Mark start and end nodes
  newGrid[startNode.row][startNode.col].isWall = false;
  newGrid[startNode.row][startNode.col].isStart = true;
  newGrid[endNode.row][endNode.col].isWall = false;
  newGrid[endNode.row][endNode.col].isEnd = true;

  // Create a path from start to nearest passage and end to nearest passage
  connectToMaze(newGrid, startNode.row, startNode.col, rows, cols);
  connectToMaze(newGrid, endNode.row, endNode.col, rows, cols);

  return newGrid;
};

/**
 * Clear a small area around a point to ensure accessibility
 */
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

/**
 * Connect a point to the main maze by carving a path to the nearest passage
 */
const connectToMaze = (
  grid: NodeType[][],
  row: number,
  col: number,
  rows: number,
  cols: number
) => {
  // Simple BFS to find nearest non-wall cell that's part of the maze
  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  // Carve a path in a random direction until we hit a passage
  const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
  
  for (const { dr, dc } of shuffledDirs) {
    let currentRow = row + dr;
    let currentCol = col + dc;
    
    // Keep carving in this direction until we hit a passage or boundary
    while (
      currentRow > 0 &&
      currentRow < rows - 1 &&
      currentCol > 0 &&
      currentCol < cols - 1
    ) {
      if (!grid[currentRow][currentCol].isWall) {
        // Found a passage, we're connected
        return;
      }
      grid[currentRow][currentCol].isWall = false;
      currentRow += dr;
      currentCol += dc;
    }
  }
};

/**
 * Recursive Division Maze Generator (Alternative algorithm)
 * Creates mazes by recursively dividing the space with walls
 */
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
