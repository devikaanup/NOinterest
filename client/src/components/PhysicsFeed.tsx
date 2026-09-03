import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Matter from "matter-js";

export type Pin = {
  id: string;
  title: string;
  imageUrl: string;
  topic: string;
  description?: string;
  author?: string;
  saveCount?: number;
};

const PIN_TONES = [
  "#ff5ca8",
  "#a8ff00",
  "#ff8c2e",
  "#65d6e8",
  "#8f7bff",
  "#ffe05b",
  "#ef6f6f",
  "#8ce0a3",
];

export function dashboardTone(index: number) {
  return PIN_TONES[index % PIN_TONES.length];
}

export function PinPlaceholder({
  pin,
  index,
  large = false,
}: {
  pin: Pin;
  index: number;
  large?: boolean;
}) {
  return (
    <div
      className={`pin-art ${large ? "pin-art-large" : ""}`}
      style={{
        background: `linear-gradient(${115 + index * 21}deg, ${dashboardTone(index)}, ${dashboardTone(index + 3)})`,
      }}
    >
      <span>{pin.topic}</span>
      <b>#{(index % 18) + 1}</b>
      <i className={`art-sticker sticker-${index % 5}`} />
    </div>
  );
}

export function getCardDimensions(index: number) {
  const width = 230;
  let height = 220;
  if (index % 3 === 0) height = 295;
  else if (index % 4 === 0) height = 255;
  return { width, height };
}

export const ARENA_HEIGHT = 2200;

interface PhysicsFeedProps {
  pins: Pin[];
  onSelectPin: (pin: Pin) => void;
  onThudSound: () => void;
  isPaused: boolean;
}

