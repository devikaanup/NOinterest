import React, { useEffect, useState, useRef } from "react";
import "./BeatItScreen.css";

interface BeatItScreenProps {
  onRestart?: () => void;
}

export const BeatItScreen: React.FC<BeatItScreenProps> = ({ onRestart }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Timer to mark the completion of all 3 words emergence
    const completedTimer = setTimeout(() => {
      setIsCompleted(true);
    }, 9400);

    // Cinematic procedural sound synthesis for the dramatic dark reveal
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }

        const now = ctx.currentTime;

        // 1. Initial dark sub-drone building up atmosphere
        const droneOsc = ctx.createOscillator();
        const droneGain = ctx.createGain();
        droneOsc.type = "sine";
        droneOsc.frequency.setValueAtTime(45, now);
        droneOsc.frequency.exponentialRampToValueAtTime(32, now + 8);

        droneGain.gain.setValueAtTime(0.001, now);
        droneGain.gain.exponentialRampToValueAtTime(0.12, now + 2);
        droneGain.gain.exponentialRampToValueAtTime(0.06, now + 10);

        droneOsc.connect(droneGain).connect(ctx.destination);
        droneOsc.start(now);
        droneOsc.stop(now + 16);

        // Helper function for deep cinematic impact when a word breaches the darkness
        const playWordImpact = (delaySec: number, freq: number, duration: number) => {
          const impactTime = now + delaySec;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq * 1.5, impactTime);
          osc.frequency.exponentialRampToValueAtTime(freq, impactTime + 0.1);
          osc.frequency.exponentialRampToValueAtTime(28, impactTime + duration);

          gain.gain.setValueAtTime(0.001, impactTime);
          gain.gain.exponentialRampToValueAtTime(0.2, impactTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, impactTime + duration);

          osc.connect(gain).connect(ctx.destination);
          osc.start(impactTime);
          osc.stop(impactTime + duration + 0.1);
        };

        // Word 1: YOU (~2.0s)
        playWordImpact(2.0, 75, 2.5);
        // Word 2: BEAT (~4.4s)
        playWordImpact(4.4, 65, 2.5);
        // Word 3: IT (~6.8s) - Deepest resonant impact
        playWordImpact(6.8, 55, 3.5);
      }
    } catch {
      // Graceful fallback if AudioContext isn't available
    }

    return () => {
      clearTimeout(completedTimer);
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        try {
          audioCtxRef.current.close().catch(() => {});
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <div
      className="beat-it-screen"
      role="region"
      aria-label="You beat the game victory screen"
    >
      <div className="beat-it-vignette" />
      <div className="beat-it-particles" />

      <div className={`beat-it-words-container ${isCompleted ? "completed" : ""}`}>
        <span className="beat-it-word beat-it-word-1">YOU</span>
        <span className="beat-it-word beat-it-word-2">BEAT</span>
        <span className="beat-it-word beat-it-word-3">IT</span>
      </div>

      <div className="beat-it-actions">
        <span className="beat-it-subtitle">The Gauntlet Has Been Broken</span>
        {onRestart && (
          <button
            type="button"
            className="beat-it-restart-btn"
            onClick={onRestart}
          >
            Wake Up &amp; Re-enter
          </button>
        )}
      </div>
    </div>
  );
};
