import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface LuckCheckModalProps {
  isOpen: boolean;
  searchTerm?: string;
  onClose: (resultTopic?: string) => void;
}

const WHEEL_SECTIONS = [
  { label: "Wet Socks", color: "#ff5ca8" },
  { label: "Error 404", color: "#a8ff00" },
  { label: "Cold Soup", color: "#ff8c2e" },
  { label: "Mild Regret", color: "#65d6e8" },
  { label: "Broken Glass", color: "#8f7bff" },
  { label: "Dial-up Tone", color: "#ffe05b" },
  { label: "Sinking Feeling", color: "#ef6f6f" },
  { label: "Hairball", color: "#8ce0a3" },
  { label: "Unsent Email", color: "#ff5ca8" },
  { label: "Blue Screen", color: "#a8ff00" },
  { label: "Nothing", color: "#ff8c2e" },
  { label: "Jackpot (?)", color: "#65d6e8" },
];

export const LuckCheckModal: React.FC<LuckCheckModalProps> = ({
  isOpen,
  searchTerm = "nothing in particular",
  onClose,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);

  const resetSpin = useCallback(() => {
    setIsSpinning(false);
    setResult(null);
    if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);

    // Reset root page transform immediately
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.style.transition = "";
      rootEl.style.transform = "";
      rootEl.style.transformOrigin = "";
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetSpin();
    }
  }, [isOpen, resetSpin]);

  // Spin world background while wheel stays completely static
  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const rootEl = document.getElementById("root");
    if (rootEl) {
      const spins = 4 + Math.floor(Math.random() * 3); // 4-6 full 360 spins
      const randomStopAngle = Math.floor(Math.random() * 360);
      const totalRotation = spins * 360 + randomStopAngle;

      rootEl.style.transformOrigin = "center 400px";
      rootEl.style.transition = "transform 3.2s cubic-bezier(0.15, 0.85, 0.35, 1)";
      rootEl.style.transform = `rotate(${totalRotation}deg)`;
    }

    // After 3.2s, decelerate to stop, snap root back to normal, and reveal rigged result
    spinTimeoutRef.current = window.setTimeout(() => {
      // Snap root back to normal cleanly
      if (rootEl) {
        rootEl.style.transition = "transform 0.4s ease-out";
        rootEl.style.transform = "rotate(0deg)";
        window.setTimeout(() => {
          if (rootEl) {
            rootEl.style.transition = "";
            rootEl.style.transform = "";
          }
        }, 400);
      }

      // Pre-determined rigged result: 92% chance of funny joke item, 8% chance of search term
      const roll = Math.random();
      let picked: string;
      if (roll > 0.92 && searchTerm.trim()) {
        picked = searchTerm.trim();
      } else {
        const pool = WHEEL_SECTIONS.filter((s) => s.label !== "Jackpot (?)");
        picked = pool[Math.floor(Math.random() * pool.length)].label;
      }

      setResult(picked);
      setIsSpinning(false);
    }, 3300);
  };

  // Trigger spin automatically when modal opens if not already spun
  useEffect(() => {
    if (isOpen && !isSpinning && !result) {
      const timer = window.setTimeout(() => {
        startSpin();
      }, 350);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <div className="luck-check-overlay" role="dialog" aria-modal="true">
      <div className="luck-check-card">
        <button
          type="button"
          className="luck-check-close"
          onClick={() => onClose(result || undefined)}
          disabled={isSpinning}
          aria-label="Close"
        >
          ✕
        </button>

        <span className="luck-check-label">MANDATORY LUCK CHECK</span>
        <h2 className="luck-check-title">
          Oh so you want &ldquo;{searchTerm}&rdquo;, let&apos;s see if you&apos;re lucky enough for it.
        </h2>

        <div className="luck-wheel-wrapper">
          {/* Static fixed arrow pointing straight down into top of wheel */}
          <div className="luck-pointer-arrow" aria-hidden="true">
            ▼
          </div>

          {/* Wheel is COMPLETELY STATIC (Never rotates or animates its transform) */}
          <div className="luck-static-wheel" style={{ transform: "none" }}>
            {WHEEL_SECTIONS.map((slice, idx) => {
              const angle = idx * (360 / WHEEL_SECTIONS.length);
              return (
                <div
                  key={`${slice.label}-${idx}`}
                  className="luck-wheel-slice"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <span className="luck-slice-text" style={{ borderLeftColor: slice.color }}>
                    {slice.label}
                  </span>
                </div>
              );
            })}
            <div className="luck-wheel-hub" />
          </div>
        </div>

        <div className="luck-check-status-area">
          {isSpinning ? (
            <div className="luck-spinning-status">
              <span className="luck-spin-icon">🌀</span>
              <span>SPINNING THE UNIVERSE WITH PURPOSE...</span>
            </div>
          ) : result ? (
            <div className="luck-result-box">
              <div className="luck-result-line">
                You got: <b className="luck-result-text">{result}</b>
              </div>
              <small className="luck-sub">Lucky you.</small>
              <button
                type="button"
                className="luck-accept-btn"
                onClick={() => onClose(result)}
              >
                Accept Fate & Proceed
              </button>
            </div>
          ) : (
            <button type="button" className="luck-spin-trigger-btn" onClick={startSpin}>
              Spin to Test Luck
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default LuckCheckModal;