export default function PhysicsFeed({
  pins,
  onSelectPin,
  onThudSound,
  isPaused,
}: PhysicsFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const cardBodiesRef = useRef<Record<string, Matter.Body>>({});
  const animationFrameRef = useRef<number | null>(null);
  const spawnTimersRef = useRef<number[]>([]);
  const lastThudRef = useRef(0);
  const [spawnedPinIds, setSpawnedPinIds] = useState<Set<string>>(new Set());

  // Drag interaction tracking
  const activeDragRef = useRef<{
    body: Matter.Body;
    constraint: Matter.Constraint;
    pin: Pin;
    startX: number;
    startY: number;
    startTime: number;
    hasMoved: boolean;
  } | null>(null);

  // Initialize Matter.js engine and static boundaries
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { Engine, Bodies, Composite } = Matter;

    const engine = Engine.create({
      enableSleeping: true,
      gravity: { x: 0, y: 1.6, scale: 0.001 },
    });
    engineRef.current = engine;

    const width = container.clientWidth || window.innerWidth;
    const height = ARENA_HEIGHT;

    // Thick static boundaries to prevent any tunneling
    const floor = Bodies.rectangle(width / 2, height + 40, width * 3, 80, {
      isStatic: true,
      label: "boundary-floor",
      friction: 0.88,
      restitution: 0.22,
    });

    const leftWall = Bodies.rectangle(-40, height / 2, 80, height * 3, {
      isStatic: true,
      label: "boundary-left",
      friction: 0.3,
      restitution: 0.2,
    });

    const rightWall = Bodies.rectangle(width + 40, height / 2, 80, height * 3, {
      isStatic: true,
      label: "boundary-right",
      friction: 0.3,
      restitution: 0.2,
    });

    const ceiling = Bodies.rectangle(width / 2, -2500, width * 3, 80, {
      isStatic: true,
      label: "boundary-ceiling",
    });

    Composite.add(engine.world, [floor, leftWall, rightWall, ceiling]);

    // Handle window resize to adjust wall and floor positions
    const handleResize = () => {
      if (!containerRef.current || !engineRef.current) return;
      const newWidth = containerRef.current.clientWidth || window.innerWidth;
      const newHeight = ARENA_HEIGHT;

      Matter.Body.setPosition(floor, { x: newWidth / 2, y: newHeight + 40 });
      Matter.Body.setPosition(leftWall, { x: -40, y: newHeight / 2 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 40, y: newHeight / 2 });
    };

    window.addEventListener("resize", handleResize);

    // Collision listener for realistic impact thud sound
    Matter.Events.on(engine, "collisionStart", (event) => {
      const now = performance.now();
      for (const pair of event.pairs) {
        const bodyA = pair.bodyA as any;
        const bodyB = pair.bodyB as any;

        let shouldThud = false;
        if (bodyA.isCard && !bodyA.hasCollided) {
          bodyA.hasCollided = true;
          shouldThud = true;
        }
        if (bodyB.isCard && !bodyB.hasCollided) {
          bodyB.hasCollided = true;
          shouldThud = true;
        }

        if (shouldThud && now - lastThudRef.current > 40) {
          lastThudRef.current = now;
          onThudSound();
        }
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      Matter.Events.off(engine, "collisionStart", () => {});
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
      engineRef.current = null;
    };
  }, [onThudSound]);

  // Spawning cards with staggered entrance
  useEffect(() => {
    const engine = engineRef.current;
    const container = containerRef.current;
    if (!engine || !container || !pins.length) return;

    // Clear any previous spawn timers and existing card bodies
    spawnTimersRef.current.forEach((t) => window.clearTimeout(t));
    spawnTimersRef.current = [];

    const existingBodies = Object.values(cardBodiesRef.current);
    if (existingBodies.length) {
      Matter.Composite.remove(engine.world, existingBodies);
      cardBodiesRef.current = {};
    }

    setSpawnedPinIds(new Set());

    const containerWidth = container.clientWidth || window.innerWidth;

    pins.forEach((pin, index) => {
      const { width: cardWidth, height: cardHeight } = getCardDimensions(index);

      // Stagger spawn times ~30-80ms apart
      const delay = index * (35 + Math.random() * 40);

      const timer = window.setTimeout(() => {
        if (!engineRef.current) return;

        const spawnMargin = cardWidth / 2 + 15;
        const spawnX =
          spawnMargin +
          Math.random() * Math.max(20, containerWidth - spawnMargin * 2);
        const spawnY = -cardHeight - 20 - Math.random() * 80;
        const initialAngle = (Math.random() - 0.5) * 0.45; // ~ -13° to +13°
        const initialVx = (Math.random() - 0.5) * 3.5;
        const initialVy = 6 + Math.random() * 5;
        const initialAv = (Math.random() - 0.5) * 0.04;

        const body = Matter.Bodies.rectangle(spawnX, spawnY, cardWidth, cardHeight, {
          chamfer: { radius: 5 },
          restitution: 0.22,
          friction: 0.85,
          frictionAir: 0.024,
          density: 0.0022,
          sleepThreshold: 22,
          label: `card-${pin.id}`,
        });

        const customBody = body as any;
        customBody.isCard = true;
        customBody.pinId = pin.id;
        customBody.hasCollided = false;
        customBody.cardWidth = cardWidth;
        customBody.cardHeight = cardHeight;

        Matter.Body.setVelocity(body, { x: initialVx, y: initialVy });
        Matter.Body.setAngularVelocity(body, initialAv);
        Matter.Body.setAngle(body, initialAngle);

        Matter.Composite.add(engine.world, body);
        cardBodiesRef.current[pin.id] = body;

        setSpawnedPinIds((prev) => {
          const next = new Set(prev);
          next.add(pin.id);
          return next;
        });
      }, delay);

      spawnTimersRef.current.push(timer);
    });

    return () => {
      spawnTimersRef.current.forEach((t) => window.clearTimeout(t));
      spawnTimersRef.current = [];
    };
  }, [pins]);

  // Main physics update and DOM transform synchronization loop
  useEffect(() => {
    if (isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;

      const engine = engineRef.current;
      if (engine) {
        Matter.Engine.update(engine, delta);

        // Sync DOM card elements to physics body positions directly without React re-renders
        const bodies = cardBodiesRef.current;
        for (const pinId in bodies) {
          const body = bodies[pinId];
          const el = cardRefs.current[pinId];
          if (body && el) {
            const { cardWidth, cardHeight } = body as any;
            const x = body.position.x - cardWidth / 2;
            const y = body.position.y - cardHeight / 2;
            const deg = (body.angle * 180) / Math.PI;
            el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPaused]);

  // Mouse / Pointer drag interaction handlers
  const handlePointerDown = (pin: Pin, e: ReactPointerEvent<HTMLElement>) => {
    const container = containerRef.current;
    const engine = engineRef.current;
    const body = cardBodiesRef.current[pin.id];
    if (!container || !engine || !body) return;

    // Prevent default touch/drag behavior
    e.preventDefault();

    // Wake up target body and surrounding bodies
    Matter.Sleeping.set(body, false);

    const rect = container.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    // Create a physical spring constraint linking mouse to point on card
    const constraint = Matter.Constraint.create({
      pointA: { x: pointerX, y: pointerY },
      bodyB: body,
      pointB: { x: pointerX - body.position.x, y: pointerY - body.position.y },
      stiffness: 0.35,
      damping: 0.08,
      length: 0,
      render: { visible: false },
    });

    Matter.Composite.add(engine.world, constraint);

    activeDragRef.current = {
      body,
      constraint,
      pin,
      startX: e.clientX,
      startY: e.clientY,
      startTime: performance.now(),
      hasMoved: false,
    };

    const handleWindowPointerMove = (moveEvent: PointerEvent) => {
      const active = activeDragRef.current;
      if (!active || !containerRef.current) return;

      const cRect = containerRef.current.getBoundingClientRect();
      const currentX = moveEvent.clientX - cRect.left;
      const currentY = moveEvent.clientY - cRect.top;

      active.constraint.pointA = { x: currentX, y: currentY };
      Matter.Sleeping.set(active.body, false);

      const dist = Math.hypot(
        moveEvent.clientX - active.startX,
        moveEvent.clientY - active.startY
      );
      if (dist > 8) {
        active.hasMoved = true;
      }
    };

    const handleWindowPointerUp = () => {
      const active = activeDragRef.current;
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);

      if (!active) return;

      if (engineRef.current) {
        Matter.Composite.remove(engineRef.current.world, active.constraint);
      }

      // Distinguish click from drag using movement threshold & duration
      const duration = performance.now() - active.startTime;
      if (!active.hasMoved && duration < 380) {
        onSelectPin(active.pin);
      }

      activeDragRef.current = null;
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
  };

  return (
    <main className="physics-feed-container" ref={containerRef}>
      {pins.map((pin, index) => {
        const { width, height } = getCardDimensions(index);
        const isSpawned = spawnedPinIds.has(pin.id);

        return (
          <article
            key={pin.id}
            ref={(el) => {
              cardRefs.current[pin.id] = el;
            }}
            className={`pin-card physics-card ${isSpawned ? "is-visible" : "is-hidden"}`}
            style={{
              width: `${width}px`,
              minHeight: `${height}px`,
            }}
            onPointerDown={(e) => handlePointerDown(pin, e)}
          >
            <div className="pin-card-inner">
              <PinPlaceholder pin={pin} index={index} />
              <div className="pin-info">
                <h2>{pin.title}</h2>
                <p>
                  {pin.author} · {pin.saveCount} saves
                </p>
              </div>
            </div>
          </article>
        );
      })}
      <div className="physics-feed-platform" style={{ top: `${ARENA_HEIGHT - 6}px` }}>
        <div className="platform-hazard-bar" />
        <div className="platform-label">
          <span>▼ THE GROUND FLOOR · CARD PILE ZONE ▼</span>
        </div>
      </div>
    </main>
  );
}
