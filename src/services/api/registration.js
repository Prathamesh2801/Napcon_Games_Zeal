import config from '../../config/config'

const BACKUP_KEY = 'napcon:pending-registrations'

function readPending() {
  try {
    return JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]')
  } catch {
    return []
  }
}

function writePending(list) {
  try {
    if (list.length) localStorage.setItem(BACKUP_KEY, JSON.stringify(list))
    else localStorage.removeItem(BACKUP_KEY)
  } catch {
    console.error('Registration backup unavailable', list)
  }
}

async function send(data) {
  const res = await fetch(config.api.registerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(config.api.timeoutMs),
  })
  const body = await res.json().catch(() => null)
  if (body?.ok) return
  if (res.status >= 400 && res.status < 500 && body) {
    console.error('Registration rejected', body.errors ?? body.error, data)
    return
  }
  throw new Error(`HTTP ${res.status}`)
}

async function flushPending() {
  const left = []
  for (const item of readPending()) {
    try {
      await send(item)
    } catch {
      left.push(item)
    }
  }
  writePending(left)
}

export async function submitRegistration(data) {
  if (!config.api.registerUrl) return writePending([...readPending(), data])
  try {
    await send(data)
  } catch (err) {
    console.error('Registration submit failed, saved locally', err)
    return writePending([...readPending(), data])
  }
  flushPending()
}
