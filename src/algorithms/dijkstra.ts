/**
 * Dijkstra's Algorithm Implementation
 * 
 * Dijkstra's algorithm finds the shortest path from a source node to all other
 * nodes in a weighted graph. In this grid-based implementation, all edges have
 * equal weight (1), making it equivalent to BFS but demonstrating the general
 * Dijkstra approach with priority queue concepts.
 * 
 * Time Complexity: O((V + E) log V) with a proper priority queue
 *                  O(V²) with simple array (as implemented here for clarity)
 * Space Complexity: O(V) for storing distances and previous nodes
 * 
 * Where V = number of vertices (grid cells) and E = number of edges (connections)
 */

import { NodeType } from '@/types/Node';

/**
 * Main Dijkstra's algorithm function
 * 
 * @param grid - 2D array of nodes representing the search space
 * @param startNode - The starting node for the search
 * @param endNode - The target/destination node
 * @returns Array of nodes in the order they were visited
 * 
 * Algorithm Overview:
 * 1. Initialize all distances to infinity except start (0)
 * 2. Maintain a set of unvisited nodes
 * 3. While unvisited nodes exist:
 *    a. Select the unvisited node with minimum distance (greedy choice)
 *    b. Mark it as visited
 *    c. Update distances to all unvisited neighbors
 * 4. Continue until we reach the end node or exhaust all reachable nodes
 */
export const dijkstra = (
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType
): NodeType[] => {
  const visitedNodesInOrder: NodeType[] = [];
  
  // Initialize start node distance to 0 (key step for Dijkstra)
  startNode.distance = 0;
  
  // Get all nodes as our "unvisited set"
  // In a production implementation, this would be a min-heap/priority queue
  const unvisitedNodes = getAllNodes(grid);

  // Main loop: process nodes until none remain or we hit a wall
  while (unvisitedNodes.length) {
    // Sort to find minimum distance node (simulates priority queue extraction)
    // This is O(V log V) per iteration - could be optimized with proper heap
    sortNodesByDistance(unvisitedNodes);
    
    // Extract the node with smallest distance (greedy selection)
    const closestNode = unvisitedNodes.shift()!;

    // Skip wall nodes - they're impassable
    if (closestNode.isWall) continue;
    
    // If the closest node has infinite distance, we're trapped
    // This means remaining nodes are unreachable from start
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    // Mark node as visited and record it
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Early termination: found the target
    if (closestNode === endNode) return visitedNodesInOrder;

    // Relaxation step: update distances to neighbors
    // This is the core of Dijkstra - potentially shorter paths through current node
    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
};

/**
 * Sort nodes by their distance (simulates priority queue)
 * 
 * In a real-world implementation, you'd use a min-heap for O(log V) operations
 * instead of O(V log V) sorting. This array-based approach is used for clarity.
 */
const sortNodesByDistance = (unvisitedNodes: NodeType[]) => {
  unvisitedNodes.sort((a, b) => a.distance - b.distance);
};

/**
 * Relaxation step: Update distances to unvisited neighbors
 * 
 * For each neighbor of the current node:
 * - Calculate potential new distance (current distance + edge weight)
 * - If new distance is shorter, update neighbor's distance and previous pointer
 * 
 * In this grid implementation, all edges have weight 1.
 * The previousNode pointer enables path reconstruction later.
 */
const updateUnvisitedNeighbors = (node: NodeType, grid: NodeType[][]) => {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    // New distance = current node's distance + 1 (edge weight)
    // Since all edges have weight 1, this is always an improvement for unvisited nodes
    neighbor.distance = node.distance + 1;
    
    // Track the path for reconstruction
    neighbor.previousNode = node;
  }
};

/**
 * Get all unvisited neighbors of a node (4-directional: up, down, left, right)
 * 
 * This determines the graph connectivity - each cell connects to its
 * orthogonal neighbors (not diagonals in this implementation).
 */
const getUnvisitedNeighbors = (node: NodeType, grid: NodeType[][]): NodeType[] => {
  const neighbors: NodeType[] = [];
  const { row, col } = node;

  // Check all four directions (could be extended to 8 for diagonal movement)
  if (row > 0) neighbors.push(grid[row - 1][col]);           // Up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]);           // Left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right

  // Only return unvisited neighbors (already visited = already optimal path found)
  return neighbors.filter((neighbor) => !neighbor.isVisited);
};

/**
 * Flatten the 2D grid into a 1D array of all nodes
 * Used to initialize the unvisited set
 */
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
 * Reconstruct the shortest path by backtracking from end to start
 * 
 * Uses the previousNode pointers set during the algorithm to trace
 * the optimal path from destination back to source.
 * 
 * @param endNode - The destination node to start backtracking from
 * @returns Array of nodes forming the shortest path (start to end order)
 */
export const getNodesInShortestPathOrder = (endNode: NodeType): NodeType[] => {
  const nodesInShortestPathOrder: NodeType[] = [];
  let currentNode: NodeType | null = endNode;

  // Walk backwards through previousNode pointers until we reach start
  // (start node has previousNode = null)
  while (currentNode !== null) {
    // Add to front of array to maintain start-to-end order
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
};