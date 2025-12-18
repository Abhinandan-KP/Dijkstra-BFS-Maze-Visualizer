Dijkstra & BFS Maze Visualizer
Project Info
This repository contains a web-based tool designed to visualize how pathfinding algorithms work in real-time. Built with React and TypeScript, this project helps students and developers understand the step-by-step execution of Dijkstra’s Algorithm and Breadth-First Search (BFS) within a customizable maze environment.

How to Edit and Run This Project
You can work on this project locally using your own system and IDE.

Prerequisites
Make sure you have the following installed:

Node.js (v18 or higher)

npm (comes with Node.js)

Steps to Run Locally
Bash

# Step 1: Clone the repository
git clone https://github.com/yourusername/dijkstra-bfs-visualizer.git

# Step 2: Go to the project folder
cd dijkstra-bfs-visualizer

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
After running the above commands, the project will start on http://localhost:5173 (standard Vite port), and you can view it in your browser.

Editing the Code
You can edit the project in multiple ways:

Using Your IDE (Recommended): Open the project folder in VS Code, make changes to the logic in src/algorithms/, and save to see instant updates via Hot Module Replacement.

Using GitHub Codespaces: Click the Code button on the GitHub repo, select Codespaces, and create a new environment to edit directly in your browser.

Technologies Used
This project is built using a modern tech stack:

React – For building the interactive grid UI.

TypeScript – To ensure type safety in algorithm logic.

Vite – For a lightning-fast development environment.

Tailwind CSS – For styling the maze components and buttons.

shadcn/ui – For high-quality, accessible UI components like sliders and dropdowns.

Key Features
Interactive Grid: Click and drag to draw walls/obstacles.

Algorithm Selection: Choose between Dijkstra (weighted) and BFS (unweighted).

Speed Control: Adjust the visualization speed to see the "frontier" expansion clearly.

Responsive Design: Works on desktops and tablets.

Deployment
To host this project online:

Build the project:

Bash

npm run build
Upload the dist folder to Vercel, Netlify, or GitHub Pages.

Purpose of This Project
Visualize data structures and algorithms (DSA) in a GUI format.

Practice implementing graph traversal logic in TypeScript.

Understand the difference between greedy search (Dijkstra) and level-order traversal (BFS).
