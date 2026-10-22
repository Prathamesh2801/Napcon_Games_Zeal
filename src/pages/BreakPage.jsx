import { animate, motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { useState } from 'react'
import { LuPointer } from 'react-icons/lu'
import { Navigate, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import Stage from '../components/layout/Stage'
import config from '../config/config'
import { wait } from '../features/cycle/stage'
import ChallengeButton from '../features/intro/ChallengeButton'
import { play } from '../services/sound'

const CHAIN = [0.222, 30.09, 62.97, 53.084]
const LUNGS = [20.14, 42.19, 26.046, 24.398]
const PACK = [19.463, 76.505, 27.963, 18.265]
const STAND = [0, 86.274, 66.9, 11.663]
const CENTRE = [31.707, 56.632]
const BADGES = [
  { box: [25.054, 27.461, 15.362, 15.432], pill: 63.3 },
  { box: [45.932, 38.643, 16.778, 15.503], pill: 63.47 },
  { box: [41.756, 61.078, 19.61, 15.503], pill: 63.01 },
  { box: [5.52, 61.078, 19.61, 15.503], pill: 63.01 },
  { box: [4.176, 38.643, 16.778, 15.503], pill: 63.47 },
]
const SHARDS = 10
const RISE_MS = 1500
const CHARGE_MS = 1400
const BREAK_MS = 1700
const OUT_MS = 500
const ease = [0.22, 1, 0.36, 1]

const box = ([left, top, width, height]) => ({
  left: `${left}rem`,
  top: `${top}rem`,
  width: `${width}rem`,
  height: `${height}rem`,
})

const wedge = i => {
  const step = 360 / SHARDS
  const points = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const a = ((i + f) * step * Math.PI) / 180
    return `${50 + 80 * Math.cos(a)}% ${50 + 80 * Math.sin(a)}%`
  })
  return `polygon(50% 50%, ${points.join(', ')})`
}

const away = ([left, top, width, height], distance) => {
  const dx = left + width / 2 - CENTRE[0]
  const dy = top + height / 2 - CENTRE[1]
  const len = Math.hypot(dx, dy) || 1
  return { x: `${(dx / len) * distance}rem`, y: `${(dy / len) * distance}rem` }
}

function Shards({ src }) {
  return Array.from({ length: SHARDS }, (_, i) => {
    const a = ((i + 0.5) * (360 / SHARDS) * Math.PI) / 180
    const spin = (i % 2 ? 1 : -1) * (40 + ((i * 37) % 50))
    return (
      <motion.img
        key={i}
        src={src}
        alt=""
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
        animate={{ x: `${Math.cos(a) * 34}rem`, y: `${Math.sin(a) * 34}rem`, rotate: spin, opacity: 0, scale: 0.75 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], opacity: { duration: 1.1, ease: 'easeIn' } }}
        style={{ clipPath: wedge(i) }}
        className="absolute inset-0 h-full w-full"
      />
    )
  })
}

