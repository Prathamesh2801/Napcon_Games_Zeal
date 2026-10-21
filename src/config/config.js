import lungsArt from '../assets/images/lungs-placeholder.svg'

// Single place to tune the kiosk. Rebuild (npm run build) after changes.
const config = {
  app: {
    title: 'Napcon Games',
    subtitle: 'Choose a game to begin',
    doubleTapFullscreen: true, // double tap empty space = enter/exit fullscreen; false at the event so visitors can't exit
  },

  sound: {
    enabled: true, // right/wrong drop effects (src/assets/sounds/correct.wav, wrong.mp3)
    volume: 1, // 0–1
  },

  timing: {
    resultRedirectSeconds: 10, // result screen → home (resets on touch)
    completionDelayMs: 800, // pause after the last correct drop before the result
  },

  registration: {
    enabled: true, // false = skip the form and go straight to the game
    onScreenKeyboard: true, // false = rely on physical / OS keyboard only
    idleTimeoutSeconds: 60, // abandoned form → home
    fields: {
      name: { required: false, minLength: 2, maxLength: 40 },
      phone: { required: false, length: 10 },
    },
  },

  api: {
    registerUrl: '', // e.g. 'http://localhost/napcon-api/register.php' — empty = don't send
    timeoutMs: 5000,
  },

  scoring: {
    pointsPerCorrect: 100,
    penaltyPerMistake: 20,
    timeBonusPerSecond: 5,
  },

  // Token rule for both games: a token goes to exactly one slot.
  // A token with no slot (slot: null / no row) is a distractor that never fits.
  games: {
    lungs: {
      title: 'Lungs Game',
      description: 'Place the 5 symptoms on the lungs in order',
      timeLimit: 60, // seconds, null = no timer
      strictOrder: true, // slots must be filled 1 → 5
      art: lungsArt,
      ring: { x: 50, y: 58, size: 62 }, // % of the art: center x, center y, diameter (of width)
      tokens: [
        { id: 'cough', label: 'Cough', slot: 1 },
        { id: 'breathless', label: 'Breathless­ness', slot: 2 }, // ­ = soft hyphen, wraps long words in the circle
        { id: 'wheezing', label: 'Wheezing', slot: 3 },
        { id: 'chest', label: 'Chest tightness', slot: 4 },
        { id: 'fatigue', label: 'Fatigue', slot: 5 },
        // { id: 'image-example', label: 'Inhaler', slot: null, image: someImport },
      ],
    },

    // Header row + first column are static; every value in `cells` becomes a draggable token.
    // Identical values (e.g. ~33–57 hrs³) are interchangeable between their cells.
    table: {
      title: 'SITT Half-life Match',
      description: 'Drag each half-life value into its correct cell',
      timeLimit: 120,
      corner: 'SITT Combination',
      columns: [
        { label: 'Besvil-G', highlight: true }, // add image: someImport to show the logo instead of text
        { label: 'BUD + FOR + GLY' },
        { label: 'INDA + MOM + GLY' },
        { label: 'FLU-P + FOR + GLY' },
      ],
      rows: [
        { label: 'ICS Half‑life', color: '#1f7fc4' },
        { label: 'LABA Half‑life', color: '#283a8f' },
        { label: 'LAMA Half‑life', color: '#178048' },
        { label: 'Half‑life Duration Assessment', color: '#283a8f', assessment: true },
      ],
      cells: [
        ['~24 hrs⁴', '2.8 hrs¹', '5.8 hrs⁵', '7.8 hrs⁷'],
        ['~21 hrs⁴', '10 hrs²', '33.9 hrs⁶', '10 hrs²'],
        ['~33–57 hrs³', '~33–57 hrs³', '~33–57 hrs³', '~33–57 hrs³'],
        ['Aligned', 'Significant mismatch', 'Major mismatch', 'Significant mismatch'],
      ],
      tones: {
        Aligned: '#1d55b3',
        'Significant mismatch': '#ec7a2c',
        'Major mismatch': '#c8202f',
        'Near-aligned profile': '#b8741a',
      },
    },
  },
}

export default config
