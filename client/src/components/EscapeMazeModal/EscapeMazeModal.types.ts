export interface EscapeMazeModalProps {
  /** Controls modal visibility */
  isOpen: boolean;

  /** Fired when player reaches the right green exit zone */
  onEscape: () => void;

  /** Optional title instruction banner (default: "Reach the other side to exit.") */
  title?: string;

  /** Optional custom class name for the modal overlay container */
  className?: string;
}
