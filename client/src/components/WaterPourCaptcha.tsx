import React, { useState, useRef, useEffect, useCallback } from "react";

interface WaterPourCaptchaProps {
  onSuccess: () => void;
  disabled?: boolean;
}

const TAUNTS = [
  "Oops. A little too thirsty.",
  "Try being gentler.",
  "All over the desk. Try again.",
  "Way too eager.",
  "Back to zero. Steady hands.",
  "That was not gentle.",
  "Patience is a virtue here.",
];

function getRandomTarget(): number {
  // Random height between 42% and 72% full
  return Math.floor(42 + Math.random() * 30);
}

export const WaterPourCaptcha: React.FC<WaterPourCaptchaProps> = ({ onSuccess, disabled = false }) => {
  const [targetLevel, setTargetLevel] = useState<number>(() => getRandomTarget());
  const [waterLevel, setWaterLevel] = useState<number>(0);
  const [tilt, setTilt] = useState<number>(0); // 0 to 90 degrees
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [isSpilling, setIsSpilling] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [taunt, setTaunt] = useState<string>("");
  const [wavePhase, setWavePhase] = useState<number>(0);

  const isDraggingRef = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tiltRef = useRef<number>(0);
  const waterLevelRef = useRef<number>(0);
  const isPouringRef = useRef<boolean>(false);
  const isSpillingRef = useRef<boolean>(false);
  const isSuccessRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const successTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const pourGainRef = useRef<GainNode | null>(null);
  const pourNoiseNodeRef = useRef<AudioNode | null>(null);
  const pourOscRef = useRef<OscillatorNode | null>(null);

  // Initialize Audio Context on demand
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Continuous Pour Sound: filtered noise + gentle gurgle
  const startPourAudio = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (pourGainRef.current) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.connect(ctx.destination);
      pourGainRef.current = masterGain;

      // 1. Noise Generator for water hiss
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter for liquid tone
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      pourNoiseNodeRef.current = whiteNoise;

      // 2. Gurgling sine bubble
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      oscGain.gain.setValueAtTime(0.25, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      pourOscRef.current = osc;
    } catch {
      // Audio fallback for non-supported environments
    }
  }, [getAudioContext]);

  const updatePourAudio = useCallback((intensity: number) => {
    if (!pourGainRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const targetGain = Math.min(0.28, Math.max(0.02, intensity * 0.3));
      pourGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05);

      if (pourOscRef.current) {
        pourOscRef.current.frequency.setTargetAtTime(160 + intensity * 80, ctx.currentTime, 0.05);
      }
    } catch {
      /* ignore audio error */
    }
  }, []);

  const stopPourAudio = useCallback(() => {
    if (!pourGainRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      pourGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      setTimeout(() => {
        try {
          if (pourNoiseNodeRef.current) {
            (pourNoiseNodeRef.current as AudioBufferSourceNode).stop();
            pourNoiseNodeRef.current.disconnect();
            pourNoiseNodeRef.current = null;
          }
          if (pourOscRef.current) {
            pourOscRef.current.stop();
            pourOscRef.current.disconnect();
            pourOscRef.current = null;
          }
          if (pourGainRef.current) {
            pourGainRef.current.disconnect();
            pourGainRef.current = null;
          }
        } catch {
          /* ignore cleanup errors */
        }
      }, 80);
    } catch {
      /* ignore */
    }
  }, []);

  // Splash sound on overshoot
  const playSplashAudio = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const splashGain = ctx.createGain();
      splashGain.gain.setValueAtTime(0.4, ctx.currentTime);
      splashGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      splashGain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.35);
      osc.connect(splashGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      /* ignore */
    }
  }, [getAudioContext]);

  // Success Chime sound
  const playSuccessAudio = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.55);
      });
    } catch {
      /* ignore */
    }
  }, [getAudioContext]);

  // Main simulation loop
  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setWavePhase((p) => (p + dt * 6) % (Math.PI * 2));

      const currentTilt = tiltRef.current;
      const THRESHOLD = 24; // degrees

      if (currentTilt > THRESHOLD && !isSpillingRef.current && !isSuccessRef.current) {
        // Pour rate scales exponentially past threshold
        const intensity = (currentTilt - THRESHOLD) / (90 - THRESHOLD);
        const pourSpeed = 12 + intensity * 45; // % per second
        const nextLevel = waterLevelRef.current + pourSpeed * dt;

        waterLevelRef.current = nextLevel;
        setWaterLevel(nextLevel);

        if (!isPouringRef.current) {
          isPouringRef.current = true;
          setIsPouring(true);
          startPourAudio();
        }
        updatePourAudio(intensity);

        // Fail condition: overshoot target by more than 2.5%
        if (nextLevel > targetLevel + 2.5) {
          triggerSpill();
        }
      } else {
        if (isPouringRef.current) {
          isPouringRef.current = false;
          setIsPouring(false);
          stopPourAudio();
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetLevel, startPourAudio, updatePourAudio, stopPourAudio]);

  const triggerSpill = () => {
    isSpillingRef.current = true;
    setIsSpilling(true);
    stopPourAudio();
    playSplashAudio();

    const randomTaunt = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
    setTaunt(randomTaunt);

    // Reset after spill animation
    setTimeout(() => {
      setWaterLevel(0);
      waterLevelRef.current = 0;
      setTilt(0);
      tiltRef.current = 0;
      isDraggingRef.current = false;
      isSpillingRef.current = false;
      setIsSpilling(false);

      // Randomize new target height
      let nextT = getRandomTarget();
      while (Math.abs(nextT - targetLevel) < 8) {
        nextT = getRandomTarget();
      }
      setTargetLevel(nextT);
    }, 700);
  };

  // Check success when user releases drag or tilts back upright
  const checkSuccessCondition = useCallback(() => {
    if (isSpillingRef.current || isSuccessRef.current) return;

    const level = waterLevelRef.current;
    // Forgiving tolerance band around target (±4.5%)
    const withinTolerance = Math.abs(level - targetLevel) <= 4.5 && level > 0;

    if (withinTolerance) {
      // Hold for 0.7s to confirm it wasn't an accidental brush
      if (successTimerRef.current) clearTimeout(successTimerRef.current);

      successTimerRef.current = setTimeout(() => {
        // Confirm steady
        if (Math.abs(waterLevelRef.current - targetLevel) <= 4.5 && !isSpillingRef.current) {
          isSuccessRef.current = true;
          setIsSuccess(true);
          playSuccessAudio();
          setTimeout(() => {
            onSuccess();
          }, 800);
        }
      }, 650);
    }
  }, [targetLevel, playSuccessAudio, onSuccess]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || isSpilling || isSuccess) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || disabled || isSpilling || isSuccess) return;

    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;

    // Dragging right and/or downwards tilts the pitcher rightwards
    const dragDistance = Math.max(0, dx * 0.7 + dy * 0.5);
    // 0 to 140px drag maps to 0 to 85 degrees
    const calculatedTilt = Math.min(85, Math.max(0, (dragDistance / 140) * 85));

    setTilt(calculatedTilt);
    tiltRef.current = calculatedTilt;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Smoothly snap jug back to upright
    setTilt(0);
    tiltRef.current = 0;

    checkSuccessCondition();
  };

  // Irregular Geometric Glass Geometry (matching user diagram)
  const glassHeight = 155;
  const glassWidth = 140;
  const baseY = 146;
  const topY = 14;
  const hTotal = baseY - topY; // 132px fillable height

  const currentHeightPx = (waterLevel / 100) * hTotal;
  const waterTopY = baseY - currentHeightPx;

  const waveAmplitude = isPouring ? 3.5 : (waterLevel > 0 ? 1.5 : 0);
  const waveY1 = waterTopY + Math.sin(wavePhase) * waveAmplitude;
  const waveY2 = waterTopY - Math.cos(wavePhase) * waveAmplitude;

  const waterPath = `
    M 0,${waveY1}
    Q 35,${waveY1 - waveAmplitude * 1.2} 70,${(waveY1 + waveY2) / 2}
    T ${glassWidth},${waveY2}
    L ${glassWidth},${glassHeight}
    L 0,${glassHeight}
    Z
  `;

  // Target line coordinates
  const targetY = baseY - (targetLevel / 100) * hTotal;
  const targetToleranceHeight = (9 / 100) * hTotal; // ±4.5%

  const polygonPoints = "52,14 74,14 80,48 132,48 132,144 94,132 58,146 44,98 16,116 12,56";

  return (
    <div className="water-pour-widget" onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
      <div className="water-pour-header">
        <span className="pour-instruction">Pour to the line. Don&apos;t overshoot.</span>
        {taunt && <span className="pour-taunt">{taunt}</span>}
      </div>

      <div className="water-pour-arena">
        {/* Jug / Pitcher Graphic */}
        <div
          className={`pitcher-anchor ${isDraggingRef.current ? "is-dragging" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          style={{
            transform: `rotate(${tilt}deg)`,
            cursor: isSuccess ? "default" : isDraggingRef.current ? "grabbing" : "grab",
          }}
          title="Drag down or right to tilt and pour"
        >
          <svg className="pitcher-svg" viewBox="0 0 100 80" width="115" height="92">
            <defs>
              <filter id="pitcherGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38bdf8" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Jug Body - Bright gleaming white ceramic with neon cyan stroke */}
            <path
              d="M 25,20 L 75,20 C 85,20 90,32 86,48 C 82,64 74,74 50,74 C 26,74 18,64 14,48 C 10,32 15,20 25,20 Z"
              fill="#ffffff"
              stroke="#00f0ff"
              strokeWidth="4"
              filter="url(#pitcherGlow)"
            />
            {/* Water Inside Pitcher (glowing electric cyan) */}
            <path
              d="M 18,36 C 30,32 70,32 82,36 C 80,55 72,68 50,68 C 28,68 20,55 18,36 Z"
              fill="#00d4ff"
            />
            {/* Jug Spout - Bright with neon stroke */}
            <path
              d="M 75,20 L 93,15 C 95,17 91,26 84,28 Z"
              fill="#e0f2fe"
              stroke="#00f0ff"
              strokeWidth="4"
              strokeLinejoin="round"
              filter="url(#pitcherGlow)"
            />
            {/* Jug Handle - Bright neon cyan */}
            <path
              d="M 17,25 C 2,27 0,55 16,62"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="5.5"
              strokeLinecap="round"
              filter="url(#pitcherGlow)"
            />
            {/* Drag hint indicator - Bright high contrast badge */}
            {!isPouring && waterLevel === 0 && !isSuccess && (
              <g>
                <rect x="25" y="38" width="50" height="22" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2"/>
                <text x="50" y="53" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="'IBM Plex Mono', monospace">
                  DRAG ↷
                </text>
              </g>
            )}
          </svg>

          {/* Liquid Stream coming from spout */}
          {isPouring && (
            <div
              className="water-stream"
              style={{
                height: `${90 + (tilt - 25) * 0.5}px`,
                width: `${4 + (tilt - 25) * 0.12}px`,
                opacity: Math.min(1, 0.4 + (tilt - 25) * 0.02),
              }}
            />
          )}
        </div>

        {/* Irregular Geometric Glass Graphic */}
        <div className={`glass-container ${isSuccess ? "glass-success" : ""} ${isSpilling ? "glass-spill" : ""}`}>
          <svg className="glass-svg" viewBox={`0 0 ${glassWidth} ${glassHeight}`} width={glassWidth} height={glassHeight}>
            <defs>
              {/* Vibrant Liquid Gradient */}
              <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Glowing filter for neon cyan glass outline */}
              <filter id="glassNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#00f0ff" floodOpacity="0.95" />
              </filter>

              {/* Target glowing filter */}
              <filter id="targetOrangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ff9f1c" floodOpacity="1" />
              </filter>

              {/* Clip path for irregular geometric glass */}
              <clipPath id="irregularGlassClip">
                <polygon points={polygonPoints} />
              </clipPath>
            </defs>

            {/* Glass Interior Glow Fill */}
            <polygon
              points={polygonPoints}
              fill="rgba(0, 240, 255, 0.1)"
            />

            {/* Target Tolerance Zone Band */}
            <rect
              x="0"
              y={targetY - targetToleranceHeight / 2}
              width={glassWidth}
              height={targetToleranceHeight}
              fill="rgba(255, 159, 28, 0.28)"
              clipPath="url(#irregularGlassClip)"
            />

            {/* Liquid Fill with animated wave */}
            {waterLevel > 0 && (
              <g clipPath="url(#irregularGlassClip)">
                <path d={waterPath} fill="url(#liquidGrad)" />
                {/* Surface highlight */}
                <path
                  d={`M 0,${waveY1} Q ${glassWidth * 0.5},${(waveY1 + waveY2) / 2} ${glassWidth},${waveY2}`}
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  fill="none"
                />
              </g>
            )}

            {/* Target Line - Bright Glowing Neon Orange */}
            <line
              x1="0"
              y1={targetY}
              x2={glassWidth}
              y2={targetY}
              stroke="#ff9f1c"
              strokeWidth="3.5"
              strokeDasharray="5 3"
              clipPath="url(#irregularGlassClip)"
              filter="url(#targetOrangeGlow)"
            />

            {/* Target Marker Label Arrow on the right edge */}
            <g transform={`translate(${glassWidth - 4}, ${targetY})`}>
              <polygon points="0,0 8,-5 8,5" fill="#ff9f1c" filter="url(#targetOrangeGlow)" />
            </g>

            {/* Irregular Geometric Glass Outline - BRIGHT NEON CYAN GLOW */}
            <polygon
              points={polygonPoints}
              fill="none"
              stroke="#00f0ff"
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#glassNeonGlow)"
            />

            {/* Top Rim Lip - Glowing White / Cyan */}
            <line x1="50" y1="14" x2="76" y2="14" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
          </svg>

          {/* Splash Overflows on Spill */}
          {isSpilling && (
            <div className="splash-effect" aria-hidden="true">
              <span className="splash-drop drop-1">💧</span>
              <span className="splash-drop drop-2">💦</span>
              <span className="splash-drop drop-3">💧</span>
            </div>
          )}

          {/* Success Glow Indicator */}
          {isSuccess && (
            <div className="success-badge" aria-label="Verified">
              ✓
            </div>
          )}
        </div>
      </div>

      <div className="water-pour-footer">
        <span className="fill-stats">
          FILL: <b>{Math.min(100, Math.round(waterLevel))}%</b>
        </span>
        <span className="target-stats">
          GOAL: <b>{targetLevel}%</b>
        </span>
      </div>
    </div>
  );
};
