import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import Stage from '../components/layout/Stage'
import OnScreenKeyboard from '../components/ui/OnScreenKeyboard'
import config from '../config/config'
import CycleHero from '../features/cycle/CycleHero'
import { INTRO_LAYOUT, REGISTER_LAYOUT, heroStyle } from '../features/cycle/layouts'
import Portal from '../features/cycle/Portal'
import { HANDOFF_SPEED, MORPH_MS, PORTAL_MS, STAGE_HEIGHT, stageTop, viewportRem, wait } from '../features/cycle/stage'
import RegistrationForm from '../features/registration/RegistrationForm'
import useRegistrationForm from '../features/registration/useRegistrationForm'
import useIdleRedirect from '../hooks/useIdleRedirect'
import { submitRegistration } from '../services/api/registration'

const { screen, onScreenKeyboard } = config.registration

const HERO = { ...REGISTER_LAYOUT.box, openTop: 3.5 }
const FORM = { top: 59.69, height: 47.75 }
const KEYBOARD = 33
const toIntro = !!config.intro?.enabled
const morph = { duration: MORPH_MS / 1000, ease: [0.22, 1, 0.36, 1] }

function openLayout() {
  const shift = Math.min(0, viewportRem() - KEYBOARD - 1.5 - (stageTop() + FORM.top + FORM.height))
  const room = FORM.top + shift - 1 - HERO.openTop
  return { formY: shift, heroY: HERO.openTop - HERO.top, heroScale: Math.min(1, room / HERO.height) }
}

export default function RegisterPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  useIdleRedirect(config.registration.idleTimeoutSeconds)
  const form = useRegistrationForm()
  const [leaving, setLeaving] = useState(false)
  const [layout, setLayout] = useState(openLayout)
  const speed = useMotionValue(360 / screen.arrowSecondsPerTurn)

  useEffect(() => {
    const onResize = () => setLayout(openLayout())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!config.games[gameId]) return <Navigate to="/" replace />

  const keyboardOpen = onScreenKeyboard && !!form.active && !leaving
  const centreY = STAGE_HEIGHT / 2 - (HERO.top + HERO.height * 0.54)

  const submit = async e => {
    e.preventDefault()
    if (leaving) return
    const player = form.check()
    form.focus(null)
    setLeaving(true)
    animate(speed, toIntro ? HANDOFF_SPEED : 1100, { duration: toIntro ? MORPH_MS / 1000 : 1.1, ease: 'easeIn' })
    await Promise.all([
      submitRegistration({ ...player, game: gameId, registeredAt: new Date().toISOString() }),
      wait(toIntro ? MORPH_MS : PORTAL_MS),
    ])
    if (toIntro) navigate(`/intro/${gameId}`, { replace: true, state: { player, fromRegister: true } })
    else navigate(`/play/${gameId}`, { replace: true, state: { player } })
  }

  const heroAnimate = leaving
    ? toIntro
      ? { y: `${INTRO_LAYOUT.box.top - HERO.top}rem`, scale: INTRO_LAYOUT.box.width / HERO.width, transition: morph }
      : { y: `${centreY}rem`, scale: 1.12, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    : keyboardOpen
      ? { y: `${layout.heroY}rem`, scale: layout.heroScale }
      : { y: 0, scale: 1 }

  const formAnimate = leaving
    ? { y: '8rem', opacity: 0, filter: 'blur(0.5rem)', transition: { duration: 0.45, ease: 'easeIn' } }
    : { y: keyboardOpen ? `${layout.formY}rem` : 0, opacity: 1, filter: 'blur(0rem)' }

  return (
    <Screen className="overflow-hidden bg-night">
      <form
        onSubmit={submit}
        noValidate
        onPointerDown={e => {
          if (!e.target.closest('label, input, button')) form.focus(null)
        }}
        className="absolute inset-0"
      >
        <motion.img
          src={screen.background}
          alt=""
          initial={{ scale: 1.08 }}
          animate={{ scale: leaving && !toIntro ? 1.18 : 1 }}
          transition={{ duration: leaving ? 1.4 : 1.6, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <Stage>
          <motion.img
            src={screen.logo}
            alt="Sun Pharma"
            initial={{ opacity: 0, y: '-2rem' }}
            animate={{ opacity: leaving && !toIntro ? 0 : 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[3.875rem] right-[3.25rem] w-[12.19rem]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, ...heroAnimate }}
            transition={{ type: 'spring', stiffness: 170, damping: 26 }}
            style={{ ...heroStyle(REGISTER_LAYOUT), transformOrigin: '50% 0%' }}
            className="absolute"
          >
            <CycleHero art={screen} layout={REGISTER_LAYOUT} speed={speed} pulse={leaving && !toIntro} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: '6rem' }}
            animate={formAnimate}
            transition={{ type: 'spring', stiffness: 170, damping: 26 }}
            className="absolute inset-x-0"
            style={{ top: `${FORM.top}rem` }}
          >
            <RegistrationForm screen={screen} fieldProps={form.fieldProps} submitting={leaving} />
          </motion.div>
        </Stage>

        {onScreenKeyboard && (
          <OnScreenKeyboard
            open={keyboardOpen}
            layout={form.active === 'phone' ? 'numeric' : 'text'}
            title={form.active === 'phone' ? 'Phone Number' : 'Full Name'}
            onKey={form.press}
          />
        )}

        {leaving && !toIntro && <Portal />}
      </form>
    </Screen>
  )
}
