import { memo } from 'react';
import { NodeType } from '@/types/Node';
import { cn } from '@/lib/utils';
import { Play, Target, Anchor } from 'lucide-react'; // Added Anchor for a weight icon look

interface GridNodeProps {
  node: NodeType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const GridNode = memo(({ node, onMouseDown, onMouseEnter, onMouseUp }: GridNodeProps) => {
  // Added isWeight and weight to the destructuring
  const { row, col, isStart, isEnd, isWall, isVisited, isPath, isWeight, weight } = node;

  const getNodeClass = () => {
    if (isStart) return 'bg-node-start glow-success';
    if (isEnd) return 'bg-node-end glow-danger';
    if (isPath) return 'node-path-animation';
    if (isWall) return 'bg-node-wall node-wall-animation';
    if (isWeight) return 'node-weight'; // Triggers purple color from your CSS
    if (isVisited) return 'node-visited-animation';
    return 'bg-node-default hover:bg-secondary';
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={cn(
        'w-6 h-6 border border-border/30 transition-colors cursor-pointer flex items-center justify-center relative',
        getNodeClass()
      )}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    >
      {isStart && <Play className="w-3 h-3 text-background" fill="currentColor" />}
      {isEnd && <Target className="w-3 h-3 text-background" />}
      
      {/* ADDED: Show weight value inside the purple box */}
      {isWeight && !isStart && !isEnd && (
        <span className="text-[10px] font-bold text-white pointer-events-none select-none">
          {weight}
        </span>
      )}
    </div>
  );
});

GridNode.displayName = 'GridNode';

export default GridNode;
