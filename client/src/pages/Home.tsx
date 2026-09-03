import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import PhysicsFeed, { type Pin, PinPlaceholder, dashboardTone } from "@/components/PhysicsFeed";
import { EscapeMazeModal } from "@/components/EscapeMazeModal";
import { WaterPourCaptcha } from "@/components/WaterPourCaptcha";
import { InvertColorsToggle } from "@/components/InvertColorsToggle";
import { TurnOffButton } from "@/components/TurnOffModal";
import { ConnectToInternetButton } from "@/components/WiringTaskModal";
import { LuckCheckModal } from "@/components/LuckCheckModal";
import { getPlaceholderImage } from "@/utils/getPlaceholderImage";

type Tile = {
  id: number;
  color: string;
  shape: number;
};

type Position = {
  left: number;
  top: number;
};

const PROMPTS = [
  "Select all squares containing traffic lights.",
  "Select all squares containing the sound of a sigh.",
];

const REJECTIONS = [
  "Incorrect. Try again.",
];

const TILE_COLORS = [
  "#f3b3a8",
  "#b8d7c5",
  "#f1d58b",
  "#b8c8ea",
  "#d9b7d7",
  "#b9d9dc",
  "#e3c2a7",
  "#c7cfaa",
  "#efb9c5",
];

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function makeTiles(): Tile[] {
  return Array.from({ length: 9 }, (_, id) => ({
    id,
    color: TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)],
    shape: Math.floor(Math.random() * 5),
  }));
}

function Squiggle({ variant }: { variant: number }) {
  const paths = [
    "M7 29 C14 9 21 38 29 17 S45 9 51 27",
    "M6 17 C15 31 21 9 31 24 S43 37 52 13",
    "M7 27 Q17 3 27 25 T51 20",
    "M8 12 Q26 12 20 31 T50 30",
    "M8 30 C16 17 17 33 28 18 C37 5 41 29 51 12",
  ];

  return (
    <svg className="tile-squiggle" viewBox="0 0 58 42" aria-hidden="true">
      <path d={paths[variant % paths.length]} />
      {variant === 2 && <circle cx="44" cy="10" r="3" />}
      {variant === 4 && <path d="M9 9 l5 5 M46 29 l5 5" />}
    </svg>
  );
}

function Dino() {
  return (
    <div className="dino-track" aria-hidden="true">
      <svg className="dino" viewBox="0 0 230 126" role="img" aria-label="A doodled dinosaur stomping by">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
          <path d="M21 96 C18 76 27 63 43 58 C45 39 59 24 79 22 C95 20 109 27 117 38 C128 32 141 35 147 44 C158 42 174 46 184 57 C194 69 197 85 190 96 L176 98" />
          <path d="M42 58 C32 53 23 53 14 59 L25 68" />
          <path d="M119 39 C122 23 134 11 151 10 C164 9 174 17 176 28 C164 27 154 31 147 44" />
          <path d="M164 14 L176 7 M153 12 L153 1 M173 21 L187 18" />
          <path d="M175 54 L198 43 L211 45 L198 58" />
          <path d="M69 92 L66 116 L52 120 M111 94 L113 117 L101 121 M158 95 L159 116 L146 120" />
          <path d="M50 120 L68 120 M99 121 L117 121 M144 120 L163 120" />
          <path d="M76 36 L83 36 M73 47 C83 51 92 51 99 47" />
          <circle cx="145" cy="24" r="3" fill="currentColor" />
          <path d="M34 80 C51 83 65 82 79 76" />
        </g>
      </svg>
    </div>
  );
}

