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
  // Start with invert colors OFF so dark red/black background color scheme shines
  const [checked, setChecked] = useState<boolean>(false);

  React.useEffect(() => {
    document.documentElement.style.filter = "none";
  }, []);

  const handleClick = () => {
    if (checked) {
      // Turning OFF: make everything completely normal again
      document.documentElement.style.filter = "none";
      setChecked(false);
    } else {
      // Turning ON: invert colors
      document.documentElement.style.filter = "invert(1)";
      setChecked(true);
    }
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
