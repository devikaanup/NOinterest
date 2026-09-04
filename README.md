# 😈 NOinterest™ (The Gauntlet)

> **"The Most Hostile, Anti-User Pinterest Clone on the Web."**  
> *Things you didn’t ask for. No real auth. No mercy.*

[![React 19](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 7](https://img.shields.io/badge/Vite-7.1-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Matter.js](https://img.shields.io/badge/Physics-Matter.js%200.20-e05d44)](https://brm.io/matter-js/)
[![Web Audio API](https://img.shields.io/badge/Audio-Procedural%20Web%20Audio-yellow)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.1-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Overview

**NOinterest** (also known as *UIntrest* / *The Gauntlet*) is a high-octane, satirical web application built to lampoon modern dark patterns, frictionless social feeds, and tedious enterprise UX. 

Instead of an algorithmic recommendation paradise where infinite inspiration flows effortlessly, NOinterest forces the user through a ruthless gauntlet of physical barriers, psychological warfare, procedural audio harassment, deceptive modals, and retro video game challenges just to view a pile of pins about **Wet Socks** and **Cold Soup**.

---

## 🎮 The Feature Gauntlet

Here is the complete tour of every anti-user mechanic engineered into the project:

### 1. 🛡️ The Gauntlet (The Anti-Auth Gateway)
- **Ambient Dread**: An imposing dark crimson and obsidian aesthetic with an ambient looping video background, film grain overlay, and desaturated turbulence.
- **The Inverted Atbash Keyboard**: Every single text input on the website (username, password, search bar, sign-in phrase) routes keyboard and paste events through an Atbash cipher ($a \leftrightarrow z$, $b \leftrightarrow y$, $c \leftrightarrow x$, etc.).
- **Water Pour CAPTCHA (`WaterPourCaptcha.tsx`)**:
  - Forget distorted letters or identifying traffic lights. You must click and drag to tilt a laboratory pitcher, pouring simulated fluid into a graduated cylinder.
  - The fill line is randomized between 42% and 72%. 
  - Overfill by even a millimeter or spill on the counter, and the system taunts you (*"Oops. A little too thirsty."*) and drains the water back to 0%.
  - Fully synthesized live water-gurgle and liquid hiss via custom Web Audio bandpass-filtered noise buffers.
- **"Type 'sign in' to Sign In"**: The sign-in button is locked until you type the exact string `"sign in"` into a confirmation field—naturally while fighting the Atbash keyboard inverter.
- **Random Dino Stampede & Jitter**: A rogue ASCII/SVG dinosaur stampedes across the screen at random intervals, causing the entire form to shake violently with screen jitter.
- **Mosquito Audio Harassment (`useAudioEngine`)**:
  - A procedural 16,000 Hz high-frequency sine oscillator quietly runs in the background.
  - Every 15 seconds, the volume subtly increases, joined by off-key elevator progression chords and random harsh synthesizer click artifacts.

---

### 2. 🤹 The Physics Discovery Feed (`PhysicsFeed.tsx`)
- **Matter.js 2D Rigid Body Physics**: Pins do not sit in a polite, responsive CSS grid. Pins are rigid physical rectangles that tumble from the sky under simulated gravity ($g = 2.4$) into an enclosed arena.
- **Interactive Chaos**: You can click, grab, throw, and pile up pins. High-velocity collisions generate audio impact thuds.
- **The "Offline Mode" Blocker**:
  - Images are deliberately **blocked from loading** by default!
  - Cards display a flashing offline warning: `📡❌ OFFLINE — CONNECT TO INTERNET (click to wire)`.

---

### 3. 🔌 "Connect to Internet" Wiring Task (`WiringTaskModal.tsx`)
- Inspired by *Among Us*, the website claims you have no internet connection until you manually wire up the breaker panel.
- Left and right terminal nodes are scrambled with randomized colors (Red, Blue, Yellow, Green, Pink).
- Features elastic spring-tension rubber-band physics with dampening while dragging wires across terminals.
- Correct connections snap with audio feedback; releasing in mid-air plays a recoil sound.
- Completing the wiring emits an `internet-connected` event, finally allowing pins across the feed to fetch real images and doodles.

---

### 4. 🎰 Search Roulette & Page-Spinning Luck Check (`LuckCheckModal.tsx`)
- Searching for a topic in the search bar triggers the **Luck Check** modal with a colorful roulette wheel.
- **The Twist**: The wheel remains completely still, while the **entire web document (`#root`) spins 360° multiple times** in dizzying fashion!
- **Rigged Odds (92%)**: Regardless of what you searched for, there is a 92% chance your search term is discarded and replaced with a depressing topic:
  - *Wet Socks*
  - *Cold Soup*
  - *Error 404*
  - *Mild Regret*
  - *Broken Glass*
  - *Dial-up Tone*
  - *Sinking Feeling*
  - *Hairball*
  - *Unsent Email*
  - *Blue Screen*
  - *Nothing*
- Powered by a custom catalog of vector doodles generated via `scripts/generate_doodles.py` and curated unsplash photos.

---

### 5. 🏃 The Exit Trap: "World's Hardest Game" (`EscapeMazeModal`)
- Clicking the small `×` in the corner (taunted with a *"try closing me ➔"* badge) intercepts exit intent.
- You are trapped inside an authentic recreation of **The World's Hardest Game**:
  - 60fps HTML5 Canvas game loop.
  - Sub-pixel circle-to-AABB collision physics.
  - Steer a red square with WASD or Arrow keys across a corridor guarded by counter-phasing patrolling blue orbs.
  - Native `beforeunload` browser hook prevents closing or refreshing the tab while active.
- **Decoy Exit Buttons (`DecoyExitButtons.tsx`)**: Bouncing decoy "Exit" buttons fly across the viewport. Clicking any decoy triggers a full-screen **GTA-style "WASTED"** death screen and doubles the number of bouncing decoy buttons (up to 64 buttons swarming your screen)!

---

### 6. 🛑 System Power Control: Turn Off Modal (`TurnOffModal.tsx`)
- Clicking the "Turn Off" power button opens a security terminal:
  - Asks you to solve: `47 × 8 - 12 = ?`
  - Regardless of your input, it rejects with: *"Incorrect security checksum."*
  - Clicking "Give Up" forces an unskippable 60-second penalty countdown.
  - The remedial question is presented: `1 + 1 = ?`
  - When you submit `2`, the troll is revealed:
    > *"Did you seriously assume arithmetic addition? `"1"` + `"1"` === `"11"`. String concatenation, obviously."*
  - As punishment, document contrast is permanently multiplied by 200% and saturated to 1.8.

---

### 7. 💾 Additional Anti-Features
- **Deceptive Save Flow**: Clicking "Save" triggers an interrogation: *"Save this pin? Yes / No"* $\rightarrow$ *"Are you sure? Yes / No"* $\rightarrow$ *"Fine. Saved."*
- **The End of the Universe**: If you scroll down 4 pages, the feed abruptly ends with a cosmic starry void: *"You have reached the end of the universe. Your journey is complete. Go back to sleep."*
- **RAM Booster 9000 (`DownloadMoreRamWidget`)**: A retro widget that downloads 128GB of synthetic RAM, overclocks your browser fans, and crashes with `ERROR 418: RAM leaked into keyboard!`.
- **Invert Colors Toggle**: Hardware-accelerated CSS filter toggle to flip colors into negative mode.

---

## 🏗️ Architecture & Tech Stack

```
NOinterest/
├── client/                     # Frontend Application
│   ├── index.html              # HTML Shell (Google Fonts: Outfit, Press Start 2P, Permanent Marker)
│   └── src/
│       ├── main.tsx            # React root entry point
│       ├── App.tsx             # Root router/component switch
│       ├── const.ts            # OAuth & client constants
│       ├── index.css           # Global Tailwind v4 styles, typography, and animations
│       ├── pages/
│       │   ├── Home.tsx        # The Gauntlet login view & Dashboard shell
│       │   └── NotFound.tsx    # 404 handler
│       ├── components/
│       │   ├── PhysicsFeed.tsx       # Matter.js 2D rigid-body canvas feed & pin stacking
│       │   ├── WaterPourCaptcha.tsx  # Canvas fluid mechanics & audio synthesis CAPTCHA
│       │   ├── WiringTaskModal.tsx   # Elastic rubber-band wire reconnection task
│       │   ├── LuckCheckModal.tsx    # Document-spinning roulette wheel
│       │   ├── TurnOffModal.tsx      # Deceptive power-down math terminal
│       │   ├── InvertColorsToggle.tsx# Full-screen CSS inversion toggle
│       │   └── EscapeMazeModal/      # World's Hardest Game escape engine & decoy buttons
│       │       ├── EscapeMazeModal.tsx
│       │       ├── EscapeMazeCanvas.tsx
│       │       ├── DecoyExitButtons.tsx
│       │       └── engine/           # Physics, constants, collision detection, game loop
│       ├── data/
│       │   └── topicCatalog.ts # Troll topic definitions, descriptions, and mock data
│       └── utils/              # Image & placeholder helpers
├── server/                     # Backend Static & API Server
│   └── index.ts                # Express server handling static production assets & SPA routing
├── scripts/
│   └── generate_doodles.py     # Python generator producing custom SVG troll art
├── shared/                     # Shared TypeScript schemas & constants
├── render.yaml                 # Render cloud deployment configuration
├── vercel.json                 # Vercel serverless / static routing rules
├── vite.config.ts              # Vite 7 build and plugin configuration
└── package.json                # Project dependencies and script declarations
```

### Core Technologies:
- **Framework**: React 19 + TypeScript (ESM)
- **Bundler**: Vite 7
- **Styling**: Tailwind CSS v4 + Vanilla CSS animations & glassmorphism
- **Physics**: [Matter.js](https://brm.io/matter-js/) (2D physics engine)
- **Audio**: Web Audio API (real-time procedural audio synthesis, biquad filters, buffer generators)
- **Server**: Express 4 (Node.js runtime)
- **Deployments**: Vercel & Render ready

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **pnpm**: `v10.x` (or `npm` / `yarn`)
- **Python 3**: (Optional, only needed if re-generating doodle assets)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/NOinterest.git
   cd NOinterest
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the local development server:**
   ```bash
   pnpm run dev
   ```
   Open your browser at `http://localhost:5173` to face the Gauntlet.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm run dev` | Starts Vite dev server with hot-module replacement on `0.0.0.0` |
| `pnpm run build` | Compiles frontend assets via Vite and bundles `server/index.ts` via esbuild into `dist/` |
| `pnpm run start` | Runs the compiled Express production server (`NODE_ENV=production node dist/index.js`) |
| `pnpm run check` | Runs TypeScript type checking (`tsc --noEmit`) |
| `pnpm run preview` | Previews the production Vite build locally |
| `pnpm run format` | Runs Prettier across all codebase files |

---

## 🚢 Deployment

### Deploy to Render
The repository includes a ready-to-use [`render.yaml`](file:///Users/shriram/Documents/Projects/NOinterest/render.yaml):
- **Build Command**: `pnpm install && pnpm run build`
- **Start Command**: `pnpm run start`

### Deploy to Vercel
Configured via [`vercel.json`](file:///Users/shriram/Documents/Projects/NOinterest/vercel.json) with SPA rewrites to `index.html`. Connect your GitHub repository to Vercel and it will automatically detect the Vite build settings.

---

## 📜 License

This project is licensed under the **MIT License**.

*Disclaimer: NOinterest was built as an exercise in creative satire, physics engines, and procedural audio synthesis. No actual users were permanently harmed, though several keyboards were subjected to inverted typing distress.*