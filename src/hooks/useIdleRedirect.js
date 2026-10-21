import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export default function useIdleRedirect(seconds, to = '/') {
  const navigate = useNavigate()
  const [left, setLeft] = useState(seconds)

  useEffect(() => {
    if (!seconds) return
    let deadline = Date.now() + seconds * 1000
    const bump = () => (deadline = Date.now() + seconds * 1000)
    const id = setInterval(() => {
      const s = Math.ceil((deadline - Date.now()) / 1000)
      if (s <= 0) navigate(to, { replace: true })
      else setLeft(s)
    }, 250)
    window.addEventListener('pointerdown', bump)
    window.addEventListener('keydown', bump)
    return () => {
      clearInterval(id)
      window.removeEventListener('pointerdown', bump)
      window.removeEventListener('keydown', bump)
    }
  }, [seconds, to, navigate])

  return left
}
