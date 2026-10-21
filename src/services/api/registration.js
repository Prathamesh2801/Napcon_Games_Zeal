import config from '../../config/config'

const BACKUP_KEY = 'napcon:pending-registrations'

// Never blocks the game: on failure the entry is kept in localStorage so no visitor data is lost.
export async function submitRegistration(data) {
  const { registerUrl, timeoutMs } = config.api
  if (!registerUrl) return

  try {
    const res = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } catch (err) {
    console.error('Registration submit failed, saved locally', err)
    try {
      const pending = JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]')
      localStorage.setItem(BACKUP_KEY, JSON.stringify([...pending, data]))
    } catch {
      // storage unavailable; nothing more we can do offline
    }
  }
}
