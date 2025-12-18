/**
 * Dijkstra's Algorithm Implementation
 * * Dijkstra's algorithm finds the shortest path from a source node to all other
 * nodes in a weighted graph. By respecting the 'weight' property, it can find 
 * a "longer" path that is actually "cheaper" to traverse.
 */

import { NodeType } from '@/types/Node';

/**
 * Main Dijkstra's algorithm function
 */
export const dijkstra = (
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType
): NodeType[] => {
  const visitedNodesInOrder: NodeType[] = [];
  
  // Initialize start node distance to 0
  startNode.distance = 0;
  
  // Get all nodes as our "unvisited set"
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    
    const closestNode = unvisitedNodes.shift()!;

    // Skip wall nodes
    if (closestNode.isWall) continue;
    
    // If the closest node has infinite distance, we're trapped
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Early termination: found the target
    if (closestNode === endNode) return visitedNodesInOrder;

    // Relaxation step: updated to respect weights
    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
};

const sortNodesByDistance = (unvisitedNodes: NodeType[]) => {
  unvisitedNodes.sort((a, b) => a.distance - b.distance);
};

/**
 * Relaxation step: Update distances based on node weights
 */
const updateUnvisitedNeighbors = (node: NodeType, grid: NodeType[][]) => {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    // UPDATED LOGIC:
    // If the neighbor is a "weight" node, it costs more to enter (e.g., 5).
    // Otherwise, it costs the standard 1.
    const weightValue = neighbor.isWeight ? (neighbor.weight || 5) : 1;
    
    const newDistance = node.distance + weightValue;
    
    // If we found a cheaper way to get to this neighbor, update it
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.previousNode = node;
    }
  }
};

/**
 * Get all unvisited neighbors (4-directional)
 */
const getUnvisitedNeighbors = (node: NodeType, grid: NodeType[][]): NodeType[] => {
  const neighbors: NodeType[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);           // Up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]);           // Left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right

  return neighbors.filter((neighbor) => !neighbor.isVisited);
};

const getAllNodes = (grid: NodeType[][]): NodeType[] => {
  const nodes: NodeType[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

/**
 * Reconstruct shortest path
 */
export const getNodesInShortestPathOrder = (endNode: NodeType): NodeType[] => {
  const nodesInShortestPathOrder: NodeType[] = [];
  let currentNode: NodeType | null = endNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
};
