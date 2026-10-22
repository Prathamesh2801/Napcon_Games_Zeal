export const wait = ms => new Promise(r => setTimeout(r, ms))

export const viewportRem = () => window.innerHeight / parseFloat(getComputedStyle(document.documentElement).fontSize)

export const STAGE_HEIGHT = 120

export const stageTop = () => (viewportRem() - STAGE_HEIGHT) / 2

export const PORTAL_MS = 1500
export const MORPH_MS = 950
export const HANDOFF_SPEED = 720
