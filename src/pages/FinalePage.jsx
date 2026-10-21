import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import config from '../config/config'

// Full-screen image shown after a completed game, then back to home after `finale.seconds`.
export default function FinalePage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const finale = config.games[gameId]?.finale

  useEffect(() => {
    if (!finale) return
    const id = setTimeout(() => navigate('/', { replace: true }), finale.seconds * 1000)
    return () => clearTimeout(id)
  }, [finale, navigate])

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
    </Screen>
  )
}
