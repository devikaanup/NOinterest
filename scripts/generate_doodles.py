import os
import re

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "client", "public", "topics")
os.makedirs(BASE_DIR, exist_ok=True)

# Topics and their distinct doodle styles & SVGs
TOPIC_DOODLES = {
    "wet-socks": [
        {
            "bg": "#e0f2fe", "accent": "#0284c7", "text": "#0369a1",
            "title": "Wet Socks", "sub": "The bathroom puddle tragedy",
            "art": """
            <!-- Wet sock with puddle -->
            <path d="M70,70 L110,70 C120,70 125,85 125,120 L125,170 C125,200 150,220 200,220 C230,220 240,200 230,175 C215,140 180,140 180,120 L180,70 Z" fill="#94a3b8" stroke="#1e293b" stroke-width="6" stroke-linejoin="round"/>
            <path d="M125,170 C140,210 180,210 220,185" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
            <!-- Water drops -->
            <path d="M160,240 C160,255 145,255 145,240 C145,230 160,215 160,215 C160,215 175,230 175,240 C175,255 160,255 160,240 Z" fill="#38bdf8"/>
            <path d="M195,245 C195,255 185,255 185,245 C185,238 195,225 195,225 C195,225 205,238 205,245 C205,255 195,255 195,245 Z" fill="#0284c7"/>
            <!-- Squish puddle -->
            <ellipse cx="150" cy="270" rx="110" ry="18" fill="rgba(56, 189, 248, 0.45)" stroke="#0284c7" stroke-width="4"/>
            <text x="150" y="275" font-family="'Comic Sans MS', sans-serif" font-weight="bold" font-size="14" fill="#0369a1" text-anchor="middle">*SQUISH*</text>
            """
        },
        {
            "bg": "#f0f9ff", "accent": "#0369a1", "text": "#075985",
            "title": "Damp Wool", "sub": "Why does it feel so heavy?",
            "art": """
            <!-- Two sad hanging socks -->
            <line x1="30" y1="40" x2="270" y2="40" stroke="#64748b" stroke-width="4"/>
            <rect x="75" y="32" width="10" height="18" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
            <rect x="195" y="32" width="10" height="18" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
            <path d="M80,45 L80,140 C80,165 100,180 140,180 C155,180 160,165 155,150 C145,130 120,130 120,100 L120,45" fill="#cbd5e1" stroke="#1e293b" stroke-width="5"/>
            <path d="M200,45 L200,140 C200,165 220,180 260,180 C275,180 280,165 275,150 C265,130 240,130 240,100 L240,45" fill="#cbd5e1" stroke="#1e293b" stroke-width="5"/>
            <!-- Sad faces on socks -->
            <circle cx="95" cy="80" r="3" fill="#0f172a"/><circle cx="107" cy="80" r="3" fill="#0f172a"/>
            <path d="M96,95 Q101,88 106,95" fill="none" stroke="#0f172a" stroke-width="2"/>
            <circle cx="215" cy="80" r="3" fill="#0f172a"/><circle cx="227" cy="80" r="3" fill="#0f172a"/>
            <path d="M216,95 Q221,88 226,95" fill="none" stroke="#0f172a" stroke-width="2"/>
            <text x="150" y="240" font-family="'Comic Sans MS', sans-serif" font-size="16" font-weight="bold" fill="#0284c7" text-anchor="middle">DRIP... DRIP...</text>
            """
        },
        {
            "bg": "#e0f2fe", "accent": "#0284c7", "text": "#0369a1",
            "title": "Fresh Carpet Splash", "sub": "One droplet was all it took",
            "art": """
            <!-- Foot stepping into invisible water droplet -->
            <path d="M110,60 C110,60 115,140 100,170 C90,190 70,210 130,220 C180,225 210,210 220,195 C225,185 205,180 190,180 C160,180 150,150 150,60 Z" fill="#fed7aa" stroke="#7c2d12" stroke-width="5"/>
            <circle cx="150" cy="225" r="35" fill="rgba(14, 165, 233, 0.4)" stroke="#0284c7" stroke-dasharray="4,4" stroke-width="3"/>
            <text x="150" y="270" font-family="sans-serif" font-weight="900" font-size="20" fill="#dc2626" text-anchor="middle">COLD &amp; MOIST</text>
            """
        }
    ],

    "error-404": [
        {
            "bg": "#fef2f2", "accent": "#ef4444", "text": "#991b1b",
            "title": "Error 404", "sub": "Requested item fell off the earth",
            "art": """
            <!-- Retro CRT Monitor with 404 face -->
            <rect x="45" y="45" width="210" height="155" rx="14" fill="#334155" stroke="#0f172a" stroke-width="6"/>
            <rect x="60" y="60" width="180" height="125" rx="6" fill="#0f172a"/>
            <text x="150" y="115" font-family="monospace" font-weight="900" font-size="34" fill="#ef4444" text-anchor="middle">404</text>
            <text x="150" y="145" font-family="monospace" font-weight="bold" font-size="14" fill="#f87171" text-anchor="middle">NOT FOUND :(</text>
            <!-- Stand -->
            <polygon points="120,200 180,200 195,240 105,240" fill="#475569" stroke="#0f172a" stroke-width="5"/>
            <ellipse cx="150" cy="245" rx="70" ry="12" fill="#1e293b"/>
            <!-- Sparkles/Smoke -->
            <path d="M60,35 Q65,15 50,5" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="3,3"/>
            <path d="M240,35 Q235,15 250,5" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="3,3"/>
            <text x="150" y="280" font-family="'Comic Sans MS', sans-serif" font-weight="bold" font-size="13" fill="#64748b" text-anchor="middle">Have you tried crying?</text>
            """
        },
        {
            "bg": "#fff1f2", "accent": "#f43f5e", "text": "#881337",
            "title": "Missing Page", "sub": "It went for milk 10 years ago",
            "art": """
            <rect x="75" y="40" width="150" height="190" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="5"/>
            <line x1="95" y1="70" x2="205" y2="70" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/>
            <line x1="95" y1="95" x2="185" y2="95" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/>
            <line x1="95" y1="120" x2="160" y2="120" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round"/>
            <!-- Big question mark stamp -->
            <circle cx="150" cy="155" r="35" fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" stroke-width="3"/>
            <text x="150" y="170" font-family="'Impact', sans-serif" font-size="44" fill="#e11d48" text-anchor="middle">?</text>
            <text x="150" y="265" font-family="'Comic Sans MS', cursive" font-weight="bold" font-size="15" fill="#be123c" text-anchor="middle">Gone. Reduced to atoms.</text>
            """
        },
        {
            "bg": "#fef2f2", "accent": "#ef4444", "text": "#991b1b",
            "title": "Tombstone of URLs", "sub": "R.I.P. your hyperlink",
            "art": """
            <path d="M80,240 L80,100 C80,50 220,50 220,100 L220,240 Z" fill="#94a3b8" stroke="#334155" stroke-width="6"/>
            <text x="150" y="110" font-family="serif" font-weight="900" font-size="22" fill="#1e293b" text-anchor="middle">R.I.P.</text>
            <text x="150" y="145" font-family="monospace" font-weight="bold" font-size="18" fill="#dc2626" text-anchor="middle">HTTP 404</text>
            <text x="150" y="175" font-family="sans-serif" font-size="11" fill="#334155" text-anchor="middle">Here lies what</text>
            <text x="150" y="195" font-family="sans-serif" font-size="11" fill="#334155" text-anchor="middle">you searched for</text>
            <line x1="40" y1="240" x2="260" y2="240" stroke="#15803d" stroke-width="8"/>
            """
        }
    ],

    "cold-soup": [
        {
            "bg": "#fef3c7", "accent": "#d97706", "text": "#78350f",
            "title": "Cold Soup", "sub": "Fat layer solidified to perfection",
            "art": """
            <!-- Soup Bowl -->
            <ellipse cx="150" cy="180" rx="110" ry="45" fill="#f8fafc" stroke="#1e293b" stroke-width="6"/>
            <!-- Cold congealed liquid -->
            <ellipse cx="150" cy="175" rx="95" ry="35" fill="#f59e0b"/>
            <!-- Film of cold fat -->
            <path d="M75,170 Q120,150 160,175 T230,170" fill="none" stroke="#fef3c7" stroke-width="8"/>
            <!-- Iceberg floating in soup -->
            <polygon points="125,170 145,130 170,170" fill="#bae6fd" stroke="#0284c7" stroke-width="3"/>
            <!-- Spoon standing upright frozen -->
            <path d="M175,90 L185,165" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
            <circle cx="172" cy="85" r="14" fill="#94a3b8" stroke="#475569" stroke-width="3"/>
            <text x="150" y="260" font-family="'Comic Sans MS', cursive" font-weight="bold" font-size="15" fill="#b45309" text-anchor="middle">Thermometer: -3°C</text>
            """
        },
        {
            "bg": "#fffbeb", "accent": "#f59e0b", "text": "#92400e",
            "title": "Forgotten Broth", "sub": "Left out since Tuesday",
            "art": """
            <rect x="70" y="70" width="160" height="150" rx="10" fill="#e2e8f0" stroke="#1e293b" stroke-width="6"/>
            <rect x="70" y="100" width="160" height="70" fill="#dc2626"/>
            <text x="150" y="145" font-family="'Impact', sans-serif" font-size="26" fill="#ffffff" text-anchor="middle">NO SOUP</text>
            <text x="150" y="195" font-family="monospace" font-weight="bold" font-size="11" fill="#64748b" text-anchor="middle">CONGEALED EDITION</text>
            <text x="150" y="260" font-family="sans-serif" font-weight="bold" font-size="13" fill="#b45309" text-anchor="middle">Stiff enough to stand on</text>
            """
        }
    ],

    "mild-regret": [
        {
            "bg": "#f3e8ff", "accent": "#a855f7", "text": "#581c87",
            "title": "Mild Regret", "sub": "Sent to: ALL_COMPANY (4,821)",
            "art": """
            <!-- Stickman facepalming -->
            <circle cx="150" cy="110" r="45" fill="#fde047" stroke="#1e293b" stroke-width="5"/>
            <!-- Slanted sad eyes -->
            <line x1="125" y1="100" x2="140" y2="108" stroke="#1e293b" stroke-width="4"/>
            <line x1="175" y1="100" x2="160" y2="108" stroke="#1e293b" stroke-width="4"/>
            <!-- Wavy mouth -->
            <path d="M130,135 Q140,125 150,135 T170,130" fill="none" stroke="#1e293b" stroke-width="4"/>
            <!-- Hand on face -->
            <rect x="155" y="90" width="30" height="45" rx="6" fill="#fde047" stroke="#1e293b" stroke-width="4" transform="rotate(20 170 110)"/>
            <!-- Drop of sweat -->
            <path d="M195,95 C195,105 185,105 185,95 C185,88 195,78 195,78 C195,78 205,88 205,95 Z" fill="#38bdf8"/>
            <text x="150" y="200" font-family="monospace" font-weight="bold" font-size="15" fill="#6b21a8" text-anchor="middle">"Reply All: Thanks!"</text>
            <text x="150" y="240" font-family="'Comic Sans MS', cursive" font-size="13" fill="#9333ea" text-anchor="middle">Can I resign right now?</text>
            """
        },
        {
            "bg": "#fae8ff", "accent": "#d946ef", "text": "#701a75",
            "title": "DIY Bangs", "sub": "It looked good on TikTok",
            "art": """
            <!-- Scissors and crooked haircut -->
            <circle cx="150" cy="120" r="50" fill="#fed7aa" stroke="#1e293b" stroke-width="5"/>
            <!-- Terrible crooked bangs -->
            <polygon points="100,85 115,115 130,90 145,125 160,88 175,120 190,85 200,85 200,70 100,70" fill="#78350f" stroke="#1e293b" stroke-width="3"/>
            <ellipse cx="130" cy="125" rx="5" ry="7" fill="#1e293b"/>
            <ellipse cx="170" cy="125" rx="5" ry="7" fill="#1e293b"/>
            <ellipse cx="150" cy="150" rx="12" ry="6" fill="#1e293b"/>
            <text x="150" y="220" font-family="'Impact', sans-serif" font-size="22" fill="#a21caf" text-anchor="middle">TWO MONTHS TO GROW BACK</text>
            """
        }
    ],

    "broken-glass": [
        {
            "bg": "#ede9fe", "accent": "#7c3aed", "text": "#4c1d95",
            "title": "Broken Glass", "sub": "Walking barefoot is now extreme sports",
            "art": """
            <!-- Shattered tumbler -->
            <polygon points="90,70 130,65 140,110 100,120" fill="#c4b5fd" stroke="#4c1d95" stroke-width="4"/>
            <polygon points="150,68 190,65 210,130 160,115" fill="#ddd6fe" stroke="#4c1d95" stroke-width="4"/>
            <polygon points="110,140 180,135 170,210 130,220" fill="#ede9fe" stroke="#4c1d95" stroke-width="4"/>
            <!-- Sharp shards everywhere -->
            <polygon points="60,180 85,160 80,195" fill="#a78bfa" stroke="#4c1d95" stroke-width="3"/>
            <polygon points="215,170 240,150 235,190" fill="#a78bfa" stroke="#4c1d95" stroke-width="3"/>
            <polygon points="135,235 155,250 145,260" fill="#8b5cf6" stroke="#4c1d95" stroke-width="3"/>
            <text x="150" y="275" font-family="'Impact', sans-serif" font-size="22" fill="#ef4444" text-anchor="middle">*CRUNCH*</text>
            """
        },
        {
            "bg": "#f5f3ff", "accent": "#6d28d9", "text": "#371b69",
            "title": "Spiderweb Screen", "sub": "Dropped on a single pebble",
            "art": """
            <!-- Smartphone with cracked screen -->
            <rect x="80" y="40" width="140" height="220" rx="18" fill="#18181b" stroke="#3f3f46" stroke-width="6"/>
            <rect x="90" y="55" width="120" height="190" rx="4" fill="#09090b"/>
            <!-- Spiderweb cracks from corner -->
            <path d="M90,55 L160,120 L210,100" stroke="#ffffff" stroke-width="3" fill="none"/>
            <path d="M160,120 L130,190 L180,245" stroke="#ffffff" stroke-width="2.5" fill="none"/>
            <path d="M160,120 L195,165" stroke="#ffffff" stroke-width="2" fill="none"/>
            <path d="M130,190 L95,210" stroke="#ffffff" stroke-width="2" fill="none"/>
            <text x="150" y="160" font-family="monospace" font-weight="bold" font-size="12" fill="#22c55e" text-anchor="middle">Battery: 100%</text>
            <text x="150" y="290" font-family="'Comic Sans MS', cursive" font-size="13" fill="#6d28d9" text-anchor="middle">Still works if you squint</text>
            """
        }
    ],

    "dial-up-tone": [
        {
            "bg": "#fefce8", "accent": "#ca8a04", "text": "#713f12",
            "title": "Dial-up Tones", "sub": "The symphony of 1998",
            "art": """
            <!-- Modem box with blinking LEDs -->
            <rect x="60" y="100" width="180" height="90" rx="10" fill="#f1f5f9" stroke="#334155" stroke-width="5"/>
            <circle cx="85" cy="145" r="7" fill="#22c55e" stroke="#16a34a" stroke-width="2"/>
            <circle cx="115" cy="145" r="7" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
            <circle cx="145" cy="145" r="7" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
            <circle cx="175" cy="145" r="7" fill="#3b82f6" stroke="#2563eb" stroke-width="2"/>
            <text x="210" y="150" font-family="sans-serif" font-weight="900" font-size="12" fill="#475569">56k</text>
            <!-- Screaming sound waves -->
            <path d="M40,70 Q90,30 150,70 T260,70" fill="none" stroke="#ca8a04" stroke-width="4"/>
            <text x="150" y="55" font-family="'Impact', sans-serif" font-size="20" fill="#eab308" text-anchor="middle">BEEEEEP-SCREEEEECH</text>
            <text x="150" y="240" font-family="monospace" font-weight="bold" font-size="14" fill="#854d0e" text-anchor="middle">Connecting at 28.8 kbps</text>
            <text x="150" y="265" font-family="'Comic Sans MS', cursive" font-size="12" fill="#a16207" text-anchor="middle">Don't pick up the phone mom!</text>
            """
        }
    ],

    "sinking-feeling": [
        {
            "bg": "#f0fdfa", "accent": "#0d9488", "text": "#134e4a",
            "title": "Sinking Feeling", "sub": "Where are my house keys?",
            "art": """
            <!-- Deep ocean or quicksand sinking -->
            <rect x="40" y="160" width="220" height="90" fill="#0f766e"/>
            <!-- Hand reaching out holding cup -->
            <path d="M150,180 L150,110 L160,110 L160,180" fill="#fed7aa" stroke="#7c2d12" stroke-width="4"/>
            <rect x="140" y="85" width="25" height="25" rx="3" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
            <!-- Mug handle -->
            <path d="M165,90 C175,90 175,105 165,105" fill="none" stroke="#0f172a" stroke-width="3"/>
            <text x="150" y="70" font-family="'Comic Sans MS', cursive" font-weight="bold" font-size="13" fill="#0f766e" text-anchor="middle">"This is totally fine"</text>
            <!-- Bubbles -->
            <circle cx="120" cy="140" r="8" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
            <circle cx="180" cy="130" r="5" fill="#ccfbf1" stroke="#0d9488" stroke-width="2"/>
            <text x="150" y="275" font-family="'Impact', sans-serif" font-size="20" fill="#115e59" text-anchor="middle">POCKET IS EMPTY</text>
            """
        }
    ],

    "hairball": [
        {
            "bg": "#ecfdf5", "accent": "#059669", "text": "#064e3b",
            "title": "Hairball", "sub": "2:00 AM Carpet Surprise",
            "art": """
            <!-- Cat face gagging -->
            <circle cx="150" cy="110" r="50" fill="#cbd5e1" stroke="#1e293b" stroke-width="5"/>
            <!-- Cat ears -->
            <polygon points="105,75 120,35 140,65" fill="#cbd5e1" stroke="#1e293b" stroke-width="5"/>
            <polygon points="195,75 180,35 160,65" fill="#cbd5e1" stroke="#1e293b" stroke-width="5"/>
            <!-- Wide gagging mouth -->
            <ellipse cx="150" cy="125" rx="25" ry="18" fill="#1e293b"/>
            <!-- Spat out hairball with green tint -->
            <ellipse cx="150" cy="210" rx="35" ry="20" fill="#334155" stroke="#1e293b" stroke-width="4"/>
            <!-- Little hairs poking out -->
            <line x1="120" y1="205" x2="105" y2="195" stroke="#1e293b" stroke-width="3"/>
            <line x1="180" y1="205" x2="195" y2="195" stroke="#1e293b" stroke-width="3"/>
            <line x1="150" y1="190" x2="150" y2="175" stroke="#1e293b" stroke-width="3"/>
            <text x="150" y="165" font-family="'Impact', sans-serif" font-size="18" fill="#10b981" text-anchor="middle">HCK-HCK-BLECH!</text>
            <text x="150" y="260" font-family="'Comic Sans MS', cursive" font-size="13" fill="#047857" text-anchor="middle">Always on the good rug</text>
            """
        }
    ],

    "unsent-email": [
        {
            "bg": "#fff1f2", "accent": "#f43f5e", "text": "#881337",
            "title": "Unsent Email", "sub": "Drafted with pure venom",
            "art": """
            <!-- Draft email window with fire -->
            <rect x="50" y="55" width="200" height="150" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="5"/>
            <rect x="50" y="55" width="200" height="30" rx="8" fill="#e2e8f0"/>
            <circle cx="68" cy="70" r="4" fill="#ef4444"/>
            <circle cx="82" cy="70" r="4" fill="#eab308"/>
            <circle cx="96" cy="70" r="4" fill="#22c55e"/>
            <text x="65" y="115" font-family="sans-serif" font-weight="bold" font-size="12" fill="#ef4444">DRAFT (DO NOT SEND)</text>
            <text x="65" y="140" font-family="monospace" font-size="11" fill="#334155">"Per my previous email,</text>
            <text x="65" y="160" font-family="monospace" font-size="11" fill="#334155">can you even read?"</text>
            <!-- Big Red STAMP -->
            <rect x="90" y="170" width="120" height="35" rx="5" fill="none" stroke="#dc2626" stroke-width="4" transform="rotate(-10 150 185)"/>
            <text x="150" y="194" font-family="'Impact', sans-serif" font-size="18" fill="#dc2626" text-anchor="middle" transform="rotate(-10 150 185)">DANGEROUS</text>
            <text x="150" y="255" font-family="'Comic Sans MS', cursive" font-size="13" fill="#9f1239" text-anchor="middle">Sleeping on it was a good idea</text>
            """
        }
    ],

    "blue-screen": [
        {
            "bg": "#eff6ff", "accent": "#2563eb", "text": "#1e3a8a",
            "title": "Blue Screen", "sub": "CRITICAL_PROCESS_DIED",
            "art": """
            <!-- Windows BSOD -->
            <rect x="40" y="45" width="220" height="180" rx="8" fill="#0078d7" stroke="#0f172a" stroke-width="6"/>
            <text x="70" y="105" font-family="sans-serif" font-weight="900" font-size="44" fill="#ffffff">:(</text>
            <text x="70" y="140" font-family="sans-serif" font-weight="bold" font-size="12" fill="#ffffff">Your PC ran into a problem</text>
            <text x="70" y="155" font-family="sans-serif" font-size="11" fill="#ffffff">and needs to restart.</text>
            <text x="70" y="190" font-family="monospace" font-size="10" fill="#93c5fd">Stop Code: BRAIN_OVERHEAT</text>
            <text x="150" y="260" font-family="'Comic Sans MS', cursive" font-weight="bold" font-size="14" fill="#1d4ed8" text-anchor="middle">Did you save your work? (No.)</text>
            """
        }
    ],

    "nothing": [
        {
            "bg": "#f8fafc", "accent": "#64748b", "text": "#1e293b",
            "title": "Nothing", "sub": "Literally absolute zero",
            "art": """
            <!-- Empty museum pedestal -->
            <polygon points="90,190 210,190 230,230 70,230" fill="#e2e8f0" stroke="#334155" stroke-width="4"/>
            <!-- Glass showcase empty -->
            <rect x="95" y="80" width="110" height="110" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="4,4"/>
            <!-- Magnifying glass looking at nothing -->
            <circle cx="150" cy="135" r="22" fill="none" stroke="#0f172a" stroke-width="4"/>
            <line x1="165" y1="150" x2="190" y2="175" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
            <text x="150" y="140" font-family="monospace" font-weight="900" font-size="12" fill="#64748b" text-anchor="middle">0 bytes</text>
            <text x="150" y="270" font-family="'Impact', sans-serif" font-size="20" fill="#0f172a" text-anchor="middle">CONTENT NOT FOUND</text>
            """
        }
    ],

    "jackpot": [
        {
            "bg": "#fefce8", "accent": "#eab308", "text": "#854d0e",
            "title": "Jackpot (?)", "sub": "Almost a billionaire",
            "art": """
            <!-- Slot Machine Reels: 7 - 7 - EGGPLANT -->
            <rect x="45" y="60" width="210" height="140" rx="14" fill="#dc2626" stroke="#1e293b" stroke-width="6"/>
            <!-- Reel 1 -->
            <rect x="60" y="80" width="50" height="80" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
            <text x="85" y="135" font-family="'Impact', sans-serif" font-size="44" fill="#dc2626" text-anchor="middle">7</text>
            <!-- Reel 2 -->
            <rect x="125" y="80" width="50" height="80" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
            <text x="150" y="135" font-family="'Impact', sans-serif" font-size="44" fill="#dc2626" text-anchor="middle">7</text>
            <!-- Reel 3: Disappointment -->
            <rect x="190" y="80" width="50" height="80" rx="4" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
            <text x="215" y="135" font-family="sans-serif" font-size="34" fill="#7e22ce" text-anchor="middle">🍆</text>
            <!-- Lever -->
            <line x1="255" y1="120" x2="275" y2="90" stroke="#475569" stroke-width="7" stroke-linecap="round"/>
            <circle cx="280" cy="85" r="12" fill="#ef4444"/>
            <text x="150" y="240" font-family="'Impact', sans-serif" font-size="24" fill="#ca8a04" text-anchor="middle">YOU WON: $0.00!</text>
            <text x="150" y="270" font-family="'Comic Sans MS', cursive" font-size="13" fill="#a16207" text-anchor="middle">Better luck next existence</text>
            """
        }
    ],

    "random-ideas": [
        {
            "bg": "#fdf4ff", "accent": "#c026d3", "text": "#701a75",
            "title": "Random Idea #1", "sub": "Solar powered flashlight",
            "art": """
            <circle cx="150" cy="110" r="45" fill="#fde047" stroke="#ca8a04" stroke-width="4"/>
            <!-- Rays -->
            <line x1="150" y1="50" x2="150" y2="35" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
            <line x1="150" y1="170" x2="150" y2="185" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
            <line x1="90" y1="110" x2="75" y2="110" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
            <line x1="210" y1="110" x2="225" y2="110" stroke="#eab308" stroke-width="4" stroke-linecap="round"/>
            <text x="150" y="118" font-family="'Impact', sans-serif" font-size="28" fill="#854d0e" text-anchor="middle">IDEA!</text>
            <text x="150" y="235" font-family="'Comic Sans MS', cursive" font-weight="bold" font-size="15" fill="#c026d3" text-anchor="middle">Only works in direct sunlight</text>
            """
        },
        {
            "bg": "#ecfeff", "accent": "#0891b2", "text": "#155e75",
            "title": "Random Idea #2", "sub": "Inverted Umbrella",
            "art": """
            <path d="M70,100 C70,160 230,160 230,100 Z" fill="#06b6d4" stroke="#0e7490" stroke-width="5"/>
            <line x1="150" y1="100" x2="150" y2="210" stroke="#334155" stroke-width="6"/>
            <path d="M150,210 C150,225 135,225 135,210" fill="none" stroke="#334155" stroke-width="6"/>
            <!-- Water collecting inside -->
            <ellipse cx="150" cy="125" rx="55" ry="15" fill="#38bdf8"/>
            <text x="150" y="250" font-family="'Impact', sans-serif" font-size="18" fill="#0891b2" text-anchor="middle">COLLECTS RAIN ON YOUR HEAD</text>
            """
        }
    ]
}

def generate_svg(doodle):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320" width="300" height="320">
  <rect width="300" height="320" rx="14" fill="{doodle['bg']}"/>
  <rect x="8" y="8" width="284" height="304" rx="10" fill="none" stroke="{doodle['accent']}" stroke-width="2.5" stroke-dasharray="6,4"/>
  {doodle['art']}
  <text x="150" y="30" font-family="'IBM Plex Mono', monospace" font-weight="bold" font-size="11" fill="{doodle['text']}" text-anchor="middle" letter-spacing="1">{doodle['title'].upper()}</text>
</svg>"""

total = 0
for slug, doodles in TOPIC_DOODLES.items():
    topic_dir = os.path.join(BASE_DIR, slug)
    os.makedirs(topic_dir, exist_ok=True)
    for idx, d in enumerate(doodles):
        file_path = os.path.join(topic_dir, f"{idx + 1}.svg")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(generate_svg(d).strip())
        total += 1

print(f"Generated {total} doodle SVGs successfully across {len(TOPIC_DOODLES)} topics!")
