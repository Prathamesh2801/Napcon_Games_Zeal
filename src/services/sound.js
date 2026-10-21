import config from '../config/config'

const sounds = Object.fromEntries(Object.entries(config.sound.files).map(([name, src]) => [name, new Audio(src)]))

// Restarts the clip so quick consecutive triggers each get their sound.
export function play(name) {
  const audio = sounds[name]
  if (!config.sound.enabled || !audio) return
  audio.volume = config.sound.volume
  audio.currentTime = 0
  audio.play().catch(() => {})
}
