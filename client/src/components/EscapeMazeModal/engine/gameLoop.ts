import { GameState, Player, Obstacle } from './types';
import {
  INITIAL_PLAYER_SPAWN,
  INITIAL_OBSTACLES,
  BASE_ANGULAR_SPEED,
  FAIL_SPEED_INCREMENT,
  MAX_ROTATION_SPEED_MULTIPLIER
} from './constants';
import {
  checkCircleBoxCollision,
  isWithinMazeBounds,
  isExitReached,
  rotateVector,
  getRotationSpeedMultiplier
} from './physics';

export function createInitialGameState(): GameState {
  return {
    player: { ...INITIAL_PLAYER_SPAWN },
    obstacles: INITIAL_OBSTACLES.map((o) => ({ ...o })),
    fails: 0,
    hasEscaped: false,
    isHitFlashing: false,
    flashTimestamp: 0,
    rotationAngle: 0
  };
}

export function updateGameState(
  prevState: GameState,
  activeKeys: Set<string>,
  now: number,
  deltaSec: number = 1 / 60
): GameState {
  if (prevState.hasEscaped) {
    return prevState;
  }

  // 1. Advance Maze Rotation
  const speedMultiplier = getRotationSpeedMultiplier(
    prevState.fails,
    FAIL_SPEED_INCREMENT,
    MAX_ROTATION_SPEED_MULTIPLIER
  );
  const angularVelocity = BASE_ANGULAR_SPEED * speedMultiplier;
  const newRotationAngle = (prevState.rotationAngle + angularVelocity * deltaSec) % (2 * Math.PI);

  // 2. Calculate Raw Player Movement Direction
  let dx = 0;
  let dy = 0;

  if (activeKeys.has('ArrowUp') || activeKeys.has('KeyW') || activeKeys.has('w') || activeKeys.has('W')) dy -= 1;
  if (activeKeys.has('ArrowDown') || activeKeys.has('KeyS') || activeKeys.has('s') || activeKeys.has('S')) dy += 1;
  if (activeKeys.has('ArrowLeft') || activeKeys.has('KeyA') || activeKeys.has('a') || activeKeys.has('A')) dx -= 1;
  if (activeKeys.has('ArrowRight') || activeKeys.has('KeyD') || activeKeys.has('d') || activeKeys.has('D')) dx += 1;

  let newPlayerX = prevState.player.x;
  let newPlayerY = prevState.player.y;

  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy);
    const normX = dx / length;
    const normY = dy / length;

    // Un-rotate the input vector by -rotationAngle to map screen-relative inputs back into logic space
    const unrotated = rotateVector(normX, normY, -prevState.rotationAngle);
    const moveX = unrotated.x * prevState.player.speed;
    const moveY = unrotated.y * prevState.player.speed;

    // Slide along X if valid
    if (isWithinMazeBounds(prevState.player.x + moveX, prevState.player.y, prevState.player.size)) {
      newPlayerX += moveX;
    }
    // Slide along Y if valid
    if (isWithinMazeBounds(newPlayerX, prevState.player.y + moveY, prevState.player.size)) {
      newPlayerY += moveY;
    }
  }

  const updatedPlayer: Player = {
    ...prevState.player,
    x: newPlayerX,
    y: newPlayerY
  };

  // 3. Update Obstacles Patrol (Unchanged in logic space)
  const updatedObstacles: Obstacle[] = prevState.obstacles.map((obs) => {
    let newY = obs.y + obs.speedY;
    let newSpeedY = obs.speedY;

    if (newY <= obs.minY) {
      newY = obs.minY;
      newSpeedY = Math.abs(obs.speedY);
    } else if (newY >= obs.maxY) {
      newY = obs.maxY;
      newSpeedY = -Math.abs(obs.speedY);
    }

    return {
      ...obs,
      y: newY,
      speedY: newSpeedY
    };
  });

  // 4. Check Collisions with Obstacles
  let collisionDetected = false;
  for (const obs of updatedObstacles) {
    if (checkCircleBoxCollision(obs, updatedPlayer)) {
      collisionDetected = true;
      break;
    }
  }

  if (collisionDetected) {
    return {
      ...prevState,
      player: { ...INITIAL_PLAYER_SPAWN },
      obstacles: updatedObstacles,
      fails: prevState.fails + 1,
      isHitFlashing: true,
      flashTimestamp: now,
      rotationAngle: newRotationAngle
    };
  }

  // 5. Hit Flash Duration (120ms)
  const isHitFlashing = prevState.isHitFlashing && (now - prevState.flashTimestamp < 120);

  // 6. Check Escape Condition
  const hasEscaped = isExitReached(updatedPlayer.x, updatedPlayer.size);

  return {
    ...prevState,
    player: updatedPlayer,
    obstacles: updatedObstacles,
    isHitFlashing,
    hasEscaped,
    rotationAngle: newRotationAngle
  };
}
