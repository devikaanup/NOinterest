import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DecoyExitButtons.css';

interface DecoyButtonState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface DecoyExitButtonsProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
}

const BTN_WIDTH = 116;
const BTN_HEIGHT = 36;
const MAX_BUTTONS = 64;

type WastedState = 'idle' | 'growing' | 'taunting' | 'done';

function getRandomVelocity(): { vx: number; vy: number } {
  const speed = 0.7 + Math.random() * 0.9;
  const angle = Math.random() * Math.PI * 2;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };
}

function getRandomPositionOutsideCard(cardRect: DOMRect | null): { x: number; y: number } {
  const winW = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const winH = typeof window !== 'undefined' ? window.innerHeight : 768;

  const pad = 12;
  const maxX = Math.max(pad, winW - BTN_WIDTH - pad);
  const maxY = Math.max(pad, winH - BTN_HEIGHT - pad);

  if (!cardRect) {
    return {
      x: pad + Math.random() * (maxX - pad),
      y: pad + Math.random() * (maxY - pad)
    };
  }

  const exclLeft = cardRect.left - BTN_WIDTH - pad;
  const exclRight = cardRect.right + pad;
  const exclTop = cardRect.top - BTN_HEIGHT - pad;
  const exclBottom = cardRect.bottom + pad;

  for (let i = 0; i < 30; i++) {
    const candidateX = pad + Math.random() * (maxX - pad);
    const candidateY = pad + Math.random() * (maxY - pad);

    const isInsideCard =
      candidateX >= exclLeft &&
      candidateX <= exclRight &&
      candidateY >= exclTop &&
      candidateY <= exclBottom;

    if (!isInsideCard) {
      return { x: candidateX, y: candidateY };
    }
  }

  const zones: Array<'top' | 'bottom' | 'left' | 'right'> = [];
  if (exclTop > pad) zones.push('top');
  if (winH - exclBottom > BTN_HEIGHT + pad) zones.push('bottom');
  if (exclLeft > pad) zones.push('left');
  if (winW - exclRight > BTN_WIDTH + pad) zones.push('right');

  const chosenZone = zones.length > 0 ? zones[Math.floor(Math.random() * zones.length)] : 'bottom';

  switch (chosenZone) {
    case 'top':
      return {
        x: pad + Math.random() * (maxX - pad),
        y: pad + Math.random() * Math.max(1, exclTop - pad)
      };
    case 'bottom':
      return {
        x: pad + Math.random() * (maxX - pad),
        y: exclBottom + Math.random() * Math.max(1, winH - exclBottom - BTN_HEIGHT - pad)
      };
    case 'left':
      return {
        x: pad + Math.random() * Math.max(1, exclLeft - pad),
        y: pad + Math.random() * (maxY - pad)
      };
    case 'right':
    default:
      return {
        x: exclRight + Math.random() * Math.max(1, winW - exclRight - BTN_WIDTH - pad),
        y: pad + Math.random() * (maxY - pad)
      };
  }
}

