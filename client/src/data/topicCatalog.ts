export interface TopicItem {
  title: string;
  imageUrl: string;
  description: string;
  author: string;
  saves: number;
}

export interface TopicDef {
  name: string;
  slug: string;
  items: TopicItem[];
}

export const TOPIC_CATALOG: Record<string, TopicDef> = {
  "wet socks": {
    name: "Wet Socks",
    slug: "wet-socks",
    items: [
      {
        title: "Wet Socks: Bathroom Puddle Trauma",
        imageUrl: "/topics/wet-socks/1.svg",
        description: "Stepped in an invisible puddle 4 seconds after putting on fresh cotton socks.",
        author: "puddle_victim",
        saves: 421,
      },
      {
        title: "Damp Wool: Maximum Heaviness",
        imageUrl: "/topics/wet-socks/2.svg",
        description: "Feels like strapping two soggy bags of cold sand directly to your ankles.",
        author: "laundry_denier",
        saves: 289,
      },
      {
        title: "Cold & Moist: The Kitchen Tile",
        imageUrl: "/topics/wet-socks/3.svg",
        description: "One single drop of melted ice cube from the freezer. That's all it took.",
        author: "ice_cube_hater",
        saves: 374,
      },
      {
        title: "Real Life Wet Footwear",
        imageUrl: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=400&q=80",
        description: "Direct photographic proof of wet fabric tragedy in the wild.",
        author: "street_splasher",
        saves: 512,
      },
      {
        title: "Puddle Submersion Experiment",
        imageUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=400&q=80",
        description: "The depth was deceptive. The regret was immediate.",
        author: "rain_walker",
        saves: 198,
      },
      {
        title: "Wet Footprints on Hardwood",
        imageUrl: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=80",
        description: "Squish. Squish. Squelch. Every step echoes your terrible life choices.",
        author: "hardwood_destroyer",
        saves: 310,
      }
    ]
  },

  "error 404": {
    name: "Error 404",
    slug: "error-404",
    items: [
      {
        title: "Error 404: The Monitor Weeps",
        imageUrl: "/topics/error-404/1.svg",
        description: "The URL you requested went out for milk and cigarettes in 2012 and never returned.",
        author: "web_archaeologist",
        saves: 680,
      },
      {
        title: "Missing Page: Reduced to Atoms",
        imageUrl: "/topics/error-404/2.svg",
        description: "We looked under the couch cushions. Nothing there except lint and regret.",
        author: "broken_link_police",
        saves: 450,
      },
      {
        title: "Tombstone of Dead Hyperlinks",
        imageUrl: "/topics/error-404/3.svg",
        description: "Rest in peace, great article that was bookmarked but never actually read.",
        author: "bookmark_graveyard",
        saves: 390,
      },
      {
        title: "Cyber Neon Error 404",
        imageUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80",
        description: "Photographic glitch art representing the total failure of digital connectivity.",
        author: "terminal_dweller",
        saves: 830,
      },
      {
        title: "Corrupted Binary Void",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
        description: "Green matrix code decaying into meaningless noise.",
        author: "neo_failed",
        saves: 620,
      },
      {
        title: "The Broken Gateway",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
        description: "When code refuses to compile at 4:58 PM on a Friday afternoon.",
        author: "weekend_ruined",
        saves: 540,
      }
    ]
  },

  "cold soup": {
    name: "Cold Soup",
    slug: "cold-soup",
    items: [
      {
        title: "Cold Soup: Congealed Perfection",
        imageUrl: "/topics/cold-soup/1.svg",
        description: "The fat layer has hardened into an impenetrable shield. The spoon stands upright.",
        author: "microwave_broken",
        saves: 340,
      },
      {
        title: "Canned Disappointment: Cold Edition",
        imageUrl: "/topics/cold-soup/2.svg",
        description: "Left on the kitchen counter since Tuesday morning. Still technically food?",
        author: "leftovers_gambler",
        saves: 275,
      },
      {
        title: "Bowl of Chilled Broth",
        imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80",
        description: "It was once piping hot and comforting. Now it is a tragedy in a ceramic bowl.",
        author: "slow_eater",
        saves: 410,
      },
      {
        title: "Ramen Left Behind",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80",
        description: "Noodles have absorbed 400% of their body weight in lukewarm broth.",
        author: "distracted_gamer",
        saves: 388,
      },
      {
        title: "Vegetable Medley in Gelatinous State",
        imageUrl: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=400&q=80",
        description: "Nature's way of asking: are you really sure you want to eat this?",
        author: "culinary_survivor",
        saves: 290,
      }
    ]
  },

  "mild regret": {
    name: "Mild Regret",
    slug: "mild-regret",
    items: [
      {
        title: "Mild Regret: The 'Reply All' Incident",
        imageUrl: "/topics/mild-regret/1.svg",
        description: "Accidentally sent 'Thanks dad love you' to all 4,800 employees in the EMEA division.",
        author: "career_transition",
        saves: 950,
      },
      {
        title: "DIY Bangs: 2:00 AM Bathroom Scissors",
        imageUrl: "/topics/mild-regret/2.svg",
        description: "Watching YouTube tutorials at 2 AM does not qualify you as a licensed hair stylist.",
        author: "bangs_regret",
        saves: 820,
      },
      {
        title: "Anxious Contemplation",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        description: "That moment when you realize you locked the keys inside the running car.",
        author: "locksmith_regular",
        saves: 490,
      },
      {
        title: "The Awkward Goodbye",
        imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80",
        description: "Saying 'You too!' when the movie ticket seller says 'Enjoy the movie!'",
        author: "social_mastermind",
        saves: 730,
      },
      {
        title: "The Expensive Useless Gadget",
        imageUrl: "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=400&q=80",
        description: "Used once in 2021. Currently gathering emotional dust on the top shelf.",
        author: "gadget_hoarder",
        saves: 610,
      }
    ]
  },

  "broken glass": {
    name: "Broken Glass",
    slug: "broken-glass",
    items: [
      {
        title: "Broken Glass: The Midnight Crunch",
        imageUrl: "/topics/broken-glass/1.svg",
        description: "The sound that instantly turns your kitchen floor into an active minefield.",
        author: "slippers_required",
        saves: 610,
      },
      {
        title: "Spiderweb Screen: Dropped on Gravel",
        imageUrl: "/topics/broken-glass/2.svg",
        description: "Dropped from a height of 2 inches onto a single piece of microscopic grit.",
        author: "gorilla_glass_liar",
        saves: 740,
      },
      {
        title: "Shattered Crystal Fragments",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
        description: "You will continue to find tiny pieces of this glass until the year 2042.",
        author: "vacuum_defeated",
        saves: 590,
      },
      {
        title: "Cracked Window Pane",
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
        description: "A delicate web of structural failure held together purely by optimistic thoughts.",
        author: "glazier_needed",
        saves: 480,
      }
    ]
  },

  "dial-up tone": {
    name: "Dial-up Tone",
    slug: "dial-up-tone",
    items: [
      {
        title: "Dial-up Tones: The Symphony of 1998",
        imageUrl: "/topics/dial-up-tone/1.svg",
        description: "BEEEEEEP KRRRRRRR SHSHSHSHSHSCREEEECH... You've got mail!",
        author: "aol_survivor",
        saves: 880,
      },
      {
        title: "56k Hardware & Beige Towers",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80",
        description: "Beige plastic, glowing green LEDs, and the sweet smell of hot CRT monitor dust.",
        author: "vintage_sysadmin",
        saves: 720,
      },
      {
        title: "Tangled RJ11 Telephone Lines",
        imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=400&q=80",
        description: "Waiting 45 minutes for a single 120x90 JPEG of a Ferrari to load line by line.",
        author: "modem_screamer",
        saves: 650,
      }
    ]
  },

  "sinking feeling": {
    name: "Sinking Feeling",
    slug: "sinking-feeling",
    items: [
      {
        title: "Sinking Feeling: The Pocket Check",
        imageUrl: "/topics/sinking-feeling/1.svg",
        description: "Patting down your coat pockets and finding only smooth fabric where your phone should be.",
        author: "phantom_vibration",
        saves: 910,
      },
      {
        title: "The Dark Ocean Abyss",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
        description: "Looking over the edge of the ferry and wondering how far down the abyss really goes.",
        author: "thalasso_phobia",
        saves: 640,
      },
      {
        title: "Storm Waves & Sinking Hopes",
        imageUrl: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=400&q=80",
        description: "The turbulent sensation in the pit of your stomach when production drops offline.",
        author: "devops_on_call",
        saves: 530,
      }
    ]
  },

  "hairball": {
    name: "Hairball",
    slug: "hairball",
    items: [
      {
        title: "Hairball: 2:00 AM Carpet Special",
        imageUrl: "/topics/hairball/1.svg",
        description: "The distinct 3-stage coughing rhythm that awakens any pet owner from REM sleep.",
        author: "cat_servant",
        saves: 870,
      },
      {
        title: "The Perpetrator at the Scene",
        imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
        description: "He maintains complete plausible deniability despite the evidence on the rug.",
        author: "feline_attorney",
        saves: 780,
      },
      {
        title: "The Post-Hairball Stare",
        imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
        description: "Zero remorse. In fact, he expects dinner to be served immediately.",
        author: "can_opener",
        saves: 690,
      }
    ]
  },

  "unsent email": {
    name: "Unsent Email",
    slug: "unsent-email",
    items: [
      {
        title: "Unsent Email: The Midnight Rant",
        imageUrl: "/topics/unsent-email/1.svg",
        description: "Written in a blind fury of righteous indignation, saved safely in Drafts forever.",
        author: "professional_filter",
        saves: 980,
      },
      {
        title: "Late Night Keyboard Confessions",
        imageUrl: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=400&q=80",
        description: "Staring at the 'Send' button for 42 minutes before deleting the entire paragraph.",
        author: "overthinker_elite",
        saves: 850,
      },
      {
        title: "The 3:00 AM Coffee Cursor",
        imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80",
        description: "Empty coffee mug, blinking black cursor, and an apology that will never be delivered.",
        author: "nocturnal_typist",
        saves: 720,
      }
    ]
  },

  "blue screen": {
    name: "Blue Screen",
    slug: "blue-screen",
    items: [
      {
        title: "Blue Screen: :( Your PC Died",
        imageUrl: "/topics/blue-screen/1.svg",
        description: "The classic frowning emoticon that signifies the immediate loss of unsaved documents.",
        author: "ctrl_alt_delete",
        saves: 990,
      },
      {
        title: "Digital Memory Dump in Progress",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
        description: "0x000000D1 DRIVER_IRQL_NOT_LESS_OR_EQUAL. Truly poetry for the machine age.",
        author: "kernel_panicker",
        saves: 810,
      },
      {
        title: "Cyber Blue Fatal Crash",
        imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80",
        description: "When the GPU decides it simply has rendered enough pixels for this lifetime.",
        author: "overclock_victim",
        saves: 740,
      }
    ]
  },

  "nothing": {
    name: "Nothing",
    slug: "nothing",
    items: [
      {
        title: "Nothing: Museum of Absolute Zero",
        imageUrl: "/topics/nothing/1.svg",
        description: "An impeccably curated display containing zero objects, zero pixels, and zero thoughts.",
        author: "zen_minimalist",
        saves: 770,
      },
      {
        title: "Vast Barren Emptiness",
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
        description: "A blank horizon where even thoughts find nothing to bounce off of.",
        author: "desert_monk",
        saves: 620,
      },
      {
        title: "Infinite Pale Void",
        imageUrl: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=400&q=80",
        description: "Nothing is here. You searched for nothing, and congratulations, you found it.",
        author: "void_enjoyer",
        saves: 530,
      }
    ]
  },

  "jackpot (?)": {
    name: "Jackpot (?)",
    slug: "jackpot",
    items: [
      {
        title: "Jackpot (?): 7 - 7 - Eggplant",
        imageUrl: "/topics/jackpot/1.svg",
        description: "Two out of three reels aligned! You have officially won $0.00 and a plastic token.",
        author: "casino_regular",
        saves: 1020,
      },
      {
        title: "Blinking Neon Casino Mirage",
        imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80",
        description: "The illusion of massive financial independence wrapped in hypnotic flashing lights.",
        author: "high_roller_debtor",
        saves: 890,
      },
      {
        title: "The Golden Chip Temptation",
        imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=400&q=80",
        description: "Always bet on red, unless the ball lands on green, in which case do not do that.",
        author: "luck_checker",
        saves: 750,
      }
    ]
  },

  "random ideas": {
    name: "Random Ideas",
    slug: "random-ideas",
    items: [
      {
        title: "Random Idea: Solar Powered Flashlight",
        imageUrl: "/topics/random-ideas/1.svg",
        description: "Guaranteed to work brilliantly whenever you are standing directly in the sun.",
        author: "inventor_bob",
        saves: 650,
      },
      {
        title: "Random Idea: Inverted Umbrella",
        imageUrl: "/topics/random-ideas/2.svg",
        description: "Collects 4 gallons of rainwater directly above your forehead for later use.",
        author: "weather_genius",
        saves: 580,
      },
      {
        title: "Random Concept: Neon Architecture",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80",
        description: "Retro-futuristic structural engineering designed by a machine with no budget limits.",
        author: "cyber_architect",
        saves: 430,
      },
      {
        title: "Random Concept: The Clockwork Mechanism",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
        description: "Gears within gears turning for reasons no living person can fully explain.",
        author: "chronos_engineer",
        saves: 510,
      },
      {
        title: "Random Idea: Waterproof Sponge",
        imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80",
        description: "Repels 100% of moisture to ensure dishes remain thoroughly unwashed.",
        author: "hygiene_disruptor",
        saves: 720,
      },
      {
        title: "Random Concept: 3 AM Ceiling Stare",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
        description: "Replaying that awkward interaction from sophomore year of high school on repeat.",
        author: "insomnia_club",
        saves: 940,
      },
      {
        title: "Random Idea: Silent Alarm Clock",
        imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=400&q=80",
        description: "Politely whispers into the void so you sleep through every meeting peacefully.",
        author: "chronically_late",
        saves: 830,
      },
      {
        title: "Random Concept: The Tangled Earphone Singularity",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
        description: "Pocket physics creating 8-dimensional topological knots in under 4 seconds.",
        author: "quantum_pocket",
        saves: 890,
      },
      {
        title: "Random Idea: Inflatable Dartboard",
        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
        description: "Single-use excitement guaranteed on the very first accurate throw.",
        author: "safety_first_not",
        saves: 610,
      },
      {
        title: "Random Concept: Lukewarm Microwave Mystery",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        description: "The bowl is 4,000 degrees Kelvin, but the center of the burrito is solid permafrost.",
        author: "culinary_physicist",
        saves: 980,
      }
    ]
  }
};

