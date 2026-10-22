import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import Stage from '../components/layout/Stage'
import config from '../config/config'
import CycleArrows from '../features/cycle/CycleArrows'

const BANNER = [1.44, 12.361, 64.002, 22.608]
const LUNGS = [15.56, 38.56, 36.25, 34.06]
const PACK = [20.4, 81.2, 26.8, 17.5]
const STAND = [0, 89, 66.9, 11.663]
const BURST = ['#ffd23f', '#ff2d7a', '#7ff6ff', '#ffffff', '#ffb000', '#ff6a9e']
const OUT_MS = 600
const ease = [0.22, 1, 0.36, 1]

const box = ([left, top, width, height]) => ({
  left: `${left}rem`,
  top: `${top}rem`,
  width: `${width}rem`,
  height: `${height}rem`,
})

function Burst({ delay }) {
  return Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2 + (i % 3) * 0.2
    const d = 16 + ((i * 7) % 5) * 4
    const size = 0.7 + (i % 4) * 0.35
    return (
      <motion.span
        key={i}
        initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
        animate={{ x: `${Math.cos(a) * d * 1.6}rem`, y: `${Math.sin(a) * d}rem`, opacity: [0, 1, 0], scale: [0, 1, 0.6], rotate: 180 }}
        transition={{ delay, duration: 1.4, ease: 'easeOut' }}
        style={{ width: `${size}rem`, height: `${size * (i % 2 ? 1 : 2.2)}rem`, background: BURST[i % BURST.length] }}
        className="absolute top-[23.6rem] left-[33.75rem] rounded-full shadow-[0_0_0.8rem_rgb(255_255_255/0.8)]"
      />
    )
  })
}

export default function BrokenPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const settings = config.games[gameId]
  const art = config.registration.screen
  const seconds = settings?.broken?.seconds ?? 10
  const speed = useMotionValue(state?.fromBreak ? 700 : 360 / art.arrowSecondsPerTurn)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const spin = animate(speed, 360 / art.arrowSecondsPerTurn, { duration: 2.5, ease: 'easeOut' })
    const out = setTimeout(() => setLeaving(true), seconds * 1000 - OUT_MS)
    const next = setTimeout(() => navigate(`/finale/${gameId}`, { replace: true }), seconds * 1000)
    return () => {
      spin.stop()
      clearTimeout(out)
      clearTimeout(next)
    }
  }, [])

  if (!settings?.break) return <Navigate to="/" replace />

  const src = name => `${settings.break.media}/${name}.webp`

  return (
    <Screen animateIn={!state?.fromBreak} className="overflow-hidden bg-night">
      <img src={settings.media.background} alt="" className="absolute inset-0 h-full w-full object-cover" />

      <Stage>
        <img src={settings.media.logo} alt="Sun Pharma" className="absolute top-[3.875rem] right-[3.25rem] w-[12.19rem]" />

        <motion.div
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[30rem] left-[3.75rem] size-[60rem] rounded-full bg-[radial-gradient(circle,rgb(127_246_255/0.45)_0%,rgb(0_120_255/0.15)_45%,transparent_70%)]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -60 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.1, ease }}
          className="absolute top-[27.66rem] left-[4.85rem] w-[57.8rem]"
        >
          <CycleArrows speed={speed} className="w-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 13 }}
          style={box(LUNGS)}
          className="absolute"
        >
          <motion.img
            src={art.lungs}
            alt=""
            animate={{
              scale: [1, 1.05, 1],
              filter: [
                'drop-shadow(0 0 1rem rgb(255 120 160 / 0.45))',
                'drop-shadow(0 0 2.6rem rgb(255 120 160 / 0.85))',
                'drop-shadow(0 0 1rem rgb(255 120 160 / 0.45))',
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-full"
          />
        </motion.div>

        <motion.img
          src={src('stand')}
          alt=""
          initial={{ opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease }}
          style={box(STAND)}
          className="absolute"
        />

        <motion.div
          initial={{ opacity: 0, y: '6rem' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 80, damping: 13 }}
          style={box(PACK)}
          className="absolute"
        >
          <motion.img
            src={src('pack')}
            alt=""
            animate={{ y: ['0rem', '-0.7rem', '0rem'] }}
            transition={{ delay: 1.5, duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-full drop-shadow-[0_0_1.2rem_rgb(127_246_255/0.5)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 2.4, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.45, type: 'spring', stiffness: 260, damping: 15, opacity: { delay: 0.45, duration: 0.2 } }}
          style={box(BANNER)}
          className="absolute"
        >
          <motion.img
            src={src('banner')}
            alt=""
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ delay: 1.6, duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-full drop-shadow-[0_0.6rem_1.6rem_rgb(0_0_0/0.45)]"
          />
        </motion.div>

        <Burst delay={0.75} />
      </Stage>

      {state?.fromBreak && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_50%_47%,#ffffff_0%,#c9fbff_35%,#7ff6ff_70%)]"
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 1 : 0 }}
        transition={{ duration: OUT_MS / 1000 }}
        className="pointer-events-none absolute inset-0 z-30 bg-white"
      />
    </Screen>
  )
}
