import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface WiringTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WireNode {
  id: string;
  color: string;
  name: string;
}

const WIRE_COLORS = [
  { color: "#ef4444", name: "Red" },
  { color: "#3b82f6", name: "Blue" },
  { color: "#eab308", name: "Yellow" },
  { color: "#22c55e", name: "Green" },
  { color: "#ec4899", name: "Pink" },
];

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const WiringTaskModal: React.FC<WiringTaskModalProps> = ({ isOpen, onClose }) => {
  const [leftWires, setLeftWires] = useState<WireNode[]>([]);
  const [rightWires, setRightWires] = useState<WireNode[]>([]);
  const [connections, setConnections] = useState<Record<string, string>>({}); // leftColor -> rightColor
  const [draggingWire, setDraggingWire] = useState<{ color: string; startY: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Reset and scramble wires whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const left = WIRE_COLORS.map((w, idx) => ({ id: `L_${idx}`, color: w.color, name: w.name }));
      const right = WIRE_COLORS.map((w, idx) => ({ id: `R_${idx}`, color: w.color, name: w.name }));
      setLeftWires(shuffleArray(left));
      setRightWires(shuffleArray(right));
      setConnections({});
      setDraggingWire(null);
      setIsCompleted(false);
    }
  }, [isOpen]);

  // Play simple Web Audio click / snap
  const playSnapAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      /* ignore */
    }
  }, []);

  const playCompleteAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.36);
      });
    } catch {
      /* ignore */
    }
  }, []);

  // Handle Dragging
  const handlePointerDown = (color: string, e: React.PointerEvent) => {
    if (isCompleted || connections[color]) return;
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const relY = e.clientY - rect.top;
    setDraggingWire({ color, startY: relY });
    setMousePos({ x: e.clientX - rect.left, y: relY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingWire || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingWire || !panelRef.current) return;

    // Check if pointer is over any right-side wire terminal
    const x = e.clientX;
    const y = e.clientY;

    let matched = false;
    for (const rw of rightWires) {
      const nodeEl = rightRefs.current[rw.color];
      if (nodeEl) {
        const rect = nodeEl.getBoundingClientRect();
        // Generous target hit box around right contact
        if (
          x >= rect.left - 20 &&
          x <= rect.right + 20 &&
          y >= rect.top - 15 &&
          y <= rect.bottom + 15
        ) {
          if (rw.color === draggingWire.color) {
            // Correct connection!
            playSnapAudio();
            const nextConns = { ...connections, [draggingWire.color]: rw.color };
            setConnections(nextConns);
            matched = true;

            // Check victory condition
            if (Object.keys(nextConns).length === leftWires.length) {
              setIsCompleted(true);
              playCompleteAudio();
              setTimeout(() => {
                onClose();
              }, 1400);
            }
          }
          break;
        }
      }
    }

    setDraggingWire(null);
  };

  if (!isOpen) return null;

  const connectedCount = Object.keys(connections).length;

  const content = (
    <div className="wiring-modal-overlay" role="dialog" aria-modal="true">
      <div className="wiring-panel-wrap">
        {/* Among Us Panel Header */}
        <div className="wiring-panel-header">
          <div className="wiring-header-left">
            <span className="wiring-caution-light" />
            <span className="wiring-task-title">
              ELECTRICAL: FIX WIRING ({connectedCount}/{leftWires.length})
            </span>
          </div>
          <button type="button" className="wiring-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Electrical Box Chassis */}
        <div
          ref={panelRef}
          className="wiring-chassis"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setDraggingWire(null)}
        >
          {/* SVG Overlay for Wires */}
          <svg className="wiring-svg-canvas">
            {/* Draw active dragging wire */}
            {draggingWire && panelRef.current && (
              <line
                x1="45"
                y1={draggingWire.startY}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke={draggingWire.color}
                strokeWidth="12"
                strokeLinecap="round"
                className="active-drag-wire"
              />
            )}

            {/* Draw established connected wires */}
            {Object.entries(connections).map(([color]) => {
              const leftEl = leftRefs.current[color];
              const rightEl = rightRefs.current[color];
              if (!leftEl || !rightEl || !panelRef.current) return null;

              const pRect = panelRef.current.getBoundingClientRect();
              const lRect = leftEl.getBoundingClientRect();
              const rRect = rightEl.getBoundingClientRect();

              const x1 = lRect.right - pRect.left - 5;
              const y1 = lRect.top + lRect.height / 2 - pRect.top;
              const x2 = rRect.left - pRect.left + 5;
              const y2 = rRect.top + rRect.height / 2 - pRect.top;

              return (
                <path
                  key={color}
                  d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`}
                  stroke={color}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  className="connected-wire"
                />
              );
            })}
          </svg>

          {/* Left Wire Terminals */}
          <div className="wire-column wire-left-col">
            {leftWires.map((wire) => {
              const isConnected = !!connections[wire.color];
              return (
                <div
                  key={wire.id}
                  ref={(el) => {
                    leftRefs.current[wire.color] = el;
                  }}
                  className={`wire-terminal terminal-left ${isConnected ? "is-connected" : ""}`}
                  onPointerDown={(e) => handlePointerDown(wire.color, e)}
                  title={`Drag ${wire.name} wire`}
                >
                  <div className="terminal-bracket" />
                  <div className="wire-contact" style={{ backgroundColor: wire.color }} />
                  <div className={`terminal-led ${isConnected ? "led-active" : ""}`} />
                </div>
              );
            })}
          </div>

          {/* Right Wire Terminals */}
          <div className="wire-column wire-right-col">
            {rightWires.map((wire) => {
              const isConnected = Object.values(connections).includes(wire.color);
              return (
                <div
                  key={wire.id}
                  ref={(el) => {
                    rightRefs.current[wire.color] = el;
                  }}
                  className={`wire-terminal terminal-right ${isConnected ? "is-connected" : ""}`}
                >
                  <div className={`terminal-led ${isConnected ? "led-active" : ""}`} />
                  <div className="wire-contact" style={{ backgroundColor: wire.color }} />
                  <div className="terminal-bracket" />
                </div>
              );
            })}
          </div>

          {/* Task Complete Toast Banner */}
          {isCompleted && (
            <div className="wiring-complete-banner" aria-live="polite">
              <span className="banner-icon">⚡</span>
              <span>TASK COMPLETE!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export const ConnectToInternetButton: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = "", style }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`troll-connect-btn ${className}`}
        style={style}
        onClick={() => setIsOpen(true)}
        title="Connect to Internet"
      >
        <span className="connect-icon">🌐</span>
        <span>Connect to Internet</span>
      </button>
      <WiringTaskModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
