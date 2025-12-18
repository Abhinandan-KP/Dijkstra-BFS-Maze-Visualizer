import { useState, useCallback, useEffect } from 'react';
import GridNode from './GridNode';
import { NodeType, createNode, resetNode } from '@/types/Node';
import { dijkstra, getNodesInShortestPathOrder } from '@/algorithms/dijkstra';
import { bfs, getNodesInShortestPathOrder as bfsGetPath } from '@/algorithms/bfs';
import { generateRandomMaze } from '@/algorithms/maze';

const GRID_ROWS = 20;
const GRID_COLS = 40;
const DEFAULT_START = { row: 10, col: 5 };
const DEFAULT_END = { row: 10, col: 35 };

interface GridProps {
  algorithm: string;
  speed: number;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  onStats: (visited: number, pathLength: number) => void;
  triggerVisualize: boolean;
  triggerClear: boolean;
  triggerReset: boolean;
  triggerMaze: boolean;
  onActionComplete: () => void;
}

const Grid = ({
  algorithm,
  speed,
  isRunning,
  setIsRunning,
  onStats,
  triggerVisualize,
  triggerClear,
  triggerReset,
  triggerMaze,
  onActionComplete,
}: GridProps) => {
  const [grid, setGrid] = useState<NodeType[][]>([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [movingNode, setMovingNode] = useState<'start' | 'end' | null>(null);
  const [startPos, setStartPos] = useState(DEFAULT_START);
  const [endPos, setEndPos] = useState(DEFAULT_END);

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: NodeType[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: NodeType[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        const node = createNode(row, col);
        if (row === startPos.row && col === startPos.col) {
          node.isStart = true;
        }
        if (row === endPos.row && col === endPos.col) {
          node.isEnd = true;
        }
        currentRow.push(node);
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
    onStats(0, 0);
  }, [startPos, endPos, onStats]);

  useEffect(() => {
    initializeGrid();
  }, []);

  // Handle visualize trigger
  useEffect(() => {
    if (triggerVisualize && !isRunning) {
      visualize();
      onActionComplete();
    }
  }, [triggerVisualize]);

  // Handle clear trigger
  useEffect(() => {
    if (triggerClear && !isRunning) {
      setStartPos(DEFAULT_START);
      setEndPos(DEFAULT_END);
      const newGrid: NodeType[][] = [];
      for (let row = 0; row < GRID_ROWS; row++) {
        const currentRow: NodeType[] = [];
        for (let col = 0; col < GRID_COLS; col++) {
          const node = createNode(row, col);
          if (row === DEFAULT_START.row && col === DEFAULT_START.col) {
            node.isStart = true;
          }
          if (row === DEFAULT_END.row && col === DEFAULT_END.col) {
            node.isEnd = true;
          }
          currentRow.push(node);
        }
        newGrid.push(currentRow);
      }
      setGrid(newGrid);
      onStats(0, 0);
      onActionComplete();
    }
  }, [triggerClear, onStats, onActionComplete, isRunning]);

  // Handle reset trigger
  useEffect(() => {
    if (triggerReset && !isRunning) {
      resetGrid();
      onActionComplete();
    }
  }, [triggerReset]);

  // Handle maze trigger
  useEffect(() => {
    if (triggerMaze && !isRunning) {
      const newGrid = generateRandomMaze(grid, startPos, endPos);
      setGrid(newGrid);
      onStats(0, 0);
      onActionComplete();
    }
  }, [triggerMaze]);

  const resetGrid = useCallback(() => {
    const newGrid = grid.map((row) =>
      row.map((node) => {
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          element.className = element.className
            .replace('node-visited-animation', '')
            .replace('node-path-animation', '');
        }
        return resetNode(node);
      })
    );
    setGrid(newGrid);
    onStats(0, 0);
  }, [grid, onStats]);

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;

    const node = grid[row][col];
    if (node.isStart) {
      setMovingNode('start');
    } else if (node.isEnd) {
      setMovingNode('end');
    } else {
      const newGrid = toggleWall(grid, row, col);
      setGrid(newGrid);
    }
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isRunning) return;

    if (movingNode === 'start') {
      moveStartNode(row, col);
    } else if (movingNode === 'end') {
      moveEndNode(row, col);
    } else {
      const node = grid[row][col];
      if (!node.isStart && !node.isEnd) {
        const newGrid = toggleWall(grid, row, col);
        setGrid(newGrid);
      }
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setMovingNode(null);
  };

  const moveStartNode = (row: number, col: number) => {
    if (grid[row][col].isEnd || grid[row][col].isWall) return;

    const newGrid = grid.map((r) =>
      r.map((node) => ({
        ...node,
        isStart: node.row === row && node.col === col,
      }))
    );
    setGrid(newGrid);
    setStartPos({ row, col });
  };

  const moveEndNode = (row: number, col: number) => {
    if (grid[row][col].isStart || grid[row][col].isWall) return;

    const newGrid = grid.map((r) =>
      r.map((node) => ({
        ...node,
        isEnd: node.row === row && node.col === col,
      }))
    );
    setGrid(newGrid);
    setEndPos({ row, col });
  };

  const toggleWall = (grid: NodeType[][], row: number, col: number): NodeType[][] => {
    const newGrid = grid.map((r) =>
      r.map((node) => {
        if (node.row === row && node.col === col) {
          return { ...node, isWall: !node.isWall };
        }
        return node;
      })
    );
    return newGrid;
  };

  const visualize = async () => {
    resetGrid();
    setIsRunning(true);

    // Create a fresh grid for the algorithm
    const newGrid = grid.map((row) =>
      row.map((node) => resetNode(node))
    );

    const startNode = newGrid[startPos.row][startPos.col];
    const endNode = newGrid[endPos.row][endPos.col];

    let visitedNodesInOrder: NodeType[];
    let nodesInShortestPathOrder: NodeType[];

    if (algorithm === 'dijkstra') {
      visitedNodesInOrder = dijkstra(newGrid, startNode, endNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    } else {
      visitedNodesInOrder = bfs(newGrid, startNode, endNode);
      nodesInShortestPathOrder = bfsGetPath(endNode);
    }

    const animationSpeed = Math.max(1, 101 - speed);

    await animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, animationSpeed);

    onStats(visitedNodesInOrder.length, nodesInShortestPathOrder.length);
    setIsRunning(false);
  };

  const animateAlgorithm = async (
    visitedNodesInOrder: NodeType[],
    nodesInShortestPathOrder: NodeType[],
    speed: number
  ) => {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, speed));
      const node = visitedNodesInOrder[i];
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      if (element && !node.isStart && !node.isEnd) {
        element.classList.add('node-visited-animation');
      }
    }

    await new Promise((resolve) => setTimeout(resolve, speed * 5));

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, speed * 3));
      const node = nodesInShortestPathOrder[i];
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      if (element && !node.isStart && !node.isEnd) {
        element.classList.remove('node-visited-animation');
        element.classList.add('node-path-animation');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
      <div
        className="grid gap-0 bg-background/50 rounded-lg p-4 shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
        }}
        onMouseLeave={() => setMouseIsPressed(false)}
      >
        {grid.map((row, rowIndex) =>
          row.map((node, colIndex) => (
            <GridNode
              key={`${rowIndex}-${colIndex}`}
              node={node}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
