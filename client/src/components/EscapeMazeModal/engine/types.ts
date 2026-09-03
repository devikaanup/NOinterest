export interface Player {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  radius: number;
  minY: number;
  maxY: number;
  speedY: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameState {
  player: Player;
  obstacles: Obstacle[];
  fails: number;
  hasEscaped: boolean;
  isHitFlashing: boolean;
  flashTimestamp: number;
  rotationAngle: number;
}
