import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { FaHouse } from 'react-icons/fa6'
import { Navigate, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import config from '../config/config'

// Full-screen image shown after a completed game, then back to home after `finale.seconds` (or via the home button).
export default function FinalePage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const finale = config.games[gameId]?.finale
  const home = () => navigate('/', { replace: true })

  useEffect(() => {
    if (!finale) return
    const id = setTimeout(home, finale.seconds * 1000)
    return () => clearTimeout(id)
  }, [finale]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!finale) return <Navigate to="/" replace />

  return (
    <Screen className="items-center justify-center">
      <motion.img
        src={finale.image}
        alt=""
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="size-full object-contain"
      />
      <button
        onClick={home}
        aria-label="Home"
        className="absolute top-10 left-10 grid size-20 place-items-center rounded-full bg-surface text-3xl shadow-card active:scale-95"
      >
        <FaHouse />
      </button>
    </Screen>
  )
}
