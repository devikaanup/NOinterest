import { GameState } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  START_ZONE,
  CORRIDOR,
  EXIT_ZONE,
  COLORS
} from './constants';

export function renderGame(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.save();

  // 1. Base background fill (unrotated screen space)
  ctx.fillStyle = COLORS.bgLight;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 2. Rotate World Canvas Transform around Canvas Center
  ctx.save();
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate(state.rotationAngle);
  ctx.translate(-centerX, -centerY);

  // Rotating outer checkerboard pattern (oversized to cover full rotation circle)
  const tileSize = 20;
  ctx.fillStyle = COLORS.bgChecker;
  for (let x = -200; x < CANVAS_WIDTH + 200; x += tileSize) {
    for (let y = -200; y < CANVAS_HEIGHT + 200; y += tileSize) {
      if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

  // 3. Fill Start Zone (Green)
  ctx.fillStyle = COLORS.startExitGreen;
  ctx.fillRect(START_ZONE.x, START_ZONE.y, START_ZONE.width, START_ZONE.height);

  // 4. Fill Corridor (White)
  ctx.fillStyle = COLORS.corridorWhite;
  ctx.fillRect(CORRIDOR.x, CORRIDOR.y, CORRIDOR.width, CORRIDOR.height);

  // Subtle checkerboard grid inside corridor
  ctx.fillStyle = '#f6f6f9';
  const corridorTile = 20;
  for (let x = CORRIDOR.x; x < CORRIDOR.x + CORRIDOR.width; x += corridorTile) {
    for (let y = CORRIDOR.y; y < CORRIDOR.y + CORRIDOR.height; y += corridorTile) {
      if ((Math.floor(x / corridorTile) + Math.floor(y / corridorTile)) % 2 === 0) {
        ctx.fillRect(x, y, Math.min(corridorTile, CORRIDOR.x + CORRIDOR.width - x), Math.min(corridorTile, CORRIDOR.y + CORRIDOR.height - y));
      }
    }
  }

  // 5. Fill Exit Zone (Green)
  ctx.fillStyle = COLORS.startExitGreen;
  ctx.fillRect(EXIT_ZONE.x, EXIT_ZONE.y, EXIT_ZONE.width, EXIT_ZONE.height);

  // Subtle checkered grid inside start & exit zones
  ctx.fillStyle = '#a5e8a5';
  const zoneTile = 20;
  [START_ZONE, EXIT_ZONE].forEach((zone) => {
    for (let x = zone.x; x < zone.x + zone.width; x += zoneTile) {
      for (let y = zone.y; y < zone.y + zone.height; y += zoneTile) {
        if ((Math.floor(x / zoneTile) + Math.floor(y / zoneTile)) % 2 === 0) {
          ctx.fillRect(x, y, Math.min(zoneTile, zone.x + zone.width - x), Math.min(zoneTile, zone.y + zone.height - y));
        }
      }
    }
  });

  // 6. Draw Unified Outer Perimeter Walls (Black Outline)
  ctx.strokeStyle = COLORS.wallBorder;
  ctx.lineWidth = 3.5;
  ctx.lineJoin = 'miter';
  ctx.beginPath();
  ctx.moveTo(50, 80);
  ctx.lineTo(190, 80);
  ctx.lineTo(190, 130);
  ctx.lineTo(610, 130);
  ctx.lineTo(610, 80);
  ctx.lineTo(750, 80);
  ctx.lineTo(750, 320);
  ctx.lineTo(610, 320);
  ctx.lineTo(610, 270);
  ctx.lineTo(190, 270);
  ctx.lineTo(190, 320);
  ctx.lineTo(50, 320);
  ctx.closePath();
  ctx.stroke();

  // Zone text markers
  ctx.font = 'bold 11px "Press Start 2P", monospace';
  ctx.fillStyle = '#2d6a2d';
  ctx.textAlign = 'center';
  ctx.fillText('START', START_ZONE.x + START_ZONE.width / 2, START_ZONE.y + 30);
  ctx.fillText('EXIT', EXIT_ZONE.x + EXIT_ZONE.width / 2, EXIT_ZONE.y + 30);

  // 7. Draw Obstacles (Blue Balls in logic space)
  state.obstacles.forEach((obs) => {
    ctx.beginPath();
    ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.obstacleBlue;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = COLORS.obstacleBorder;
    ctx.stroke();

    // Specular highlight dot
    ctx.beginPath();
    ctx.arc(obs.x - obs.radius * 0.35, obs.y - obs.radius * 0.35, obs.radius * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#80aaff';
    ctx.fill();
  });

  // 8. Draw Player (Counter-rotated by -rotationAngle around its center so square stays upright)
  const { player } = state;
  const playerCenterX = player.x + player.size / 2;
  const playerCenterY = player.y + player.size / 2;

  ctx.save();
  ctx.translate(playerCenterX, playerCenterY);
  ctx.rotate(-state.rotationAngle);
  ctx.translate(-playerCenterX, -playerCenterY);

  ctx.fillStyle = COLORS.playerRed;
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = COLORS.playerBorder;
  ctx.strokeRect(player.x, player.y, player.size, player.size);

  // Subtle inner player center detail
  ctx.fillStyle = '#ff6666';
  ctx.fillRect(player.x + 4, player.y + 4, player.size - 8, player.size - 8);

  ctx.restore();

  // Restore World Transform
  ctx.restore();

  // 9. Screen-Aligned Overlays (Unrotated)
  // Hit Flash Effect on Collision
  if (state.isHitFlashing) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.28)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // Victory Flash
  if (state.hasEscaped) {
    ctx.fillStyle = 'rgba(181, 245, 181, 0.5)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  ctx.restore();
}
