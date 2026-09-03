import React, { useState } from "react";

interface InvertColorsToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

const TROLL_FILTERS = [
  "invert(1)",
  "invert(1) hue-rotate(90deg)",
  "invert(1) hue-rotate(180deg) saturate(2)",
  "invert(1) hue-rotate(270deg) contrast(1.4)",
  "invert(1) hue-rotate(45deg) sepia(0.5)",
  "invert(1) contrast(2) hue-rotate(135deg)",
];

export const InvertColorsToggle: React.FC<InvertColorsToggleProps> = ({ className = "", style }) => {
  // Start with invert colors ON by default
  const [clickCount, setClickCount] = useState<number>(1);
  const [checked, setChecked] = useState<boolean>(true);

  // Apply invert(1) on initial mount if not already set
  React.useEffect(() => {
    if (!document.documentElement.style.filter) {
      document.documentElement.style.filter = "invert(1)";
    }
  }, []);

  const handleClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    // Visual toggle flip
    setChecked((prev) => !prev);

    // Apply cumulative or alternating troll filter (never restores to normal)
    const filterToApply = TROLL_FILTERS[(nextCount - 1) % TROLL_FILTERS.length];
    document.documentElement.style.filter = filterToApply;
  };

  return (
    <button
      type="button"
      className={`troll-invert-toggle ${className}`}
      style={style}
      onClick={handleClick}
      title="Invert screen colors"
      aria-label="Invert Colors"
    >
      <span className="invert-toggle-icon">🎨</span>
      <span className="invert-toggle-label">Invert Colors</span>
      <span className={`invert-switch-track ${checked ? "is-active" : ""}`}>
        <span className="invert-switch-thumb" />
      </span>
    </button>
  );
};
