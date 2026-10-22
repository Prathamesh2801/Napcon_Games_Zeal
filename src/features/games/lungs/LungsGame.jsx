import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { FaForwardFast } from 'react-icons/fa6'
import Stage from '../../../components/layout/Stage'
import config from '../../../config/config'
import { play } from '../../../services/sound'
import CycleArrows from '../../cycle/CycleArrows'
import Portal from '../../cycle/Portal'
import { PORTAL_MS } from '../../cycle/stage'
import ChallengeButton from '../../intro/ChallengeButton'
import DragToken from '../components/DragToken'
import useMatchGame from '../hooks/useMatchGame'
import TimeUpModal from './TimeUpModal'

const SLOTS = [
  { left: 26.1, top: 35.1, width: 17.2, height: 8.75 },
  { left: 47.6, top: 47.5, width: 14.25, height: 9.25 },
  { left: 39.8, top: 70.8, width: 16.75, height: 9.5 },
  { left: 11.56, top: 70.8, width: 16.9, height: 9.5 },
  { left: 6.45, top: 48.1, width: 14.8, height: 9.25 },
]

const CARD_LEFTS = [4.2, 16.4, 28.6, 40.9, 53.1]

const rem = box => Object.fromEntries(Object.entries(box).map(([k, v]) => [k, `${v}rem`]))

const ease = [0.22, 1, 0.36, 1]

function CardFace({ token, big }) {
  return (
    <div
      style={{
        borderColor: token.color,
        background: `linear-gradient(135deg, ${token.color}66 0%, ${token.color}26 100%)`,
        boxShadow: `0 0 1.2rem ${token.color}80, inset 0 0 1rem ${token.color}40`,
      }}
      className={`flex h-full w-full items-center rounded-[0.9rem] border-[0.15rem] bg-night/75 text-left font-display text-white ${
        big ? 'gap-[0.9rem] px-[1rem]' : 'gap-[0.5rem] px-[0.5rem]'
      }`}
    >
      <img src={token.icon} alt="" className={`shrink-0 object-contain ${big ? 'w-[3.8rem]' : 'w-[3.2rem]'}`} />
      <span className={big ? 'text-[1.45rem] leading-[1.2]' : 'text-[1.12rem] leading-[1.2]'}>{token.label}</span>
    </div>
  )
}

function Slot({ index, id, token, state, label }) {
  const glow = {
    next: ['0 0 0.6rem 0 rgb(0 240 249 / 0.35)', '0 0 2.2rem 0.4rem rgb(0 240 249 / 0.75)', '0 0 0.6rem 0 rgb(0 240 249 / 0.35)'],
    wrong: '0 0 2rem 0.5rem rgb(232 32 83 / 0.85)',
    hover: '0 0 2.6rem 0.6rem rgb(0 240 249 / 0.9)',
    idle: '0 0 0.8rem 0 rgb(0 240 249 / 0.25)',
  }[state]

  return (
    <motion.div
      data-slot={token ? undefined : id}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: state === 'hover' ? 1.06 : 1,
        x: state === 'wrong' ? [0, -12, 12, -7, 7, 0] : 0,
        boxShadow: token ? '0 0 0 0 rgb(0 0 0 / 0)' : glow,
      }}
      transition={{
        opacity: { delay: 0.2 + index * 0.08 },
        scale: { type: 'spring', stiffness: 300, damping: 20 },
        x: { duration: 0.4 },
        boxShadow: state === 'next' ? { duration: 1.4, repeat: Infinity } : { duration: 0.25 },
      }}
      style={rem(SLOTS[index])}
      className={`absolute rounded-[1.1rem] ${
        token
          ? ''
          : `border-[0.15rem] bg-night/80 ${state === 'wrong' ? 'border-solid border-brand' : state === 'idle' ? 'border-dashed border-cyan/70' : 'border-solid border-cyan'}`
      }`}
    >
      {token ? (
        <>
          <motion.div
            initial={{ scale: 1.25, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className="h-full w-full"
          >
            <CardFace token={token} big />
          </motion.div>
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 15 }}
            style={{ background: token.color }}
            className="absolute -top-[1.3rem] -left-[1.3rem] grid size-[2.8rem] place-items-center rounded-full border-[0.18rem] border-white font-display text-[1.5rem] font-semibold text-white shadow-[0_0.3rem_0.8rem_rgb(0_0_0/0.4)]"
          >
            {id}
          </motion.span>
          {[0, 0.12].map(d => (
            <motion.span
              key={d}
              aria-hidden
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 1.45, opacity: 0 }}
              transition={{ delay: d, duration: 0.7, ease: 'easeOut' }}
              style={{ borderColor: token.color }}
              className="pointer-events-none absolute inset-0 rounded-[1.1rem] border-[0.25rem]"
            />
          ))}
        </>
      ) : (
        <div className="pointer-events-none flex h-full flex-col items-center justify-center gap-[0.5rem] font-display text-white">
          <span
            className={`grid size-[3.75rem] place-items-center rounded-full border-[0.2rem] text-[2rem] leading-none transition-colors ${
              state === 'next' || state === 'hover' ? 'border-cyan bg-cyan text-night' : 'border-cyan bg-night'
            }`}
          >
            {id}
          </span>
          <span className="text-[1.75rem] leading-none">{label}</span>
        </div>
      )}
    </motion.div>
  )
}