function useAudioEngine() {
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const musicTimerRef = useRef<number | null>(null);
  const volumeTimerRef = useRef<number | null>(null);
  const mosquitoRef = useRef<OscillatorNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const clickIndexRef = useRef(0);
  const musicVolumeRef = useRef(0.04);
  const startedRef = useRef(false);

  const makeNoiseBuffer = useCallback((ctx: AudioContext, seconds: number) => {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }, []);

  const playTone = useCallback((
    ctx: AudioContext,
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    start = ctx.currentTime,
    endFrequency?: number,
    destination?: AudioNode,
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    if (endFrequency) osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(destination ?? masterRef.current!);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }, []);

  const playClick = useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx || !masterRef.current) return;
    const now = ctx.currentTime;
    const index = clickIndexRef.current;
    clickIndexRef.current = (index + 1) % 6;

    if (index === 0) {
      playTone(ctx, 410, 0.46, "sawtooth", 0.12, now, 1780);
      playTone(ctx, 770, 0.32, "square", 0.1, now + 0.05, 240);
      const noise = ctx.createBufferSource();
      const gain = ctx.createGain();
      noise.buffer = makeNoiseBuffer(ctx, 0.42);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      noise.connect(gain).connect(masterRef.current);
      noise.start(now);
      noise.stop(now + 0.44);
    } else if (index === 1) {
      playTone(ctx, 880, 0.35, "triangle", 0.28, now);
      playTone(ctx, 1320, 0.42, "sine", 0.22, now + 0.13);
      playTone(ctx, 1760, 0.24, "sine", 0.15, now + 0.22);
    } else if (index === 2) {
      const noise = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      noise.buffer = makeNoiseBuffer(ctx, 0.28);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(920, now + 0.22);
      filter.Q.value = 5;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.32, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
      noise.connect(filter).connect(gain).connect(masterRef.current);
      noise.start(now);
      noise.stop(now + 0.3);
    } else if (index === 3) {
      playTone(ctx, 190, 0.65, "sawtooth", 0.32, now, 80);
      playTone(ctx, 450, 0.5, "square", 0.18, now + 0.02, 170);
    } else if (index === 4) {
      playTone(ctx, 220, 0.66, "sine", 0.32, now, 940);
      playTone(ctx, 640, 0.34, "triangle", 0.14, now + 0.18, 180);
    } else {
      const noise = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      noise.buffer = makeNoiseBuffer(ctx, 0.45);
      filter.type = "highpass";
      filter.frequency.value = 3200;
      gain.gain.setValueAtTime(0.27, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      noise.connect(filter).connect(gain).connect(masterRef.current);
      noise.start(now);
      noise.stop(now + 0.42);
      playTone(ctx, 1380, 0.45, "sine", 0.19, now, 260);
    }
  }, [makeNoiseBuffer, playTone]);

  const playMelody = useCallback(() => {
    const ctx = contextRef.current;
    const musicGain = musicGainRef.current;
    if (!ctx || !musicGain) return;
    const start = ctx.currentTime + 0.04;
    const progression = [
      [261.63, 329.63, 392.0],
      [220, 261.63, 329.63],
      [174.61, 220, 261.63],
      [196, 246.94, 293.66],
    ];
    progression.forEach((chord, chordIndex) => {
      const chordStart = start + chordIndex * 3;
      chord.forEach((frequency, noteIndex) => {
        playTone(ctx, frequency, 2.4, noteIndex === 0 ? "triangle" : "sine", 0.16, chordStart + noteIndex * 0.035, undefined, musicGain);
      });
      playTone(ctx, chord[0] * 2, 0.6, "sine", 0.09, chordStart + 1.2, undefined, musicGain);
      playTone(ctx, chord[1] * 2, 0.6, "sine", 0.075, chordStart + 2.05, undefined, musicGain);
    });
  }, [playTone]);

  const startAudio = useCallback(() => {
    if (startedRef.current) {
      if (contextRef.current?.state === "suspended") void contextRef.current.resume();
      return;
    }
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.72;
    master.connect(ctx.destination);
    const musicGain = ctx.createGain();
    musicGain.gain.value = musicVolumeRef.current;
    musicGain.connect(master);
    const mosquito = ctx.createOscillator();
    const mosquitoGain = ctx.createGain();
    mosquito.type = "sine";
    mosquito.frequency.value = 16000;
    mosquitoGain.gain.value = 0.025;
    mosquito.connect(mosquitoGain).connect(master);
    mosquito.start();

    contextRef.current = ctx;
    masterRef.current = master;
    musicGainRef.current = musicGain;
    mosquitoRef.current = mosquito;
    startedRef.current = true;
    playMelody();
    musicTimerRef.current = window.setInterval(playMelody, 12000);
    volumeTimerRef.current = window.setInterval(() => {
      musicVolumeRef.current = Math.min(0.5, musicVolumeRef.current + 0.02);
      if (musicGainRef.current && contextRef.current) {
        musicGainRef.current.gain.setTargetAtTime(musicVolumeRef.current, contextRef.current.currentTime, 0.08);
      }
    }, 15000);
  }, [playMelody]);

  const stopAudio = useCallback(() => {
    if (musicTimerRef.current) window.clearInterval(musicTimerRef.current);
    if (volumeTimerRef.current) window.clearInterval(volumeTimerRef.current);
    musicTimerRef.current = null;
    volumeTimerRef.current = null;
    try {
      mosquitoRef.current?.stop();
      contextRef.current?.close();
    } catch {
      // The context may already be closed by the browser.
    }
    contextRef.current = null;
    masterRef.current = null;
    musicGainRef.current = null;
    mosquitoRef.current = null;
  }, []);

  return { startAudio, stopAudio, playClick, startedRef };
}

