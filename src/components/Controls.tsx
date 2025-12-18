import { Play, Trash2, Grid3X3, RotateCcw } from 'lucide-react';
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
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Algorithm Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Algorithm:</span>
          <Select value={algorithm} onValueChange={onAlgorithmChange} disabled={isRunning}>
            <SelectTrigger className="w-48 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
              <SelectItem value="bfs">Breadth-First Search</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Speed:</span>
          <Slider
            value={[speed]}
            onValueChange={onSpeedChange}
            min={1}
            max={100}
            step={1}
            className="w-32"
            disabled={isRunning}
          />
          <span className="text-xs text-muted-foreground w-8">{speed}%</span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onVisualize}
            disabled={isRunning}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Play className="w-4 h-4" />
            Visualize
          </Button>

          <Button
            onClick={onGenerateMaze}
            disabled={isRunning}
            variant="outline"
            className="gap-2 border-border hover:bg-secondary"
          >
            <Grid3X3 className="w-4 h-4" />
            Generate Maze
          </Button>

          <Button
            onClick={onReset}
            disabled={isRunning}
            variant="outline"
            className="gap-2 border-border hover:bg-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Path
          </Button>

          <Button
            onClick={onClear}
            disabled={isRunning}
            variant="outline"
            className="gap-2 border-border hover:bg-secondary text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear Grid
          </Button>
        </div>

        {/* Instructions */}
        <div className="ml-auto text-sm text-muted-foreground hidden lg:block">
          <span className="text-foreground font-medium">Tip:</span> Click & drag to draw walls.
          Drag start/end markers to move them.
        </div>
      </div>
    </div>
  );
};

export default Controls;
