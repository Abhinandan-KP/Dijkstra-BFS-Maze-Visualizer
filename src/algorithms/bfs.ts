import { NodeType } from '@/types/Node';

export const bfs = (
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType
): NodeType[] => {
  const visitedNodesInOrder: NodeType[] = [];
  const queue: NodeType[] = [];

  startNode.isVisited = true;
  startNode.distance = 0;
  queue.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    
    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.distance = currentNode.distance + 1;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }

  return visitedNodesInOrder;
};

const getUnvisitedNeighbors = (node: NodeType, grid: NodeType[][]): NodeType[] => {
  const neighbors: NodeType[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited && !neighbor.isWall);
};

export const getNodesInShortestPathOrder = (endNode: NodeType): NodeType[] => {
  const nodesInShortestPathOrder: NodeType[] = [];
  let currentNode: NodeType | null = endNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
};
