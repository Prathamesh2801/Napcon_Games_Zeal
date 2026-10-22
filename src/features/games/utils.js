export function shuffle(list) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function canPlace(token, slotId, { placed, slotOrder, strictOrder }) {
  if (![].concat(token.slot).includes(slotId) || placed[slotId]) return false
  return !strictOrder || slotOrder.find(id => !placed[id]) === slotId
}
