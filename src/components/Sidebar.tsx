import { Clock, Database, Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AlgorithmInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  details: string[];
}

const algorithms: Record<string, AlgorithmInfo> = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description:
      "Dijkstra's algorithm finds the shortest path from a source to all vertices in a weighted graph.",
    details: [
      'Guarantees the shortest path',
      'Uses a priority queue (min-heap)',
      'Works with weighted graphs',
      'Cannot handle negative weights',
    ],
  },
  bfs: {
    name: 'Breadth-First Search',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description:
      'BFS explores nodes level by level, finding the shortest path in unweighted graphs.',
    details: [
      'Optimal for unweighted graphs',
      'Uses a queue (FIFO)',
      'Explores all neighbors first',
      'Great for shortest path problems',
    ],
  },
};

interface SidebarProps {
  currentAlgorithm: string;
  isRunning: boolean;
  visitedCount: number;
  pathLength: number;
}

const Sidebar = ({ currentAlgorithm, isRunning, visitedCount, pathLength }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const algo = algorithms[currentAlgorithm];

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto animate-slide-in-left">
      <div className="p-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AlgoLens</h1>
            <p className="text-xs text-muted-foreground">Pathfinding Visualizer</p>
          </div>
        </div>

        {/* Current Algorithm */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Current Algorithm
          </h2>
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">{algo.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{algo.description}</p>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3"
          >
            <span>Complexity Analysis</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="space-y-3">
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Time Complexity</span>
                </div>
                <code className="text-lg font-mono text-primary font-semibold">
                  {algo.timeComplexity}
                </code>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Space Complexity</span>
                </div>
                <code className="text-lg font-mono text-accent font-semibold">
                  {algo.spaceComplexity}
                </code>
              </div>
            </div>

            {/* Key Points */}
            <div className="mt-4 bg-secondary/30 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Key Points</span>
              </div>
              <ul className="space-y-2">
                {algo.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Statistics
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <p className="text-2xl font-bold font-mono text-primary">{visitedCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Nodes Visited</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 border border-border text-center">
              <p className="text-2xl font-bold font-mono text-accent">{pathLength}</p>
              <p className="text-xs text-muted-foreground mt-1">Path Length</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Legend
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-node-start glow-success" />
              <span className="text-sm text-muted-foreground">Start Node</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-node-end glow-danger" />
              <span className="text-sm text-muted-foreground">End Node</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-node-wall" />
              <span className="text-sm text-muted-foreground">Wall</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-node-visited" />
              <span className="text-sm text-muted-foreground">Visited</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-node-path" />
              <span className="text-sm text-muted-foreground">Shortest Path</span>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {isRunning && (
          <div className="mt-6 bg-primary/10 rounded-lg p-4 border border-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Visualizing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
