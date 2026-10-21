import { useEffect } from 'react'
import { Outlet } from 'react-router'
import config from '../config/config'

export default function KioskLayout() {
  useEffect(() => {
    const block = e => e.preventDefault()
    window.addEventListener('contextmenu', block)
    return () => window.removeEventListener('contextmenu', block)
  }, [])

  useEffect(() => {
    if (!config.app.doubleTapFullscreen || !document.fullscreenEnabled) return
    let last = { t: 0, x: 0, y: 0 }
    const onUp = e => {
      if (e.target.closest('button, input, .touch-none')) return
      const near = Math.hypot(e.clientX - last.x, e.clientY - last.y) < 40
      if (e.timeStamp - last.t < 350 && near) {
        last = { t: 0, x: 0, y: 0 }
        const toggle = document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen({ navigationUI: 'hide' })
        toggle.catch(() => {})
        return
      }
      last = { t: e.timeStamp, x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointerup', onUp)
    return () => window.removeEventListener('pointerup', onUp)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper font-sans text-ink">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[40rem] rounded-full bg-brand/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -bottom-48 size-[44rem] rounded-full bg-accent/10 blur-3xl" />
      <Outlet />
    </div>
  )
}
