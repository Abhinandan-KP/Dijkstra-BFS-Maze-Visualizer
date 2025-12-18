import { Play, Trash2, Grid3X3, RotateCcw, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface ControlsProps {
  algorithm: string;
  graphType: "weighted" | "unweighted" | null;
  setGraphType: (v: "weighted" | "unweighted") => void;
  onAlgorithmChange: (value: string) => void;
  onVisualize: () => void;
  onClear: () => void;
  onReset: () => void;
  onGenerateMaze: () => void;
  isRunning: boolean;
  speed: number;
  onSpeedChange: (value: number[]) => void;
}

const Controls = ({
  algorithm,
  graphType, // Added this
  setGraphType, // Added this
  onAlgorithmChange,
  onVisualize,
  onClear,
  onReset,
  onGenerateMaze,
  isRunning,
  speed,
  onSpeedChange,
}: ControlsProps) => {
  return (
    <div className="bg-card/50 backdrop-blur-md border-b border-border/50 px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Algorithm Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Algorithm:</span>
          <Select value={algorithm} onValueChange={onAlgorithmChange} disabled={isRunning}>
            <SelectTrigger className="w-48 btn-glass border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-md border-border/50">
              <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
              <SelectItem value="bfs">Breadth-First Search</SelectItem>
            </SelectContent>
          </Select>

          {/* ADDED: Weighted/Unweighted Toggle for Dijkstra */}
          {algorithm === "dijkstra" && (
            <div className="flex gap-1 ml-2 bg-secondary/30 p-1 rounded-md border border-border/50">
              <Button
                variant={graphType === "weighted" ? "default" : "ghost"}
                size="sm"
                onClick={() => setGraphType("weighted")}
                className={`h-7 px-3 text-xs ${graphType === "weighted" ? "bg-primary shadow-lg" : ""}`}
                disabled={isRunning}
              >
                Weighted
              </Button>
              <Button
                variant={graphType === "unweighted" ? "default" : "ghost"}
                size="sm"
                onClick={() => setGraphType("unweighted")}
                className={`h-7 px-3 text-xs ${graphType === "unweighted" ? "bg-primary shadow-lg" : ""}`}
                disabled={isRunning}
              >
                Unweighted
              </Button>
            </div>
          )}
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3 btn-glass rounded-lg px-4 py-2">
          <Gauge className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Speed:</span>
          <Slider
            value={[speed]}
            onValueChange={onSpeedChange}
            min={1}
            max={100}
            step={1}
            className="w-32"
          />
          <span className="text-xs font-mono text-primary w-10">{speed}%</span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border/50" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onVisualize}
            disabled={isRunning}
            className="btn-glass-primary gap-2 font-semibold"
          >
            <Play className="w-4 h-4" />
            Execute Search
          </Button>

          <Button
            onClick={onGenerateMaze}
            disabled={isRunning}
            className="btn-glass gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            Generate Maze
          </Button>

          <Button
            onClick={onReset}
            disabled={isRunning}
            className="btn-glass gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Trace
          </Button>

          <Button
            onClick={onClear}
            disabled={isRunning}
            className="btn-glass gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear Grid
          </Button>
        </div>

        {/* Instructions */}
        <div className="ml-auto text-sm text-muted-foreground hidden lg:block">
          <span className="text-primary font-medium">Tip:</span> Click & drag to draw walls.
          Drag start/end markers to move them.
        </div>
      </div>
    </div>
  );
};

export default Controls;