function useAnxiousButton(disabled: boolean) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const moveLockRef = useRef(false);
  const dodgeCountRef = useRef(0);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const button = buttonRef.current;
      if (!button || disabled || moveLockRef.current || dodgeCountRef.current >= 5) return;
      const rect = button.getBoundingClientRect();
      const near = event.clientX >= rect.left - 70 && event.clientX <= rect.right + 70 && event.clientY >= rect.top - 70 && event.clientY <= rect.bottom + 70;
      if (!near) return;

      moveLockRef.current = true;
      dodgeCountRef.current += 1;
      const nextCount = dodgeCountRef.current;
      setDodgeCount(nextCount);
      // Use the current rendered rect instead of React's last requested
      // position. This keeps chained dodges correct during the 180ms glide.
      // A generous inset also keeps the whole button visible in browser and
      // preview frames, not merely its top-left corner.
      const margin = 64;
      const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
      const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
      const dx = rand(60, 160) * (Math.random() > 0.5 ? 1 : -1);
      const dy = rand(60, 160) * (Math.random() > 0.5 ? 1 : -1);
      const currentLeft = rect.left;
      const currentTop = rect.top;
      const targetLeft = Math.min(maxLeft, Math.max(margin, currentLeft + dx));
      const targetTop = Math.min(maxTop, Math.max(margin, currentTop + dy));
      setPosition({ left: currentLeft, top: currentTop });
      requestAnimationFrame(() => setOffset({ x: targetLeft - currentLeft, y: targetTop - currentTop }));
      window.setTimeout(() => {
        setPosition({ left: targetLeft, top: targetTop });
        setOffset({ x: 0, y: 0 });
        moveLockRef.current = false;
      }, 190);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [disabled, position]);

  const style = position
    ? { position: "fixed" as const, left: position.left, top: position.top, transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
    : undefined;

  return { buttonRef, style, dodgeCount };
}

function AppButton({
  children,
  disabled = false,
  onClick,
  className = "",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`app-button ${className}`}
    >
      {children}
    </button>
  );
}

const TOPICS = ["Cats", "Cars", "Food", "Travel", "Fashion", "Architecture", "Nature", "Anime", "Interior Design", "Photography"];

function fetchImagesForTopic(topic: string): Promise<Pin[]> {
  return Promise.resolve(Array.from({ length: 18 }, (_, index) => ({
    id: `${topic}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    title: `${topic} idea #${index + 1}`,
    imageUrl: getPlaceholderImage(300, index % 3 === 0 ? 320 : 260, `${topic}-${index}`),
    topic,
    description: `A completely legitimate visual thought about ${topic.toLowerCase()}, assembled by a machine with no taste.`,
    author: ["someone_online", "mystery_guest", "the_algorithm", "you_probably"][index % 4],
    saveCount: 12 + index * 17,
  })));
}

function useDashboardSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const ensure = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  };
  const tone = (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.12) => {
    const ctx = ensure();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  };
  return { thud: () => tone(92, 0.14, "triangle", 0.16), ding: () => { tone(880, 0.22, "sine", 0.16); tone(1320, 0.28, "sine", 0.11); }, sting: () => { tone(92, 0.6, "sawtooth", 0.22); tone(47, 0.5, "square", 0.1); }, tick: () => tone(520 + Math.random() * 120, 0.05, "square", 0.035) };
}

