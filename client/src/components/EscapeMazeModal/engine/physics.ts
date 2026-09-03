import { Obstacle, Player } from './types';
import { START_ZONE, CORRIDOR, EXIT_ZONE } from './constants';

export function checkCircleBoxCollision(circle: Obstacle, box: Player): boolean {
  const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.size));
  const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.size));
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;
  return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
}

export function isWithinMazeBounds(x: number, y: number, size: number): boolean {
  // Global horizontal bounds: left wall of start zone to right wall of exit zone
  if (x < START_ZONE.x || x + size > EXIT_ZONE.x + EXIT_ZONE.width) {
    return false;
  }

  // Purely inside start zone
  if (x + size <= CORRIDOR.x) {
    return y >= START_ZONE.y && y + size <= START_ZONE.y + START_ZONE.height;
  }

  // Purely inside exit zone
  if (x >= EXIT_ZONE.x) {
    return y >= EXIT_ZONE.y && y + size <= EXIT_ZONE.y + EXIT_ZONE.height;
  }

  // Inside corridor or crossing seams (x + size > 190 and x < 610)
  // Must respect corridor vertical opening
  return y >= CORRIDOR.y && y + size <= CORRIDOR.y + CORRIDOR.height;
}

export function isExitReached(x: number, size: number): boolean {
  return (x + size) >= EXIT_ZONE.x;
}

export function rotateVector(dx: number, dy: number, angle: number): { x: number; y: number } {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  return {
    x: dx * cosA - dy * sinA,
    y: dx * sinA + dy * cosA
  };
}

export function getRotationSpeedMultiplier(
  fails: number,
  increment = 0.05,
  maxMultiplier = 2.0
): number {
  return Math.min(maxMultiplier, 1.0 + fails * increment);
}
