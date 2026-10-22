import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import Stage from '../components/layout/Stage'
import config from '../config/config'
import CycleHero from '../features/cycle/CycleHero'
import { INTRO_LAYOUT, REGISTER_LAYOUT, heroStyle } from '../features/cycle/layouts'
import Portal from '../features/cycle/Portal'
import { HANDOFF_SPEED, PORTAL_MS, STAGE_HEIGHT, wait } from '../features/cycle/stage'
import ChallengeButton from '../features/intro/ChallengeButton'
import useIdleRedirect from '../hooks/useIdleRedirect'

const intro = config.intro
const art = config.registration.screen
const box = INTRO_LAYOUT.box

const enter = delay => ({
  initial: { opacity: 0, y: '2rem' },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
})

const gradientText = 'bg-[linear-gradient(180deg,#eef4fa_0%,#cdebf6_55%,#8fe5f8_100%)] bg-clip-text text-transparent'

export default function IntroPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  useIdleRedirect(intro?.idleTimeoutSeconds)
  const fromRegister = !!state?.fromRegister
  const baseSpeed = 360 / art.arrowSecondsPerTurn
  const speed = useMotionValue(fromRegister ? HANDOFF_SPEED : baseSpeed)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const spin = animate(speed, baseSpeed, { duration: 1.8, ease: 'easeOut' })
    return () => spin.stop()
  }, [speed, baseSpeed])

  if (!config.games[gameId] || !intro) return <Navigate to="/" replace />

  const start = async () => {
    if (leaving) return
    setLeaving(true)
    animate(speed, 1100, { duration: 1.1, ease: 'easeIn' })
    await wait(PORTAL_MS)
    navigate(`/play/${gameId}`, { replace: true, state: { player: state?.player } })
  }

  const centreY = STAGE_HEIGHT / 2 - (box.top + box.height * 0.54)
  const [first, second] = intro.title
  const fade = leaving ? { opacity: 0, y: '-2rem', filter: 'blur(0.4rem)', transition: { duration: 0.4 } } : {}

  return (
    <Screen animateIn={!fromRegister} className="overflow-hidden bg-night">
      <motion.img
        src={art.background}
        alt=""
        animate={{ scale: leaving ? 1.18 : 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <Stage>
        <motion.img
          src={art.logo}
          alt="Sun Pharma"
          animate={{ opacity: leaving ? 0 : 1 }}
          className="absolute top-[3.875rem] right-[3.25rem] w-[12.19rem]"
        />

        <motion.div animate={fade} className="absolute inset-x-0 top-0 h-[40rem]">
          <motion.img
            src={intro.brush}
            alt=""
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="absolute top-[13.59rem] left-[1.52rem] h-[11.88rem] w-[63.88rem]"
          />
          <motion.img
            src={intro.cycleIcon}
            alt=""
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: [0, 360] }}
            transition={{
              scale: { delay: 0.35, type: 'spring', stiffness: 220, damping: 14 },
              rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
            }}
            className="absolute top-[15.08rem] left-[7.59rem] h-[8.94rem] w-[7.64rem]"
          />
          <motion.h1
            {...enter(0.4)}
            className="absolute top-[16.75rem] left-[16.75rem] flex h-[5.2rem] items-center gap-[1.1rem] font-arial text-[3.64rem] leading-none font-bold"
          >
            <span className="text-white">{first}</span>
            <span className="bg-[linear-gradient(180deg,#7ce2f6_0%,#12c8f4_100%)] bg-clip-text text-transparent">
              {second}
            </span>
          </motion.h1>
          <motion.p
            {...enter(0.55)}
            className="absolute inset-x-0 top-[25.5rem] text-center font-arial text-[2.17rem] leading-[3.1rem] font-bold text-white"
          >
            {intro.subtitle}
          </motion.p>
          <div className="absolute inset-x-0 top-[30.75rem] text-center font-arial text-[5.03rem] leading-[5.5rem] font-bold drop-shadow-[0_0.3rem_0.6rem_rgb(0_0_0/0.35)]">
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: [0.6, 1.12, 1] }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="inline-block"
            >
              <span className="text-white">“</span>
              <motion.span
                animate={{
                  textShadow: [
                    '0 0 0 rgb(255 204 0 / 0)',
                    '0 0 1.6rem rgb(255 204 0 / 0.75)',
                    '0 0 0 rgb(255 204 0 / 0)',
                  ],
                }}
                transition={{ delay: 1.4, duration: 2.4, repeat: Infinity }}
                className="text-[#ffcc00]"
              >
                {intro.quote.highlight}
              </motion.span>
            </motion.span>{' '}
            <motion.span {...enter(0.9)} className={`inline-block ${gradientText}`}>
              {intro.quote.line1}
            </motion.span>
            <br />
            <motion.span {...enter(1.05)} className={`inline-block ${gradientText}`}>
              {intro.quote.line2}”
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={fromRegister ? false : { opacity: 0, scale: 0.85 }}
          animate={
            leaving
              ? { opacity: 1, y: `${centreY}rem`, scale: 1.12, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ type: 'spring', stiffness: 170, damping: 26 }}
          style={{ ...heroStyle(INTRO_LAYOUT), transformOrigin: '50% 0%' }}
          className="absolute"
        >
          <CycleHero
            art={art}
            layout={INTRO_LAYOUT}
            from={fromRegister ? REGISTER_LAYOUT : null}
            speed={speed}
            pulse={leaving}
          />
        </motion.div>

        <motion.img
          src={intro.tagline}
          alt=""
          initial={{ opacity: 0, scale: 0.7 }}
          animate={leaving ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
          transition={{ delay: leaving ? 0 : 1.05, type: 'spring', stiffness: 180, damping: 14 }}
          className="absolute top-[85.2rem] left-[10.16rem] h-[15.58rem] w-[46.57rem]"
        />

        <motion.div animate={leaving ? { opacity: 0, y: '3rem' } : {}} transition={{ duration: 0.35 }}>
          <ChallengeButton
            label={intro.button}
            disabled={leaving}
            onClick={start}
            className="absolute top-[104.2rem] left-[8.75rem] h-[9.5rem] w-[50rem]"
          />
        </motion.div>
      </Stage>

      {leaving && <Portal tone="night" />}
    </Screen>
  )
}
