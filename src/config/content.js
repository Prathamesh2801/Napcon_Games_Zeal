const content = {
  app: {
    doubleTapFullscreen: true,
  },

  sound: {
    enabled: true,
    volume: 1,
    files: {
      correct: 'media/sounds/correct.wav',
      wrong: 'media/sounds/wrong.mp3',
      chainBreak: 'media/sounds/chain-break.wav',
    },
  },


  registration: {
    enabled: true,
    onScreenKeyboard: true,
    idleTimeoutSeconds: 60,
    screen: {
      background: 'media/register/background.webp',
      logo: 'media/register/logo.webp',
      disc: 'media/register/disc.webp',
      lungs: 'media/register/lungs.webp',
      icons: [
        'media/register/icon-0.webp',
        'media/register/icon-1.webp',
        'media/register/icon-2.webp',
        'media/register/icon-3.webp',
        'media/register/icon-4.webp',
      ],
      brush: 'media/register/brush.webp',
      title: ['Vicious cycle', 'challenge'],
      subtitle: 'Enter your details to play',
      button: 'Start game',
      arrowSecondsPerTurn: 18,
    },
  },

  intro: {
    enabled: true,
    idleTimeoutSeconds: 60,
    brush: 'media/intro/brush.webp',
    cycleIcon: 'media/intro/cycle-icon.webp',
    tagline: 'media/intro/tagline.webp',
    title: ['Vicious Cycle', 'Challenge'],
    subtitle: 'In the treatment of Chronic Bronchitis in patients with COPD',
    quote: { highlight: 'Mucus', line1: 'is just one part', line2: 'of the story' },
    button: 'Start the challenge',
  },

  api: {
    registerUrl: 'api/register.php',
    timeoutMs: 5000,
  },


  games: {
    lungs: {
      timeLimit: 25,
      strictOrder: true,
      completeSeconds: 6,
      arrowSecondsPerTurn: 18,
      break: {
        media: 'media/break',
        button: 'Break the cycle',
        labels: [
          ['Airway', 'inflammation'],
          ['Mucus', 'hypersecretion'],
          ['Impaired', 'mucociliary clearance'],
          ['Mucus retention', 'and airway obstruction'],
          ['Exacerbations and', 'further airway injury'],
        ],
      },
      finale: { media: 'media/finale', seconds: 15, button: 'Play again' },
      title: ['Vicious Cycle', 'Challenge'],
      heading: 'Build the vicious cycle',
      instruction: 'Drag and drop the stages in the correct order to see how the cycle keeps going.',
      dropLabel: 'Drop here',
      trayTitle: 'Drag these stages',
      hint: ['Each stage reinforces the next.', 'Drag the stages to complete the vicious cycle.'],
      submit: 'Submit',
      timeUp: {
        title: "Time's up!",
        placed: 'You placed {placed} of {total} stages.',
        text: 'Have another go and complete the vicious cycle.',
        retry: 'Try again',
        home: 'Home',
        homeSeconds: 60,
        homeText: 'Returning to start in {seconds}s',
      },
      complete: 'Cycle complete!',
      media: {
        background: 'media/register/background.webp',
        logo: 'media/register/logo.webp',
        brush: 'media/intro/brush.webp',
        cycleIcon: 'media/intro/cycle-icon.webp',
        lungs: 'media/game/lungs.webp',
        stopwatch: 'media/game/stopwatch.webp',
        bulb: 'media/game/bulb.webp',
      },
      tokens: [
        { id: 'inflammation', label: 'Airway inflammation', slot: 1, icon: 'media/game/stage-1.webp', color: '#e3237e' },
        { id: 'hypersecretion', label: 'Mucus hypersecretion', slot: 2, icon: 'media/game/stage-2.webp', color: '#f59a1b' },
        { id: 'clearance', label: 'Impaired mucociliary clearance', slot: 3, icon: 'media/game/stage-3.webp', color: '#2bc4ec' },
        { id: 'obstruction', label: 'Mucus retention and airway obstruction', slot: 4, icon: 'media/game/stage-4.webp', color: '#22c35e' },
        { id: 'exacerbations', label: 'Exacerbations and further airway injury', slot: 5, icon: 'media/game/stage-5.webp', color: '#8b3cf6' },
      ],
    },
  },
}

export default content
