import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface TurnOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShutdown?: () => void;
}

type ModalPhase = "INITIAL_MATH" | "COUNTDOWN" | "EASY_MATH" | "TROLL_REVEAL" | "SHUTDOWN_SUCCESS";
type AuthSource = "ARITHMETIC" | "STRING_CONCAT";

export const TurnOffModal: React.FC<TurnOffModalProps> = ({ isOpen, onClose, onShutdown }) => {
  const [phase, setPhase] = useState<ModalPhase>("INITIAL_MATH");
  const [authSource, setAuthSource] = useState<AuthSource>("ARITHMETIC");
  const [initialInput, setInitialInput] = useState<string>("");
  const [initialError, setInitialError] = useState<string>("");
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [easyInput, setEasyInput] = useState<string>("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setPhase("INITIAL_MATH");
      setAuthSource("ARITHMETIC");
      setInitialInput("");
      setInitialError("");
      setSecondsLeft(60);
      setEasyInput("");
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen]);

  useEffect(() => {
    if (phase === "COUNTDOWN") {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setPhase("EASY_MATH");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase]);

  if (!isOpen) return null;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = initialInput.trim();
    // 47 * 8 - 12 = 364
    if (val === "364") {
      setAuthSource("ARITHMETIC");
      setPhase("SHUTDOWN_SUCCESS");
      return;
    }
    setInitialError("Incorrect security checksum. Please recalculate or give up.");
  };

  const handleGiveUp = () => {
    setPhase("COUNTDOWN");
    setSecondsLeft(60);
  };

  const handleEasySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = easyInput.trim().replace(/^["']|["']$/g, "");

    // If the user inputs 11, they correctly solved the string concatenation riddle
    if (val === "11") {
      setAuthSource("STRING_CONCAT");
      setPhase("SHUTDOWN_SUCCESS");
      return;
    }

    // Otherwise, mock arithmetic addition assumption and apply contrast punishment
    setPhase("TROLL_REVEAL");
    const currentFilter = document.documentElement.style.filter || "";
    document.documentElement.style.filter = `${currentFilter} contrast(200%) saturate(1.8)`.trim();
  };

  const handleExecuteShutdown = () => {
    // Clear any contrast/filter damage
    document.documentElement.style.filter = "";
    onClose();
    if (onShutdown) {
      onShutdown();
    }
    window.dispatchEvent(new CustomEvent("system-shutdown"));
  };

  const content = (
    <div className="troll-modal-overlay" role="dialog" aria-modal="true">
      <div className="troll-modal-card">
        <div className="troll-modal-header">
          <span className="troll-modal-title">SYSTEM POWER CONTROL</span>
          <button type="button" className="troll-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {phase === "INITIAL_MATH" && (
          <div className="troll-modal-body">
            <div className="troll-math-banner">
              <span className="troll-math-icon">⚠️</span>
              <h3>CONFIRM POWER DOWN</h3>
              <p>Solve the security equation below to authorize immediate system shutdown:</p>
            </div>

            <div className="troll-math-equation">
              <code>47 × 8 - 12 = ?</code>
            </div>

            <form onSubmit={handleInitialSubmit} className="troll-math-form">
              <input
                type="text"
                className="control troll-input"
                placeholder="Enter answer"
                value={initialInput}
                onChange={(e) => {
                  setInitialInput(e.target.value);
                  setInitialError("");
                }}
                autoFocus
              />
              {initialError && <p className="troll-error-msg">{initialError}</p>}
              <div className="troll-btn-row">
                <button type="button" className="btn-secondary troll-giveup-btn" onClick={handleGiveUp}>
                  Give Up
                </button>
                <button type="submit" className="troll-confirm-btn">
                  Authorize Shutdown
                </button>
              </div>
            </form>
          </div>
        )}

        {phase === "COUNTDOWN" && (
          <div className="troll-modal-body troll-countdown-body">
            <span className="troll-sandglass">⏳</span>
            <h3>PENALTY COOL-DOWN</h3>
            <p>You admitted defeat. Preparing a remedial question in:</p>
            <div className="troll-countdown-clock">
              <span className="troll-clock-digits">{secondsLeft}s</span>
            </div>
            <p className="troll-wait-caption">Please do not close this window or the timer will restart.</p>
          </div>
        )}

        {phase === "EASY_MATH" && (
          <div className="troll-modal-body">
            <div className="troll-math-banner">
              <span className="troll-math-icon">👶</span>
              <h3>REMEDIAL VERIFICATION</h3>
              <p>Since you gave up, answer this elementary problem to proceed:</p>
            </div>

            <div className="troll-math-equation">
              <code>1 + 1 = ?</code>
            </div>

            <form onSubmit={handleEasySubmit} className="troll-math-form">
              <input
                type="text"
                className="control troll-input"
                placeholder="Your answer"
                value={easyInput}
                onChange={(e) => setEasyInput(e.target.value)}
                autoFocus
                required
              />
              <button type="submit" className="troll-confirm-btn full-width">
                Confirm Answer
              </button>
            </form>
          </div>
        )}

        {phase === "TROLL_REVEAL" && (
          <div className="troll-modal-body troll-reveal-body">
            <div className="troll-wrong-badge">❌ WRONG ANSWER</div>
            <p className="troll-mock-text">
              Did you seriously assume <em>arithmetic addition</em>?
            </p>
            <div className="troll-code-block">
              <div className="troll-code-line">
                <span className="code-str">&quot;1&quot;</span> + <span className="code-str">&quot;1&quot;</span> === <span className="code-res">&quot;11&quot;</span>
              </div>
              <div className="troll-code-comment">// String concatenation, obviously.</div>
            </div>
            <p className="troll-mock-sub">
              Math logic rejected. Contrast has been permanently damaged.
              Shutdown request revoked.
            </p>
            <button type="button" className="troll-confirm-btn" onClick={onClose}>
              Acknowledge Failure
            </button>
          </div>
        )}

        {phase === "SHUTDOWN_SUCCESS" && (
          <div className="troll-modal-body troll-reveal-body">
            <div
              style={{
                background: "#064e3b",
                border: "1px solid #10b981",
                color: "#6ee7b7",
                font: "700 13px 'IBM Plex Mono', monospace",
                padding: "6px 14px",
                borderRadius: "9999px",
                letterSpacing: "0.08em",
              }}
            >
              ✓ SHUTDOWN AUTHORIZED
            </div>
            <p className="troll-mock-text" style={{ fontWeight: 600 }}>
              {authSource === "ARITHMETIC"
                ? "Security Checksum Verified"
                : "Security Clearance Granted"}
            </p>
            <div className="troll-code-block">
              {authSource === "ARITHMETIC" ? (
                <>
                  <div className="troll-code-line" style={{ color: "#a8ff00" }}>
                    47 * 8 - 12 === <span className="code-res">364</span>
                  </div>
                  <div className="troll-code-comment">
                    // Arithmetic equation verified. Power down sequence authorized.
                  </div>
                </>
              ) : (
                <>
                  <div className="troll-code-line" style={{ color: "#a8ff00" }}>
                    <span className="code-str">&quot;1&quot;</span> + <span className="code-str">&quot;1&quot;</span> === <span className="code-res">&quot;11&quot;</span>
                  </div>
                  <div className="troll-code-comment">
                    // String concatenation verified. Initiating power down...
                  </div>
                </>
              )}
            </div>
            <p className="troll-mock-sub">
              Subsystems closing. You will be logged out and returned to the outside terminal.
            </p>
            <button
              type="button"
              className="troll-confirm-btn full-width"
              style={{ background: "#10b981", color: "#000", fontWeight: 700 }}
              onClick={handleExecuteShutdown}
            >
              Shut Down &amp; Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export const TurnOffButton: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  onShutdown?: () => void;
}> = ({ className = "", style, onShutdown }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`troll-turn-off-btn ${className}`}
        style={style}
        onClick={() => setIsOpen(true)}
        title="Shut down system"
      >
        <span className="turn-off-icon">⏻</span>
        <span>Turn Off</span>
      </button>
      <TurnOffModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onShutdown={onShutdown}
      />
    </>
  );
};