export default function BreakPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const settings = config.games[gameId]
  const [phase, setPhase] = useState('idle')
  const spin = useMotionValue(0)
  const speed = useMotionValue(8)

  useAnimationFrame((_, delta) => spin.set(spin.get() + (speed.get() * delta) / 1000))

  if (!settings?.break) return <Navigate to="/" replace />

  const { media, tokens } = settings
  const art = settings.break
  const src = name => `${art.media}/${name}.webp`
  const [first, second] = settings.title
  const rising = phase === 'rise'
  const charging = phase === 'charge'
  const broken = phase === 'break' || phase === 'out'

  const start = async () => {
    if (phase !== 'idle') return
    setPhase('rise')
    await wait(RISE_MS)
    setPhase('charge')
    animate(speed, 900, { duration: CHARGE_MS / 1000, ease: 'easeIn' })
    await wait(CHARGE_MS)
    play('chainBreak')
    setPhase('break')
    animate(speed, 40, { duration: 1.2, ease: 'easeOut' })
    await wait(BREAK_MS)
    setPhase('out')
    await wait(OUT_MS)
    navigate(`/broken/${gameId}`, { replace: true, state: { fromBreak: true } })
  }

  return (
    <Screen className="overflow-hidden bg-night">
      <motion.img
        src={media.background}
        alt=""
        animate={{ scale: charging ? 1.05 : 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <Stage>
        <img src={media.logo} alt="Sun Pharma" className="absolute top-[3.875rem] right-[3.25rem] w-[12.19rem]" />

        <motion.img
          src={media.brush}
          alt=""
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          style={box([3.847, 15.385, 59.386, 11.045])}
          className="absolute"
        />
        <motion.img
          src={media.cycleIcon}
          alt=""
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 360] }}
          transition={{
            scale: { delay: 0.35, type: 'spring', stiffness: 220, damping: 14 },
            rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
          }}
          style={box([9.512, 16.748, 7.1, 8.32])}
          className="absolute"
        />
        <motion.h1
          initial={{ opacity: 0, y: '2rem' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease }}
          className="absolute top-[18.2rem] left-[18.1rem] flex h-[5.2rem] items-center gap-[1.1rem] font-arial text-[3.75rem] leading-none font-bold"
        >
          <span className="text-white">{first}</span>
          <span className="bg-[linear-gradient(180deg,#7ce2f6_0%,#12c8f4_100%)] bg-clip-text text-transparent">{second}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 1.25 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease }}
          style={box(CHAIN)}
          className="absolute"
        >
          <motion.div style={{ rotate: spin }} className="absolute inset-0">
            {broken ? (
              <Shards src={src('chain')} />
            ) : (
              <motion.img
                src={src('chain')}
                alt=""
                animate={
                  charging
                    ? { filter: 'drop-shadow(0 0 2rem rgb(0 240 249 / 0.9)) brightness(1.35)', scale: [1, 0.96, 1.02, 0.97] }
                    : { filter: 'drop-shadow(0 0 0 rgb(0 240 249 / 0)) brightness(1)', scale: 1 }
                }
                transition={{ duration: CHARGE_MS / 1000, ease: 'easeIn' }}
                className="absolute inset-0 h-full w-full"
              />
            )}
          </motion.div>
        </motion.div>

        <motion.img
          src={src('stand')}
          alt=""
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1, filter: rising ? 'brightness(1.6)' : 'brightness(1)' }}
          transition={{ default: { delay: 1.3, duration: 0.8, ease }, filter: { duration: 0.5 } }}
          style={box(STAND)}
          className="absolute"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          style={box(LUNGS)}
          className="absolute"
        >
          <motion.img
            src={src('lungs')}
            alt=""
            animate={
              broken
                ? { opacity: 0, scale: 1.08 }
                : {
                    opacity: 1,
                    scale: [1, 1.035, 1],
                    filter: [
                      'drop-shadow(0 0 0.4rem rgb(255 60 60 / 0.3))',
                      'drop-shadow(0 0 1.6rem rgb(255 60 60 / 0.75))',
                      'drop-shadow(0 0 0.4rem rgb(255 60 60 / 0.3))',
                    ],
                  }
            }
            transition={broken ? { duration: 0.6 } : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full"
          />
          {broken && (
            <motion.img
              src={config.registration.screen.lungs}
              alt=""
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: [0.85, 1.12, 1.04] }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-0 h-full w-full drop-shadow-[0_0_2rem_rgb(255_120_160/0.8)]"
            />
          )}
        </motion.div>

        {BADGES.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={
              broken
                ? { opacity: 0, scale: 0.6, ...away(b.box, 22), rotate: i % 2 ? 25 : -25 }
                : charging
                  ? { opacity: 1, scale: 0.92, x: 0, y: 0, rotate: 0 }
                  : { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }
            }
            transition={
              broken
                ? { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
                : { delay: phase === 'idle' ? 0.9 + i * 0.18 : 0, type: 'spring', stiffness: 260, damping: 16 }
            }
            style={box(b.box)}
            className="absolute"
          >
            <motion.div
              animate={{ y: ['0rem', '-0.5rem', '0rem'] }}
              transition={{ delay: 2 + i * 0.35, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <img src={src(`badge-${i + 1}`)} alt="" className="absolute inset-0 h-full w-full" />
              <div
                style={{ top: `${b.pill}%` }}
                className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center font-display text-[1.5rem] leading-[1.55rem] whitespace-nowrap text-night"
              >
                {(art.labels?.[i] ?? [tokens[i]?.label]).map(line => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={
            charging
              ? { opacity: [0, 0.9, 1], scaleY: 1 }
              : broken
                ? { opacity: 0, scaleY: 1.3 }
                : { opacity: 0, scaleY: 0 }
          }
          transition={{ duration: charging ? CHARGE_MS / 1000 : 0.5, ease: 'easeIn' }}
          className="absolute top-[52rem] left-[29.7rem] h-[28rem] w-[8rem] origin-bottom rounded-full bg-[linear-gradient(0deg,rgb(255_255_255/0.95)_0%,rgb(127_246_255/0.8)_45%,rgb(0_240_249/0)_100%)] blur-[1.2rem]"
        />

        {rising && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
            transition={{ duration: RISE_MS / 1000, times: [0, 0.4, 1], ease: 'easeOut' }}
            className="pointer-events-none absolute top-[68rem] left-[21.75rem] h-[24rem] w-[24rem] origin-bottom rounded-[50%] bg-[linear-gradient(0deg,rgb(255_255_255/0.9)_0%,rgb(127_246_255/0.55)_40%,rgb(0_240_249/0)_100%)] blur-[1.5rem]"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[94.8rem] overflow-hidden">
          <motion.div
            initial={{ y: '19rem' }}
            animate={
              phase === 'idle'
                ? { y: '19rem' }
                : rising
                  ? { y: ['19rem', '-1.2rem', '0rem'] }
                  : charging
                    ? { y: ['0rem', '-9rem'], scale: [1, 1.08] }
                    : { y: '0rem', scale: 1 }
            }
            transition={
              rising
                ? { duration: RISE_MS / 1000, times: [0, 0.75, 1], ease: 'easeOut' }
                : charging
                  ? { duration: CHARGE_MS / 1000, ease: 'easeInOut' }
                  : { type: 'spring', stiffness: 90, damping: 14 }
            }
            style={box(PACK)}
            className="absolute"
          >
            <motion.img
              src={src('pack')}
              alt=""
              animate={
                charging || rising
                  ? { y: 0, filter: 'drop-shadow(0 0 3rem rgb(127 246 255 / 1)) brightness(1.15)' }
                  : broken
                    ? { y: ['0rem', '-0.7rem', '0rem'], filter: 'drop-shadow(0 0 1rem rgb(127 246 255 / 0.35)) brightness(1)' }
                    : { y: 0 }
              }
              transition={
                broken
                  ? { y: { delay: 1, duration: 3.6, repeat: Infinity, ease: 'easeInOut' }, filter: { duration: 0.6 } }
                  : { duration: 0.6 }
              }
              className="h-full w-full"
            />
          </motion.div>
        </div>

        {phase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.4, 1.8] }}
            transition={{ delay: RISE_MS / 1000 - 0.3, duration: 1.1, ease: 'easeOut' }}
            className="pointer-events-none absolute top-[88rem] left-[13.75rem] h-[9rem] w-[40rem] rounded-[50%] border-[0.4rem] border-cyan shadow-[0_0_2rem_rgb(0_240_249/0.8)]"
          />
        )}

        {broken &&
          [0, 0.12, 0.24].map(delay => (
            <motion.div
              key={delay}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 1, 0], scale: 3 }}
              transition={{ delay, duration: 1, ease: 'easeOut' }}
              className="pointer-events-none absolute top-[41.6rem] left-[16.7rem] size-[30rem] rounded-full border-[0.5rem] border-cyan shadow-[0_0_3rem_1rem_rgb(0_240_249/0.6),inset_0_0_3rem_1rem_rgb(0_240_249/0.5)]"
            />
          ))}

        <motion.div animate={phase === 'idle' ? { opacity: 1, y: 0 } : { opacity: 0, y: '3rem' }} transition={{ duration: 0.35 }}>
          <ChallengeButton
            label={art.button}
            lead={LuPointer}
            delay={2}
            textClassName="text-[3.1rem]"
            disabled={phase !== 'idle'}
            onClick={start}
            className="absolute top-[98rem] left-[11.5rem] h-[9.4rem] w-[44.5rem]"
          />
        </motion.div>
      </Stage>

      {broken && (
        <motion.div
          initial={{ opacity: 0.9 }}
          animate={{ opacity: phase === 'out' ? 1 : 0 }}
          transition={{ duration: phase === 'out' ? OUT_MS / 1000 : 0.7 }}
          className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_50%_47%,#ffffff_0%,#c9fbff_35%,#7ff6ff_70%)]"
        />
      )}
    </Screen>
  )
}
