/**
 * Breadth-First Search (BFS) Algorithm Implementation
 * 
 * BFS explores nodes level by level, making it optimal for finding the shortest
 * path in unweighted graphs. It visits all nodes at distance k before any nodes
 * at distance k+1, guaranteeing the shortest path when found.
 * 
 * Time Complexity: O(V + E) where V = vertices, E = edges
 * Space Complexity: O(V) for the queue and visited tracking
 * 
 * Key Difference from Dijkstra:
 * - BFS uses a simple FIFO queue (O(1) operations)
 * - Dijkstra uses a priority queue (O(log V) operations)
 * - Both find shortest paths in unweighted graphs, but Dijkstra generalizes to weighted
 */

import { NodeType } from '@/types/Node';

/**
 * Main BFS function
 * 
 * @param grid - 2D array of nodes representing the search space
 * @param startNode - The starting node for the search
 * @param endNode - The target/destination node
 * @returns Array of nodes in the order they were visited
 * 
 * Algorithm Overview:
 * 1. Initialize queue with start node
 * 2. While queue is not empty:
 *    a. Dequeue front node
 *    b. If it's the target, we're done
 *    c. Enqueue all unvisited neighbors
 * 3. First time we reach target is guaranteed shortest path
 */
export const bfs = (
  grid: NodeType[][],
  startNode: NodeType,
  endNode: NodeType
): NodeType[] => {
  const visitedNodesInOrder: NodeType[] = [];
  
  // FIFO queue for BFS traversal
  // Using array with shift() - in production, consider a proper queue implementation
  const queue: NodeType[] = [];

  // Initialize start node
  startNode.isVisited = true;
  startNode.distance = 0;
  queue.push(startNode);

  // Main BFS loop
  while (queue.length) {
    // Dequeue the front node (FIFO order ensures level-by-level exploration)
    const currentNode = queue.shift()!;
    visitedNodesInOrder.push(currentNode);

    // Early termination: found the target
    // Because BFS explores level-by-level, this is guaranteed shortest path
    if (currentNode === endNode) return visitedNodesInOrder;

    // Get all unvisited, non-wall neighbors
    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    
    // Process each neighbor
    for (const neighbor of neighbors) {
      // Mark as visited immediately to prevent re-queuing
      // This is key to BFS correctness and efficiency
      neighbor.isVisited = true;
      
      // Track distance (number of edges from start)
      neighbor.distance = currentNode.distance + 1;
      
      // Store parent for path reconstruction
      neighbor.previousNode = currentNode;
      
      // Add to queue for future processing
      queue.push(neighbor);
    }
  }

  // Queue empty = no path exists (all reachable nodes explored)
  return visitedNodesInOrder;
};

/**
 * Get all unvisited, non-wall neighbors of a node
 * 
 * Checks 4 orthogonal directions (up, down, left, right).
 * Unlike Dijkstra's version, this also filters out walls immediately.
 * 
 * @param node - The node to find neighbors for
 * @param grid - The full grid of nodes
 * @returns Array of valid, unvisited neighbor nodes
 */
const getUnvisitedNeighbors = (node: NodeType, grid: NodeType[][]): NodeType[] => {
  const neighbors: NodeType[] = [];
  const { row, col } = node;

  // Check all four cardinal directions
  // Order: Up, Down, Left, Right (order affects visual animation pattern)
  if (row > 0) neighbors.push(grid[row - 1][col]);               // Up
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
  if (col > 0) neighbors.push(grid[row][col - 1]);               // Left
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right

  // Filter out already visited nodes AND walls
  // Walls are impassable terrain in our pathfinding context
  return neighbors.filter((neighbor) => !neighbor.isVisited && !neighbor.isWall);
};

/**
 * Reconstruct the shortest path from end to start
 * 
 * Follows the previousNode chain backwards to build the path.
 * Identical to Dijkstra's path reconstruction since both algorithms
 * store parent pointers the same way.
 * 
 * @param endNode - The destination node
 * @returns Array of nodes forming the path (start to end order)
 */
export const getNodesInShortestPathOrder = (endNode: NodeType): NodeType[] => {
  const nodesInShortestPathOrder: NodeType[] = [];
  let currentNode: NodeType | null = endNode;

  // Backtrack from end to start using previousNode pointers
  while (currentNode !== null) {
    // unshift adds to front, reversing the order from end-to-start to start-to-end
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
};