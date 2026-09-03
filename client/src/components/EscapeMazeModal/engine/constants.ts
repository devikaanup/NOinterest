import { Rect, Obstacle } from './types';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;

export const START_ZONE: Rect = {
  x: 50,
  y: 80,
  width: 140,
  height: 240
};

export const EXIT_ZONE: Rect = {
  x: 610,
  y: 80,
  width: 140,
  height: 240
};

export const CORRIDOR: Rect = {
  x: 190,
  y: 130,
  width: 420,
  height: 140
};

export const INITIAL_PLAYER_SPAWN = {
  x: 100,
  y: 190,
  size: 22,
  speed: 3.5
};

export const INITIAL_OBSTACLES: Obstacle[] = [
  { id: 1, x: 265, y: 145, radius: 12, minY: 145, maxY: 255, speedY: 4.2 },
  { id: 2, x: 355, y: 255, radius: 12, minY: 145, maxY: 255, speedY: -4.2 },
  { id: 3, x: 445, y: 145, radius: 12, minY: 145, maxY: 255, speedY: 4.2 },
  { id: 4, x: 535, y: 255, radius: 12, minY: 145, maxY: 255, speedY: -4.2 }
];

export const COLORS = {
  bgLight: '#b5a0f8',
  bgChecker: '#a790f1',
  startExitGreen: '#b5f5b5',
  corridorWhite: '#ffffff',
  wallBorder: '#000000',
  playerRed: '#ff0000',
  playerBorder: '#990000',
  obstacleBlue: '#0000ff',
  obstacleBorder: '#000088'
};

export const BASE_ROTATION_PERIOD_SEC = 25;
export const BASE_ANGULAR_SPEED = (2 * Math.PI) / BASE_ROTATION_PERIOD_SEC;
export const FAIL_SPEED_INCREMENT = 0.05;
export const MAX_ROTATION_SPEED_MULTIPLIER = 2.0;
