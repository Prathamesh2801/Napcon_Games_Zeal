import chainBreakSfx from '../assets/sounds/chain-break.wav'
import correctSfx from '../assets/sounds/correct.wav'
import wrongSfx from '../assets/sounds/wrong.mp3'
import config from '../config/config'

const sounds = { correct: new Audio(correctSfx), wrong: new Audio(wrongSfx), chainBreak: new Audio(chainBreakSfx) }

// Restarts the clip so quick consecutive triggers each get their sound.
export function play(name) {
  if (!config.sound.enabled) return
  const audio = sounds[name]
  audio.volume = config.sound.volume
  audio.currentTime = 0
  audio.play().catch(() => {})
}
