window.NAPCON_CONFIG = {
  devMode: false,

  app: {
    title: "Napcon Games",
    subtitle: "Choose a game to begin",
    doubleTapFullscreen: true,
  },

  sound: {
    enabled: true,
    volume: 1,
    files: {
      correct: "media/sounds/correct.wav",
      wrong: "media/sounds/wrong.mp3",
      chainBreak: "media/sounds/chain-break.wav",
    },
  },

  timing: {
    resultRedirectSeconds: 10,
    completionDelayMs: 800,
  },

  registration: {
    enabled: true,
    onScreenKeyboard: true,
    idleTimeoutSeconds: 60,
    fields: {
      name: { required: false, minLength: 2, maxLength: 40 },
      phone: { required: false, length: 10 },
    },
  },

  api: {
    registerUrl: "api/register.php",
    timeoutMs: 5000,
  },

  scoring: {
    pointsPerCorrect: 100,
    penaltyPerMistake: 20,
    timeBonusPerSecond: 5,
  },

  games: {
    lungs: {
      title: "Lungs Game",
      description: "Place the 5 steps on the lungs in order",
      timeLimit: 60,
      strictOrder: true,
      art: "media/lungs.webp",
      chain: "media/chain.webp",
      finale: { image: "media/finale-lungs.svg", seconds: 10 },
      ring: { x: 50, y: 52, size: 74 },
      tokens: [
        { id: "inflammation", label: "Inflammation", slot: 1 },
        { id: "mucus", label: "Mucus Accumulation", slot: 2 },
        { id: "damage", label: "Airway Damage", slot: 3 },
        { id: "infection", label: "Infection", slot: 4 },
        { id: "more-mucus", label: "More Mucus Production", slot: 5 },
        { id: "airflow", label: "Healthy Airflow", slot: null },
        { id: "clear", label: "Clear Airways", slot: null },
        { id: "broncho", label: "Broncho­dilation", slot: null },
      ],
    },

    table: {
      title: "SITT Half-life Match",
      description: "Drag each half-life value into its correct cell",
      timeLimit: 120,
      finale: { image: "media/finale-table.svg", seconds: 10 },
      corner: "SITT Combination",
      columns: [
        { label: "Besvil-G", highlight: true },
        { label: "BUD + FOR + GLY" },
        { label: "INDA + MOM + GLY" },
        { label: "FLU-P + FOR + GLY" },
      ],
      rows: [
        { label: "ICS Half‑life", color: "#1f7fc4" },
        { label: "LABA Half‑life", color: "#283a8f" },
        { label: "LAMA Half‑life", color: "#178048" },
        {
          label: "Half‑life Duration Assessment",
          color: "#283a8f",
          assessment: true,
        },
      ],
      cells: [
        ["~24 hrs⁴", "2.8 hrs¹", "5.8 hrs⁵", "7.8 hrs⁷"],
        ["~21 hrs⁴", "10 hrs²", "33.9 hrs⁶", "10 hrs²"],
        ["~33–57 hrs³", "~33–57 hrs³", "~33–57 hrs³", "~33–57 hrs³"],
        [
          "Aligned",
          "Significant mismatch",
          "Major mismatch",
          "Significant mismatch",
        ],
      ],
      tones: {
        Aligned: "#1d55b3",
        "Significant mismatch": "#ec7a2c",
        "Major mismatch": "#c8202f",
        "Near-aligned profile": "#b8741a",
      },
    },
  },
};
