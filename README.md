🚀 Dijkstra & BFS Maze Visualizer

A high-performance web tool designed to demystify how pathfinding algorithms navigate complex environments. Built with React and TypeScript, it provides a real-time, step-by-step visualization of Dijkstra’s Algorithm and Breadth-First Search (BFS).

Whether you are a student mastering Data Structures & Algorithms (DSA) or a developer exploring graph traversal logic, this visualizer offers an interactive way to observe how the frontier expands and how the shortest path is discovered.

✨ Key Features

Interactive Maze Creator
Click and drag directly on the grid to draw walls and obstacles in real time.

Algorithm Toggle
Seamlessly switch between Dijkstra (weighted pathfinding) and BFS (unweighted level-order traversal).

Dynamic Speed Control
Adjust visualization speed to analyze each node expansion or instantly view the final path.

Responsive UI
Optimized for desktops and tablets using Tailwind CSS and shadcn/ui.

🛠️ Built With

React + Vite — Lightning-fast development environment and reactive UI

TypeScript — Type-safe, robust implementations of complex algorithms

Tailwind CSS — Utility-first styling for a clean, modern interface

shadcn/ui — Accessible, high-quality UI components

🚀 Quick Start

Follow these steps to run the visualizer locally:

1️⃣ Clone the repository
git clone https://github.com/Abhinandan-KP/dijkstra-bfs-visualizer.git

2️⃣ Install dependencies
cd dijkstra-bfs-visualizer
npm install

3️⃣ Start the development server
npm run dev



📂 Project Structure
src/
├── algorithms/   # Core logic for Dijkstra and BFS
├── components/   # Grid, nodes, controls, and UI elements
├── hooks/        # Custom hooks for grid state & animations

💡 Purpose of the Project

This project bridges the gap between theoretical graph algorithms and visual execution, helping users understand:

The difference between Greedy Search (Dijkstra) and Level-Order Traversal (BFS)

How obstacles and weights affect shortest-path calculations

How to implement graph algorithms cleanly in a modern TypeScript + React codebase

👤 Author

Handcrafted by Abhinandan
