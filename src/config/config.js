import content from './content'

const runtime = window.NAPCON_CONFIG ?? {}
const t = runtime.timings ?? {}
const pick = (value, fallback) => (typeof value === 'number' ? value : fallback)

const config = structuredClone(content)
const lungs = config.games.lungs

if (typeof runtime.registerUrl === 'string') config.api.registerUrl = runtime.registerUrl
config.registration.idleTimeoutSeconds = pick(t.registerIdleSeconds, config.registration.idleTimeoutSeconds)
config.intro.idleTimeoutSeconds = pick(t.introIdleSeconds, config.intro.idleTimeoutSeconds)
config.registration.screen.arrowSecondsPerTurn = pick(t.arrowSecondsPerTurn, config.registration.screen.arrowSecondsPerTurn)
lungs.arrowSecondsPerTurn = pick(t.arrowSecondsPerTurn, lungs.arrowSecondsPerTurn)
lungs.timeLimit = pick(t.gameSeconds, lungs.timeLimit)
lungs.completeSeconds = pick(t.completeSeconds, lungs.completeSeconds)
lungs.timeUp.homeSeconds = pick(t.timeUpHomeSeconds, lungs.timeUp.homeSeconds)
lungs.finale.seconds = pick(t.finaleSeconds, lungs.finale.seconds)

export default config