function Dashboard() {
  const [topic, setTopic] = useState("Cats");
  const [pins, setPins] = useState<Pin[]>([]);
  const [search, setSearch] = useState("");
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [saveStep, setSaveStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [normalColors] = useState(false);
  const [isEscapeMazeOpen, setIsEscapeMazeOpen] = useState(false);
  const [hasEscaped, setHasEscaped] = useState(false);
  const [universe, setUniverse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const sound = useDashboardSound();
  const loadedTopicRef = useRef("");

  const loadPins = useCallback(async (nextTopic: string, append = false) => {
    setLoading(true);
    const result = await fetchImagesForTopic(nextTopic);
    setPins((current) => append ? [...current, ...result] : result);
    setLoading(false);
    loadedTopicRef.current = nextTopic;
  }, []);

  useEffect(() => { void loadPins(topic); }, [loadPins, topic]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 180) {
        if (pageCount >= 4) { setUniverse(true); return; }
        setPageCount((count) => count + 1);
        void loadPins(loadedTopicRef.current || topic, true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadPins, pageCount, topic]);

  const openRoulette = (event: React.FormEvent) => {
    event.preventDefault();
    setRouletteOpen(true);
  };

  const handleEscapeSuccess = () => {
    setIsEscapeMazeOpen(false);
    setHasEscaped(true);
  };

  const closeFake = () => {
    sound.sting();
    setHasEscaped(false);
    setIsEscapeMazeOpen(true);
  };
  const selectPin = (pin: Pin) => { sound.thud(); setSelectedPin(pin); setSaveStep(0); setSaved(false); };

  if (universe) return <div className="universe-screen"><div className="stars" /><div className="universe-copy"><span>THE LAST SCROLL</span><p>You have reached the end of the universe.<br />Your journey is complete.<br /><i>Go back to sleep.</i></p><button onClick={() => { setUniverse(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Wake up</button></div></div>;

  return (
    <div className={`dashboard-page ${normalColors ? "colors-normal" : "colors-inverted"}`}>
      <nav className="interest-nav">
        <div className="interest-logo">NO<span>interest</span><sup>™</sup></div>
        <form className="interest-search" onSubmit={openRoulette}>
          <span>⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for something..." />
          <kbd>↵</kbd>
        </form>
        <div className="troll-toolbar">
          <InvertColorsToggle />
          <ConnectToInternetButton />
          <TurnOffButton />
        </div>
        <button className="fake-x" onClick={closeFake}>×</button>
      </nav>
      {hasEscaped && (
        <section className="escape-banner" aria-live="polite">
          <div className="escape-banner-content">
            <h3>🎉 You escaped! Escape maze cleared!</h3>
            <p>
              The World&apos;s Hardest Game maze was beaten. You broke free of the NOinterest exit lock!
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setHasEscaped(false);
                setIsEscapeMazeOpen(true);
              }}
            >
              Play Again
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setHasEscaped(false)}
            >
              Dismiss
            </button>
          </div>
        </section>
      )}
      <header className="feed-heading">
        <div>
          <span>THE DISCOVERY FEED</span>
          <h1>Ideas for <i>{topic}</i></h1>
        </div>
        <div className="feed-meta">
          <b>{pins.length || "—"}</b>
          <small>THINGS<br />YOU DIDN'T ASK FOR</small>
        </div>
      </header>
      <PhysicsFeed
        pins={pins}
        onSelectPin={selectPin}
        onThudSound={sound.thud}
        isPaused={isEscapeMazeOpen || universe}
      />
      {loading && <div className="feed-loading">fetching more questionable inspiration...</div>}
      {normalColors && <div className="colors-toast">Fine. You earned normal colours.</div>}
      <LuckCheckModal
        isOpen={rouletteOpen}
        searchTerm={search}
        onClose={(resultTopic) => {
          setRouletteOpen(false);
          if (resultTopic) {
            setTopic(resultTopic);
            setPageCount(1);
          }
        }}
      />
      {selectedPin && (
        <div className="modal-backdrop">
          <div className="pin-detail-modal">
            <button className="modal-close" onClick={() => setSelectedPin(null)}>×</button>
            <PinPlaceholder pin={selectedPin} index={pins.indexOf(selectedPin)} large />
            <div className="detail-copy">
              <span>{selectedPin.topic}</span>
              <h2>{selectedPin.title}</h2>
              <p>{selectedPin.description}</p>
              <small>posted by <b>{selectedPin.author}</b></small>
              <div className="detail-actions">
                {saved ? (
                  <strong>Fine. Saved.</strong>
                ) : saveStep === 0 ? (
                  <button onClick={() => setSaveStep(1)}>Save</button>
                ) : saveStep === 1 ? (
                  <div>
                    <p>Save this pin?</p>
                    <button onClick={() => setSaveStep(2)}>Yes</button>
                    <button onClick={() => setSelectedPin(null)}>No</button>
                  </div>
                ) : (
                  <div>
                    <p>Are you sure?</p>
                    <button onClick={() => { setSaved(true); setSaveStep(3); }}>Yes</button>
                    <button onClick={() => setSaveStep(0)}>No</button>
                  </div>
                )}
                <button className="share-button" onClick={() => navigator.clipboard?.writeText(selectedPin.title)}>Share</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escape Maze Modal Game */}
      <EscapeMazeModal
        isOpen={isEscapeMazeOpen}
        onEscape={handleEscapeSuccess}
        title="Reach the other side to exit."
      />
    </div>
  );
}

const invertAtbashChar = (char: string): string => {
  const code = char.charCodeAt(0);
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(122 - (code - 97));
  }
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(90 - (code - 65));
  }
  return char;
};

const invertAtbashString = (str: string): string => {
  return str.split("").map(invertAtbashChar).join("");
};

const RGB_CYCLE_COLORS = [
  "#ff2a5f", // neon pink
  "#00d2ff", // electric cyan
  "#05df72", // neon green
  "#ffd600", // electric yellow
  "#a855f7", // purple
  "#ff6b00", // orange
  "#3b82f6", // blue
  "#ec4899", // hot pink
];

export default function Home() {
  const [round, setRound] = useState(0);
  const [tiles, setTiles] = useState<Tile[]>(() => makeTiles());
  const [selected, setSelected] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isChaos, setIsChaos] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [jitter, setJitter] = useState({ x: 0, y: 0, rotate: 0 });
  const [success, setSuccess] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [rgbIndex, setRgbIndex] = useState(0);
  const audio = useAudioEngine();
  const completeRef = useRef(false);
  const chaosTimeoutRef = useRef<number | null>(null);

  // 2s RGB background color cycle timer
  useEffect(() => {
    const timer = window.setInterval(() => {
      setRgbIndex((idx) => (idx + 1) % RGB_CYCLE_COLORS.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  // Inverted keyboard: a->z, b->y, etc.
  const handleInvertedKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const inverted = invertAtbashChar(e.key);
      if (inverted !== e.key) {
        e.preventDefault();
        const input = e.currentTarget;
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        const val = input.value;
        const nextVal = val.slice(0, start) + inverted + val.slice(end);
        setter(nextVal);
        setFormMessage("");
        requestAnimationFrame(() => {
          input.setSelectionRange(start + 1, start + 1);
        });
      }
    }
  };

  const handleInvertedPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const inverted = invertAtbashString(text);
    const input = e.currentTarget;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const val = input.value;
    const nextVal = val.slice(0, start) + inverted + val.slice(end);
    setter(nextVal);
    setFormMessage("");
    requestAnimationFrame(() => {
      input.setSelectionRange(start + inverted.length, start + inverted.length);
    });
  };

  const triggerDino = useCallback(() => {
    if (completeRef.current) return;
    setIsChaos(true);
    const jitterTimer = window.setInterval(() => {
      setJitter({ x: rand(-4, 4), y: rand(-4, 4), rotate: rand(-1, 1) });
    }, 120);
    chaosTimeoutRef.current = window.setTimeout(() => {
      window.clearInterval(jitterTimer);
      setIsChaos(false);
      setJitter({ x: 0, y: 0, rotate: 0 });
    }, 10000);
  }, []);

  useEffect(() => {
    const onDocumentClick = () => {
      if (completeRef.current) return;
      audio.startAudio();
      setAudioReady(true);
      audio.playClick();
    };
    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [audio]);

  useEffect(() => {
    if (!audioReady) return;
    const scheduleDino = () => window.setTimeout(() => {
      triggerDino();
      scheduleDino();
    }, rand(20000, 40000));
    const timer = scheduleDino();
    return () => {
      window.clearTimeout(timer);
      if (chaosTimeoutRef.current) window.clearTimeout(chaosTimeoutRef.current);
    };
  }, [audioReady, triggerDino]);

  const signIn = () => {
    if (!username.trim() || !password.trim()) {
      setFormMessage("Please enter literally anything in both fields.");
      return;
    }
    completeRef.current = true;
    audio.stopAudio();
    setSuccess(true);
  };

  if (success) return <Dashboard />;

  return (
    <main
      className={`page-shell ${isChaos ? "is-chaos" : ""}`}
      style={{ backgroundColor: RGB_CYCLE_COLORS[rgbIndex] }}
    >
      {/* Moving upside-down purple evil horn emoji wallpaper */}
      <div className="evil-emoji-wallpaper" aria-hidden="true" />
      {isChaos && <Dino />}
      <div className="noise-layer" aria-hidden="true" />
      <div className="shell-ornament ornament-left" aria-hidden="true">01 / THE GAUNTLET</div>
      <div className="shell-ornament ornament-right" aria-hidden="true">NO REAL AUTH · NO MERCY</div>
      <section className="card-wrap" style={{ transform: `translate3d(${jitter.x}px, ${jitter.y}px, 0) rotate(${jitter.rotate}deg)` }}>
        <div className="topline">
          <div className="mark"><span className="mark-dot" /> TG / 001</div>
          <div className="topline-note">A sign-in experience</div>
        </div>
        <div className="hero-copy">
          <span className="eyebrow">WELCOME, PROBABLY</span>
          <h1>Sign in to continue<span className="period">.</span></h1>
          <p>One quiet little form between you and whatever happens next.</p>
        </div>

        <form className="gauntlet-form" onSubmit={(event) => { event.preventDefault(); if (verified) signIn(); }}>
          <label className="field-group">
            <span>Username or email</span>
            <input
              className="control"
              value={username}
              onChange={(event) => { setUsername(event.target.value); setFormMessage(""); }}
              onKeyDown={(e) => handleInvertedKeyDown(e, setUsername)}
              onPaste={(e) => handleInvertedPaste(e, setUsername)}
              placeholder="you@example.com"
              autoComplete="username"
            />
          </label>
          <label className="field-group">
            <span>Password</span>
            <input
              className="control"
              type="password"
              value={password}
              onChange={(event) => { setPassword(event.target.value); setFormMessage(""); }}
              onKeyDown={(e) => handleInvertedKeyDown(e, setPassword)}
              onPaste={(e) => handleInvertedPaste(e, setPassword)}
              placeholder="Something memorable"
              autoComplete="current-password"
            />
          </label>

          <div className="captcha-box">
            <div className="captcha-header">
              <div>
                <span className="micro-label">SECURITY CHECK · {verified ? "DONE" : "POUR TEST"}</span>
                <p className="captcha-prompt">{verified ? "Verification complete. Proceed to sign in." : "Pour to the line. Don't overshoot."}</p>
              </div>
              <div className={`status-light ${verified ? "is-verified" : ""}`} title={verified ? "Verified" : "Awaiting verification"} />
            </div>
            {verified ? (
              <div className="verified-state">
                <div className="verified-badge">✓</div>
                <div><strong>Verified</strong><span>{message || "Steady hands confirmed."}</span></div>
              </div>
            ) : (
              <WaterPourCaptcha
                onSuccess={() => {
                  setVerified(true);
                  setMessage("Steady hands confirmed.");
                }}
              />
            )}
          </div>

          <div className="submit-row">
            <div className="submit-status">
              <span className={`status-dot ${verified ? "ready" : ""}`} />
              {verified ? "The door is technically open." : "Complete the gauntlet to continue."}
            </div>
            <AppButton onClick={signIn} disabled={!verified} className="sign-button">Sign In <span className="button-arrow">↗</span></AppButton>
          </div>
          {formMessage && <p className="form-message">{formMessage}</p>}
        </form>

        <div className="troll-toolbar login-troll-toolbar">
          <InvertColorsToggle />
          <ConnectToInternetButton />
          <TurnOffButton />
        </div>

        <div className="card-footer">
          <span>© 2026 The Gauntlet</span>
          <span>There is no help desk.</span>
        </div>
      </section>
      <div className="bottom-caption">THIS PAGE IS CALM. THE PAGE IS LYING.</div>
    </main>
  );
}
