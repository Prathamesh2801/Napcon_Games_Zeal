export function shuffle(list) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function splitHalf(list) {
  const mid = Math.ceil(list.length / 2)
  return [list.slice(0, mid), list.slice(mid)]
}

export function canPlace(token, slotId, { placed, slotOrder, strictOrder }) {
  if (![].concat(token.slot).includes(slotId) || placed[slotId]) return false
  return !strictOrder || slotOrder.find(id => !placed[id]) === slotId
}

export function solveBoard(tokens, slotOrder) {
  const used = new Set()
  const placed = {}
  for (const id of slotOrder) {
    const token = tokens.find(t => !used.has(t.id) && [].concat(t.slot).includes(id))
    if (!token) continue
    used.add(token.id)
    placed[id] = token
  }
  return placed
}

export function calcScore({ correct, mistakes, timeLeft }, scoring) {
  const raw =
    correct * scoring.pointsPerCorrect -
    mistakes * scoring.penaltyPerMistake +
    (timeLeft ?? 0) * scoring.timeBonusPerSecond
  return Math.max(0, raw)
}

export function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