/**
 * Returns pins for a given topic. If the topic exists in the catalog (case-insensitive),
 * it returns rich curated items (combining custom doodle SVGs + real photos).
 * Repeats and cycles items to populate the physics feed with 18 cards.
 */
export function getPinsForTopic(topic: string): {
  id: string;
  title: string;
  imageUrl: string;
  topic: string;
  description: string;
  author: string;
  saveCount: number;
}[] {
  const raw = topic.trim().toLowerCase();
  const clean = raw.replace(/[^a-z0-9\s]/g, "").trim();
  const found =
    TOPIC_CATALOG[raw] ||
    TOPIC_CATALOG[clean] ||
    TOPIC_CATALOG[clean.replace(/s$/, "")] ||
    TOPIC_CATALOG[clean + "s"] ||
    TOPIC_CATALOG[clean.replace(/\s+/g, "-")] ||
    null;

  if (found && found.items.length > 0) {
    const totalNeeded = 18;
    return Array.from({ length: totalNeeded }, (_, idx) => {
      const item = found.items[idx % found.items.length];
      return {
        id: `${found.slug}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        title: idx < found.items.length ? item.title : `${item.title} #${Math.floor(idx / found.items.length) + 1}`,
        imageUrl: item.imageUrl,
        topic: found.name,
        description: item.description,
        author: item.author,
        saveCount: item.saves + idx * 7,
      };
    });
  }

  // Fallback for custom search terms or uncataloged topics:
  return Array.from({ length: 18 }, (_, idx) => ({
    id: `${raw}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
    title: `${topic} photo #${idx + 1}`,
    imageUrl: `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80`,
    topic,
    description: `A legitimate visual inspiration for ${topic}.`,
    author: ["someone_online", "mystery_guest", "the_algorithm", "you_probably"][idx % 4],
    saveCount: 25 + idx * 11,
  }));
}
