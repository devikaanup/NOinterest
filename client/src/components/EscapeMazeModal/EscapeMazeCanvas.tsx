import React, { useEffect, useRef } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './engine/constants';
import { createInitialGameState, updateGameState } from './engine/gameLoop';
import { renderGame } from './engine/renderer';
import { GameState } from './engine/types';

interface EscapeMazeCanvasProps {
  onEscape: () => void;
  onFailsChange?: (fails: number) => void;
}

export const EscapeMazeCanvas: React.FC<EscapeMazeCanvasProps> = ({
  onEscape,
  onFailsChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(createInitialGameState());
  const keysRef = useRef<Set<string>>(new Set());
  const animFrameIdRef = useRef<number | null>(null);
  const escapedRef = useRef(false);

  useEffect(() => {
    escapedRef.current = false;
    stateRef.current = createInitialGameState();
    if (onFailsChange) {
      onFailsChange(0);
    }
  }, [onFailsChange]);

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const gameKeys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
        'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'w', 'a', 's', 'd',
        'W', 'A', 'S', 'D'
      ];

      if (gameKeys.includes(e.key) || gameKeys.includes(e.code)) {
        e.preventDefault();
        keysRef.current.add(e.key);
        keysRef.current.add(e.code);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main 60fps Game & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina / HiDPI Scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const deltaMs = currentTime - lastTime;
      lastTime = currentTime;
      // Cap deltaSec between 0.001 and 0.1 to avoid frame jumps on tab sleep
      const deltaSec = Math.min(Math.max(deltaMs / 1000, 0.001), 0.1);

      const prevState = stateRef.current;
      const prevFails = prevState.fails;

      // Update Physics & Rotation
      const newState = updateGameState(prevState, keysRef.current, currentTime, deltaSec);
      stateRef.current = newState;

      // Notify Fails update if changed
      if (newState.fails !== prevFails && onFailsChange) {
        onFailsChange(newState.fails);
      }

      // Render
      renderGame(ctx, newState);

      // Check Victory Condition
      if (newState.hasEscaped && !escapedRef.current) {
        escapedRef.current = true;
        // Small delay to let victory flash display before firing callback
        setTimeout(() => {
          onEscape();
        }, 180);
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [onEscape, onFailsChange]);

  return (
    <div className="escape-maze-canvas-container">
      <canvas
        ref={canvasRef}
        className="escape-maze-canvas"
        style={{
          width: '100%',
          maxWidth: '920px',
          aspectRatio: '2 / 1',
          display: 'block'
        }}
        tabIndex={0}
      />
    </div>
  );
};
