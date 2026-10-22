window.NAPCON_CONFIG = {
  devMode: false,

  app: {
    title: "Napcon Games",
    logo: "",
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
      timeLimit: 60,
      strictOrder: true,
      art: "media/lungs.webp",
      chain: "media/chain.webp",
      finale: { image: "media/finale.svg", seconds: 10 },
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
  },
};