export const DecoyExitButtons: React.FC<DecoyExitButtonsProps> = ({ cardRef }) => {
  const [buttons, setButtons] = useState<DecoyButtonState[]>(() => {
    return [
      {
        id: 1,
        x: 100,
        y: 100,
        ...getRandomVelocity()
      }
    ];
  });

  const [wastedState, setWastedState] = useState<WastedState>('idle');
  const buttonsRef = useRef<DecoyButtonState[]>(buttons);
  buttonsRef.current = buttons;

  // Set initial position below the card
  useEffect(() => {
    const cardRect = cardRef.current?.getBoundingClientRect() || null;
    const initialPos = cardRect
      ? {
          x: Math.max(16, Math.min(window.innerWidth - BTN_WIDTH - 16, cardRect.left + cardRect.width / 2 - BTN_WIDTH / 2)),
          y: Math.min(window.innerHeight - BTN_HEIGHT - 16, cardRect.bottom + 18)
        }
      : getRandomPositionOutsideCard(null);

    setButtons([
      {
        id: 1,
        ...initialPos,
        ...getRandomVelocity()
      }
    ]);
  }, [cardRef]);

  // Click handler: Duplicates count (up to 64) and re-randomizes ALL positions
  const handleButtonClick = useCallback(() => {
    if (wastedState !== 'idle') return;

    const cardRect = cardRef.current?.getBoundingClientRect() || null;
    const currentCount = buttonsRef.current.length;
    const targetCount = Math.min(MAX_BUTTONS, currentCount * 2);

    const updatedButtons: DecoyButtonState[] = [];
    for (let i = 0; i < targetCount; i++) {
      const pos = getRandomPositionOutsideCard(cardRect);
      const vel = getRandomVelocity();
      updatedButtons.push({
        id: i + 1,
        x: pos.x,
        y: pos.y,
        vx: vel.vx,
        vy: vel.vy
      });
    }

    setButtons(updatedButtons);

    // When the button count reaches the 64 limit, initiate the Wasted sequence!
    if (targetCount >= MAX_BUTTONS) {
      setWastedState('growing');
    }
  }, [cardRef, wastedState]);

  // Sequence timer for Wasted popup stages
  useEffect(() => {
    if (wastedState === 'growing') {
      // After 2s of growing, show taunt message
      const tauntTimer = setTimeout(() => {
        setWastedState('taunting');
      }, 2000);

      return () => clearTimeout(tauntTimer);
    }

    if (wastedState === 'taunting') {
      // After 2.5s of taunting, dismiss Wasted popup and remove all decoy buttons
      const dismissTimer = setTimeout(() => {
        setWastedState('done');
        setButtons([]);
      }, 2500);

      return () => clearTimeout(dismissTimer);
    }
  }, [wastedState]);

  // 60fps Animation Loop: Continuous floating and collision deflections
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const currentList = buttonsRef.current;
      if (currentList.length === 0) return;

      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const cardRect = cardRef.current?.getBoundingClientRect() || null;

      const pad = 8;
      const exclLeft = cardRect ? cardRect.left - BTN_WIDTH - pad : -9999;
      const exclRight = cardRect ? cardRect.right + pad : -9999;
      const exclTop = cardRect ? cardRect.top - BTN_HEIGHT - pad : -9999;
      const exclBottom = cardRect ? cardRect.bottom + pad : -9999;

      const nextList = currentList.map((btn) => {
        let nextX = btn.x + btn.vx;
        let nextY = btn.y + btn.vy;
        let nextVx = btn.vx;
        let nextVy = btn.vy;

        // Viewport boundaries
        if (nextX <= pad) {
          nextX = pad;
          nextVx = Math.abs(btn.vx);
        } else if (nextX >= winW - BTN_WIDTH - pad) {
          nextX = winW - BTN_WIDTH - pad;
          nextVx = -Math.abs(btn.vx);
        }

        if (nextY <= pad) {
          nextY = pad;
          nextVy = Math.abs(btn.vy);
        } else if (nextY >= winH - BTN_HEIGHT - pad) {
          nextY = winH - BTN_HEIGHT - pad;
          nextVy = -Math.abs(btn.vy);
        }

        // Deflect off excluded card rect
        if (
          cardRect &&
          nextX >= exclLeft &&
          nextX <= exclRight &&
          nextY >= exclTop &&
          nextY <= exclBottom
        ) {
          const distLeft = Math.abs(nextX - exclLeft);
          const distRight = Math.abs(nextX - exclRight);
          const distTop = Math.abs(nextY - exclTop);
          const distBottom = Math.abs(nextY - exclBottom);
          const minDist = Math.min(distLeft, distRight, distTop, distBottom);

          if (minDist === distLeft) {
            nextX = exclLeft;
            nextVx = -Math.abs(btn.vx);
          } else if (minDist === distRight) {
            nextX = exclRight;
            nextVx = Math.abs(btn.vx);
          } else if (minDist === distTop) {
            nextY = exclTop;
            nextVy = -Math.abs(btn.vy);
          } else {
            nextY = exclBottom;
            nextVy = Math.abs(btn.vy);
          }
        }

        return {
          ...btn,
          x: nextX,
          y: nextY,
          vx: nextVx,
          vy: nextVy
        };
      });

      buttonsRef.current = nextList;
      setButtons(nextList);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [cardRef]);

  return (
    <>
      {/* Decoy "Exit frfr" buttons */}
      {buttons.length > 0 && (
        <div className="decoy-exit-container" aria-hidden="false">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              type="button"
              className="decoy-exit-btn"
              style={{
                transform: `translate3d(${btn.x}px, ${btn.y}px, 0)`
              }}
              onClick={handleButtonClick}
              aria-label="Exit frfr"
            >
              <span className="decoy-exit-icon">🚪</span>
              <span>Exit frfr</span>
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Wasted Popup Sequence */}
      {(wastedState === 'growing' || wastedState === 'taunting') && (
        <div
          className="wasted-fullscreen-overlay"
          data-testid="wasted-overlay"
          role="alert"
          aria-live="assertive"
        >
          <div className="wasted-content-box">
            <img
              src="/wasted.png"
              alt="Wasted"
              className="wasted-badge-img"
            />

            {wastedState === 'taunting' && (
              <div className="wasted-taunt-msg">
                <span>Not really , finish the game to exit 😈</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
