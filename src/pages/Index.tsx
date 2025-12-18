import { useState, useCallback } from 'react';
import Grid from '@/components/Grid';
import Sidebar from '@/components/Sidebar';
import Controls from '@/components/Controls';

const Index = () => {
  const [algorithm, setAlgorithm] = useState('dijkstra');
  // ADDED: State to track if the graph is weighted or unweighted
  const [graphType, setGraphType] = useState<"weighted" | "unweighted" | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [visitedCount, setVisitedCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);

  // Trigger states
  const [triggerVisualize, setTriggerVisualize] = useState(false);
  const [triggerClear, setTriggerClear] = useState(false);
  const [triggerReset, setTriggerReset] = useState(false);
  const [triggerMaze, setTriggerMaze] = useState(false);

  const handleStats = useCallback((visited: number, path: number) => {
    setVisitedCount(visited);
    setPathLength(path);
  }, []);

  const handleActionComplete = useCallback(() => {
    setTriggerVisualize(false);
    setTriggerClear(false);
    setTriggerReset(false);
    setTriggerMaze(false);
  }, []);

  // ADDED: Logic to check if user can visualize
  const handleVisualizeClick = () => {
    if (algorithm === "dijkstra" && !graphType) {
      alert("Please select Weighted or Unweighted first!");
      return;
    }
    setTriggerVisualize(true);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar
        currentAlgorithm={algorithm}
        isRunning={isRunning}
        visitedCount={visitedCount}
        pathLength={pathLength}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Controls */}
        <Controls
          algorithm={algorithm}
          graphType={graphType} // Passing the state down
          setGraphType={setGraphType} // Passing the setter down
          onAlgorithmChange={(algo) => {
            setAlgorithm(algo);
            // BFS is always unweighted, so we set it automatically
            if (algo === "bfs") {
              setGraphType("unweighted");
            } else {
              setGraphType(null); // Force user to choose for Dijkstra
            }
          }}
          onVisualize={handleVisualizeClick} // Using our check function
          onClear={() => setTriggerClear(true)}
          onReset={() => setTriggerReset(true)}
          onGenerateMaze={() => setTriggerMaze(true)}
          isRunning={isRunning}
          speed={speed}
          onSpeedChange={(val) => setSpeed(val[0])}
        />

        {/* Grid */}
        <Grid
          algorithm={algorithm}
          graphType={graphType} // Pass this to Grid so it knows how to run Dijkstra
          speed={speed}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          onStats={handleStats}
          triggerVisualize={triggerVisualize}
          triggerClear={triggerClear}
          triggerReset={triggerReset}
          triggerMaze={triggerMaze}
          onActionComplete={handleActionComplete}
        />
      </div>
    </div>
  );
};

export default Index;
