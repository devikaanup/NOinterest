import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface WiringTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
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

export const WiringTaskModal: React.FC<WiringTaskModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [leftWires, setLeftWires] = useState<WireNode[]>([]);
  const [rightWires, setRightWires] = useState<WireNode[]>([]);
  const [connections, setConnections] = useState<Record<string, string>>({}); // leftColor -> rightColor
  const [draggingWire, setDraggingWire] = useState<{ color: string; startX: number; startY: number } | null>(null);
  const [wireTip, setWireTip] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Elastic drag physics simulation refs
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tipPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tipVelRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const springAnimRef = useRef<number | null>(null);

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

  // Audio effects
  const playSnapAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      /* ignore */
    }
  }, []);

  const playRecoilAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
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

  // Elastic spring physics animation loop for dragging
  useEffect(() => {
    if (!draggingWire) {
      if (springAnimRef.current) cancelAnimationFrame(springAnimRef.current);
      return;
    }

    const anchorX = draggingWire.startX;
    const anchorY = draggingWire.startY;

    const simulateElasticWire = () => {
      const targetX = mouseTargetRef.current.x;
      const targetY = mouseTargetRef.current.y;

      const currentX = tipPosRef.current.x;
      const currentY = tipPosRef.current.y;

      // Distance from starting anchor terminal
      const distFromAnchor = Math.hypot(currentX - anchorX, currentY - anchorY);

      // Strong elastic restorative tension pulling backward toward anchor
      // Tension factor ramps non-linearly with stretch distance: makes wire heavy and resistant!
      const tensionMultiplier = 0.065 * Math.pow(1 + distFromAnchor / 140, 1.35);
      const elasticForceX = (anchorX - currentX) * tensionMultiplier;
      const elasticForceY = (anchorY - currentY) * tensionMultiplier;

      // Spring pull force toward user's pointer
      const springPullX = (targetX - currentX) * 0.16;
      const springPullY = (targetY - currentY) * 0.16;

      // Heavy silicone/rubber damping
      tipVelRef.current.x = (tipVelRef.current.x + springPullX + elasticForceX) * 0.72;
      tipVelRef.current.y = (tipVelRef.current.y + springPullY + elasticForceY) * 0.72;

      tipPosRef.current.x += tipVelRef.current.x;
      tipPosRef.current.y += tipVelRef.current.y;

      setWireTip({ x: tipPosRef.current.x, y: tipPosRef.current.y });

      springAnimRef.current = requestAnimationFrame(simulateElasticWire);
    };

    springAnimRef.current = requestAnimationFrame(simulateElasticWire);

    return () => {
      if (springAnimRef.current) cancelAnimationFrame(springAnimRef.current);
    };
  }, [draggingWire]);

  // Handle Drag initiation
  const handlePointerDown = (color: string, e: React.PointerEvent) => {
    if (isCompleted || connections[color]) return;
    if (!panelRef.current) return;
    const leftEl = leftRefs.current[color];
    if (!leftEl) return;

    const pRect = panelRef.current.getBoundingClientRect();
    const lRect = leftEl.getBoundingClientRect();

    const startX = lRect.right - pRect.left - 5;
    const startY = lRect.top + lRect.height / 2 - pRect.top;

    tipPosRef.current = { x: startX, y: startY };
    tipVelRef.current = { x: 0, y: 0 };
    mouseTargetRef.current = { x: e.clientX - pRect.left, y: e.clientY - pRect.top };

    setDraggingWire({ color, startX, startY });
    setWireTip({ x: startX, y: startY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingWire || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    mouseTargetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerUp = () => {
    if (!draggingWire || !panelRef.current) return;

    const pRect = panelRef.current.getBoundingClientRect();
    const tipScreenX = pRect.left + tipPosRef.current.x;
    const tipScreenY = pRect.top + tipPosRef.current.y;

    let matched = false;
    for (const rw of rightWires) {
      const nodeEl = rightRefs.current[rw.color];
      if (nodeEl) {
        const rect = nodeEl.getBoundingClientRect();
        // Latch test against the REAL elastic wire tip position
        if (
          tipScreenX >= rect.left - 24 &&
          tipScreenX <= rect.right + 24 &&
          tipScreenY >= rect.top - 20 &&
          tipScreenY <= rect.bottom + 20
        ) {
          if (rw.color === draggingWire.color) {
            // Correct connection snap!
            playSnapAudio();
            const nextConns = { ...connections, [draggingWire.color]: rw.color };
            setConnections(nextConns);
            matched = true;

            // Check victory condition
            if (Object.keys(nextConns).length === leftWires.length) {
              setIsCompleted(true);
              playCompleteAudio();
              onComplete?.();
              window.dispatchEvent(new CustomEvent("internet-connected"));
              setTimeout(() => {
                onClose();
              }, 1400);
            }
          }
          break;
        }
      }
    }

    if (!matched) {
      // Elastic rubber recoil sound
      playRecoilAudio();
    }

    setDraggingWire(null);
  };

  if (!isOpen) return null;

  const connectedCount = Object.keys(connections).length;

  // Compute dynamic elastic stretch properties
  const stretchDist = draggingWire
    ? Math.hypot(wireTip.x - draggingWire.startX, wireTip.y - draggingWire.startY)
    : 0;
  // Thickness thins from 14px down to 7px as tension stretches the rubber
  const dynamicThickness = Math.max(6.5, 13.5 - (stretchDist / 380) * 6);
  // Elastic curve sag / tension bow
  const curveSag = Math.sin(Math.min(Math.PI, (stretchDist / 400) * Math.PI)) * 18;

  const content = (
    <div className="wiring-modal-overlay" role="dialog" aria-modal="true">
      <div className="wiring-panel-wrap">
        {/* Panel Header */}
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
          onPointerLeave={handlePointerUp}
        >
          {/* SVG Overlay for Elastic Wires */}
          <svg className="wiring-svg-canvas">
            {/* Draw active dragging elastic wire */}
            {draggingWire && (
              <g>
                {/* Elastic wire drop shadow */}
                <path
                  d={`M ${draggingWire.startX} ${draggingWire.startY} Q ${(draggingWire.startX + wireTip.x) / 2} ${
                    (draggingWire.startY + wireTip.y) / 2 + curveSag
                  } ${wireTip.x} ${wireTip.y}`}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={dynamicThickness + 4}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Elastic rubber cord body */}
                <path
                  d={`M ${draggingWire.startX} ${draggingWire.startY} Q ${(draggingWire.startX + wireTip.x) / 2} ${
                    (draggingWire.startY + wireTip.y) / 2 + curveSag
                  } ${wireTip.x} ${wireTip.y}`}
                  stroke={draggingWire.color}
                  strokeWidth={dynamicThickness}
                  fill="none"
                  strokeLinecap="round"
                  className="active-drag-wire"
                />
                {/* Elastic metallic terminal head pulled by tension */}
                <circle
                  cx={wireTip.x}
                  cy={wireTip.y}
                  r={Math.max(6, dynamicThickness * 0.75)}
                  fill="#ffffff"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                />
              </g>
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
                <g key={color}>
                  <path
                    d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`}
                    stroke="rgba(0,0,0,0.35)"
                    strokeWidth="15"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`}
                    stroke={color}
                    strokeWidth="11.5"
                    fill="none"
                    strokeLinecap="round"
                    className="connected-wire"
                  />
                </g>
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
                  title={`${wire.name} contact`}
                >
                  <div className={`terminal-led ${isConnected ? "led-active" : ""}`} />
                  <div className="wire-contact" style={{ backgroundColor: wire.color }} />
                  <div className="terminal-bracket" />
                </div>
              );
            })}
          </div>

          {/* Success Banner */}
          {isCompleted && (
            <div className="wiring-complete-banner">
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
  isConnected?: boolean;
  onConnectSuccess?: () => void;
}> = ({ className = "", style, isConnected = false, onConnectSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`troll-connect-btn ${isConnected ? "is-connected-online" : ""} ${className}`}
        style={style}
        onClick={() => setIsOpen(true)}
        title={isConnected ? "Internet Connected!" : "Connect to Internet"}
      >
        <span className="connect-icon">{isConnected ? "🟢" : "🌐"}</span>
        <span>{isConnected ? "Connected" : "Connect to Internet"}</span>
      </button>
      <WiringTaskModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onComplete={() => {
          onConnectSuccess?.();
        }}
      />
    </>
  );
};

export default WiringTaskModal;