function Round({ settings, onFinish, onRetry }) {
  const navigate = useNavigate()
  const tokens = useMemo(() => settings.tokens.map(t => ({ ...t, slot: String(t.slot) })), [settings])
  const slotOrder = useMemo(() => tokens.map(t => t.slot).sort((a, b) => a - b), [tokens])
  const [leaving, setLeaving] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [wrong, setWrong] = useState(null)
  const [nudge, setNudge] = useState(0)

  const game = useMatchGame({
    tokens,
    slotOrder,
    strictOrder: settings.strictOrder,
    timeLimit: settings.timeLimit,
    onFinish: result => {
      if (!result.won) return setTimeUp(true)
      setLeaving(true)
      setTimeout(() => onFinish(result), PORTAL_MS)
    },
  })

  const speed = useMotionValue(360 / settings.arrowSecondsPerTurn)

  useEffect(() => {
    if (!game.complete) return
    animate(speed, 240, { duration: 1.2, ease: 'easeOut' })
    play('chainBreak')
    const id = setTimeout(game.finish, settings.completeSeconds * 1000)
    return () => clearTimeout(id)
  }, [game.complete])

  const next = slotOrder.find(id => !game.placed[id])
  const used = new Set(Object.values(game.placed).map(t => t.id))
  const { media } = settings
  const [first, second] = settings.title
  const danger = game.timeLeft != null && game.timeLeft <= 5 && !game.complete

  const drop = (token, slotId) => {
    const result = game.tryPlace(token, slotId)
    if (result === 'wrong') {
      setWrong(slotId)
      setTimeout(() => setWrong(w => (w === slotId ? null : w)), 600)
    }
    return result
  }

  const submit = () => {
    if (game.complete) return game.finish()
    play('wrong')
    setNudge(n => n + 1)
  }

  const slotState = id => {
    if (wrong === id) return 'wrong'
    if (game.hover === id) return 'hover'
    if (settings.strictOrder && id === next) return 'next'
    return 'idle'
  }

  return (
    <div className="absolute inset-0 bg-night">
      <motion.img
        src={media.background}
        alt=""
        animate={{ scale: leaving ? 1.12 : 1 }}
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
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          className="absolute top-[13.1rem] left-[1.52rem] h-[11.89rem] w-[63.88rem]"
        />
        <motion.img
          src={media.cycleIcon}
          alt=""
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[14.58rem] left-[7.59rem] h-[8.95rem] w-[7.65rem]"
        />
        <h1 className="absolute top-[16.375rem] left-[16.75rem] flex h-[5.2rem] items-center gap-[1.1rem] font-arial text-[3.64rem] leading-none font-bold">
          <span className="text-white">{first}</span>
          <span className="bg-[linear-gradient(180deg,#7ce2f6_0%,#12c8f4_100%)] bg-clip-text text-transparent">{second}</span>
        </h1>

        <motion.div
          initial={{ opacity: 0, x: '-3rem' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          className="absolute top-[24.5rem] left-[6.06rem] flex h-[8.3rem] w-[42.2rem] flex-col justify-center rounded-[1rem] border-[0.12rem] border-cyan/40 bg-night/70 px-[3.2rem] font-display text-white shadow-[0_0_1.5rem_rgb(0_240_249/0.2)]"
        >
          <h2 className="text-[2rem] leading-tight tracking-[0.04em] uppercase">{settings.heading}</h2>
          <p className="mt-[0.4rem] text-[1.35rem] leading-[1.35]">{settings.instruction}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: '3rem' }}
          animate={{
            opacity: 1,
            x: 0,
            borderColor: danger ? 'rgb(232 32 83 / 1)' : 'rgb(0 240 249 / 0.7)',
            boxShadow: danger ? '0 0 2rem rgb(232 32 83 / 0.7)' : '0 0 1.5rem rgb(0 240 249 / 0.35)',
          }}
          transition={{ delay: 0.25, duration: 0.6, ease }}
          className="absolute top-[24.9rem] left-[48.5rem] flex h-[6.8rem] w-[13.8rem] items-center gap-[0.9rem] rounded-[1.4rem] border-[0.15rem] bg-night/75 px-[1.4rem] font-display text-white"
        >
          <motion.img
            src={media.stopwatch}
            alt=""
            animate={danger ? { rotate: [0, -12, 12, -8, 8, 0] } : { rotate: 0 }}
            transition={danger ? { duration: 0.5, repeat: Infinity, repeatDelay: 0.5 } : {}}
            className="w-[3.7rem]"
          />
          <div className="leading-none">
            <motion.div
              key={game.timeLeft}
              initial={{ scale: 1.35, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`origin-left text-[2.6rem] tabular-nums ${danger ? 'text-[#ff6b8f]' : ''}`}
            >
              {game.timeLeft}
            </motion.div>
            <div className="mt-[0.2rem] text-[1.5rem]">seconds</div>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: game.complete ? 1 : 0.55 + game.correct * 0.09 }}
          transition={{ duration: 0.6 }}
          className="absolute top-[32.6rem] left-[9.5rem] w-[50rem]"
        >
          <CycleArrows speed={speed} count={slotOrder.length} className="w-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease }}
          className="absolute top-[43.5rem] left-[20.13rem] w-[29.07rem]"
        >
          <motion.img
            src={media.lungs}
            alt=""
            animate={
              game.complete
                ? { opacity: 1, scale: [1, 1.1, 1.04], filter: 'drop-shadow(0 0 2.5rem rgb(255 80 120 / 0.8))' }
                : { opacity: [0.92, 0.72, 0.92], scale: [1, 1.05, 1], filter: 'drop-shadow(0 0 0 rgb(255 80 120 / 0))' }
            }
            transition={
              game.complete
                ? { duration: 0.9, ease: 'easeOut' }
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut', filter: { duration: 0.9 } }
            }
            className="w-full"
          />
        </motion.div>

        {slotOrder.map((id, i) => (
          <Slot
            key={id}
            index={i}
            id={id}
            token={game.placed[id]}
            state={slotState(id)}
            label={settings.dropLabel}
          />
        ))}

        {game.complete && !leaving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: '2rem' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 14 }}
            className="absolute top-[54rem] left-[19rem] w-[31rem] rounded-full border-[0.2rem] border-cyan bg-night/85 py-[1rem] text-center font-display text-[2.6rem] text-cyan shadow-[0_0_2.5rem_rgb(0_240_249/0.6)]"
          >
            {settings.complete}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: '3rem' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="absolute top-[83.3rem] left-[1.9rem] h-[12.45rem] w-[63.2rem] rounded-[1.6rem] border-[0.12rem] border-cyan/70 bg-night/25 shadow-[0_0_1.5rem_rgb(0_240_249/0.25),inset_0_0_1.5rem_rgb(0_240_249/0.12)]"
        >
          <h2 className="pt-[0.9rem] text-center font-display text-[2.6rem] leading-none tracking-[0.02em] text-white uppercase">
            {settings.trayTitle}
          </h2>
        </motion.div>

        {game.bank.map((token, i) => (
          <div
            key={token.id}
            style={{ left: `${CARD_LEFTS[i]}rem` }}
            className={`absolute top-[89.2rem] h-[5.2rem] w-[11.5rem] ${used.has(token.id) ? 'invisible' : ''}`}
          >
            <DragToken
              token={token}
              index={i + 4}
              disabled={game.over || !!leaving}
              onDrop={drop}
              onHover={game.setHover}
            >
              <div className="h-[5.2rem] w-[11.5rem]">
                <CardFace token={token} />
              </div>
            </DragToken>
          </div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: '3rem' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease }}
          className="absolute top-[104.4rem] left-[1.4rem] h-[7.5rem] w-[64.4rem] rounded-[1.6rem] border-[0.12rem] border-cyan/60 bg-night/70 shadow-[0_0_1.5rem_rgb(0_240_249/0.25)]"
        >
          <img src={media.bulb} alt="" className="absolute top-[0.9rem] left-[2rem] h-[5.3rem]" />
          <motion.p
            key={nudge}
            animate={nudge ? { x: [0, -10, 10, -6, 6, 0], color: ['#ff8fab', '#ffffff'] } : {}}
            transition={{ duration: 0.6 }}
            className="absolute top-1/2 left-[6.9rem] -translate-y-1/2 font-arial text-[1.625rem] leading-[1.85rem] text-white"
          >
            {settings.hint[0]}
            <br />
            {settings.hint[1]}
          </motion.p>
        </motion.div>

        <ChallengeButton
          label={settings.submit}
          idle={!game.complete}
          disabled={!!leaving}
          delay={0.6}
          textClassName="text-[2.4rem]"
          onClick={submit}
          className="absolute top-[105.5rem] left-[45rem] h-[4.95rem] w-[19.2rem]"
        />

        {config.devMode && (
          <button
            onClick={game.solve}
            className="absolute top-[4rem] left-[3rem] flex h-[4.5rem] items-center gap-3 rounded-full bg-accent px-[1.6rem] text-[1.6rem] font-bold text-white active:scale-95"
          >
            <FaForwardFast /> Finish
          </button>
        )}
      </Stage>

      {timeUp && (
        <TimeUpModal
          copy={settings.timeUp}
          stopwatch={media.stopwatch}
          tokens={tokens}
          placed={game.placed}
          onRetry={onRetry}
          onHome={() => navigate('/', { replace: true })}
        />
      )}
      {leaving && <Portal tone="night" />}
    </div>
  )
}

export default function LungsGame({ settings, onFinish }) {
  const [round, setRound] = useState(0)
  return <Round key={round} settings={settings} onFinish={onFinish} onRetry={() => setRound(r => r + 1)} />
}
