import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { EscapeMazeModalProps } from './EscapeMazeModal.types';
import { EscapeMazeCanvas } from './EscapeMazeCanvas';
import { DecoyExitButtons } from './DecoyExitButtons';
import './EscapeMazeModal.css';

export const EscapeMazeModal: React.FC<EscapeMazeModalProps> = ({
  isOpen,
  onEscape,
  title = 'Reach the other side to exit.',
  className = ''
}) => {
  const [fails, setFails] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Reset fails counter whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setFails(0);
    }
  }, [isOpen]);

  // Intercept browser tab close / refresh
  useEffect(() => {
    if (!isOpen) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className={`escape-maze-overlay ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="escape-maze-title"
    >
      {/* Background Graffiti Callout: THE DISAPPEARANCE IS INTENTIONAL */}
      <div className="escape-maze-bg-graffiti" aria-hidden="true">
        <svg className="graffiti-arrow-svg" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M85 10 C60 12, 35 28, 20 46" stroke="#39ff14" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 36 L18 48 L32 44" stroke="#39ff14" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="graffiti-text">
          <span>THE</span>
          <span>DIS-</span>
          <span>APP-</span>
          <span>EAR-</span>
          <span>ANC-</span>
          <span>E</span>
          <span>IS</span>
          <span>INTENTIONAL</span>
        </div>
      </div>

      {/* Floating Decoy "Exit frfr" buttons */}
      <DecoyExitButtons cardRef={cardRef} />

      <div className="escape-maze-card" ref={cardRef}>
        {/* HUD Header */}
        <div className="escape-maze-hud">
          <div className="escape-maze-hud-title" id="escape-maze-title">
            <span className="escape-maze-badge">EXIT LOCK</span>
            <span>{title}</span>
          </div>

          <div className="escape-maze-stats">
            <div className="escape-maze-fails" aria-live="polite">
              FAILS: {fails}
            </div>
          </div>
        </div>

        {/* Canvas Game Engine */}
        <EscapeMazeCanvas
          onEscape={onEscape}
          onFailsChange={setFails}
        />

        {/* Footer Hint Bar */}
        <div className="escape-maze-footer">
          <div className="escape-maze-keys-hint">
            <span>Controls:</span>
            <span className="escape-maze-key-badge">W</span>
            <span className="escape-maze-key-badge">A</span>
            <span className="escape-maze-key-badge">S</span>
            <span className="escape-maze-key-badge">D</span>
            <span>or</span>
            <span className="escape-maze-key-badge">▲</span>
            <span className="escape-maze-key-badge">◄</span>
            <span className="escape-maze-key-badge">▼</span>
            <span className="escape-maze-key-badge">►</span>
          </div>
          <div className="escape-maze-hint-objective">
            Guide red square to right green zone to exit
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
