import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import GameHud from '../components/GameHud'
import TokenBank from '../components/TokenBank'
import { play } from '../../../services/sound'
import useMatchGame from '../hooks/useMatchGame'
import { splitHalf } from '../utils'

const SLOT_RADIUS = 39
const SLOT_SIZE = 27

const slotAngle = (i, n) => (i / n) * 2 * Math.PI - Math.PI / 2

function wedge(i, n) {
  const step = (2 * Math.PI) / n
  const a = slotAngle(i, n) - step / 2
  const pt = t => `${50 + 75 * Math.cos(t)}% ${50 + 75 * Math.sin(t)}%`
  return `polygon(50% 50%, ${pt(a)}, ${pt(a + step / 2)}, ${pt(a + step)})`
}

function TokenFace({ token, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-full p-3 text-center leading-tight font-semibold hyphens-manual ${className}`}
    >
      {token.image && <img src={token.image} alt="" className="size-14 object-contain" />}
      <span>{token.label}</span>
    </div>
  )
}

export default function LungsGame({ settings, onFinish }) {
  const tokens = useMemo(
    () => settings.tokens.map(t => ({ ...t, slot: t.slot == null ? null : String(t.slot) })),
    [settings],
  )
  const slotOrder = useMemo(() => tokens.filter(t => t.slot).map(t => t.slot).sort((a, b) => a - b), [tokens])
  const game = useMatchGame({ tokens, slotOrder, strictOrder: settings.strictOrder, timeLimit: settings.timeLimit, onFinish })
  const [burst, setBurst] = useState(false)

  const [top, bottom] = splitHalf(game.bank)
  const next = slotOrder.find(id => !game.placed[id])
  const { x, y, size } = settings.ring
  const bankFace = 'size-56 border-4 border-brand/25 bg-surface text-[1.65rem] text-ink shadow-card'

  return (
    <>
      <GameHud title={settings.title} timeLeft={game.timeLeft} correct={game.correct} total={game.total} onSolve={game.solve} />

      <TokenBank tokens={top} game={game} className="flex-1">
        {t => <TokenFace token={t} className={bankFace} />}
      </TokenBank>

      <section className="relative w-full shrink-0">
        <img src={settings.art} alt="" className="block w-full" />

        <motion.div
          className="absolute aspect-square"
          style={{ left: `${x - size / 2}%`, top: `${y}%`, width: `${size}%`, y: '-50%' }}
          animate={game.complete ? { rotate: 360 } : undefined}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (!game.complete || burst) return
            setBurst(true)
            play('chainBreak')
          }}
        >
          {settings.chain && !burst && <img src={settings.chain} alt="" className="absolute inset-0 size-full" />}
          {settings.chain &&
            burst &&
            slotOrder.map((_, i) => {
              const angle = slotAngle(i, slotOrder.length)
              const spin = i % 2 ? 1 : -1
              return (
                <motion.img
                  key={i}
                  src={settings.chain}
                  alt=""
                  className="absolute inset-0 size-full"
                  style={{ clipPath: wedge(i, slotOrder.length) }}
                  animate={{
                    x: ['0%', `${Math.cos(angle) * 5}%`, `${Math.cos(angle) * 110}%`],
                    y: ['0%', `${Math.sin(angle) * 5}%`, `${Math.sin(angle) * 110}%`],
                    rotate: [0, spin * 6, spin * 45],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 1, times: [0, 0.2, 1], ease: 'easeIn' }}
                />
              )
            })}

          {slotOrder.map((id, i) => {
            const angle = slotAngle(i, slotOrder.length)
            const token = game.placed[id]
            const state = token
              ? ''
              : game.hover === id
                ? 'scale-105 border-brand bg-brand-soft text-brand'
                : settings.strictOrder && id === next
                  ? 'border-brand bg-surface text-brand ring-8 ring-brand/15'
                  : 'border-dashed border-white bg-brand/20 text-white text-shadow-lg'

            return (
              <motion.div
                key={id}
                data-slot={token ? undefined : id}
                className={`absolute grid aspect-square place-items-center rounded-full transition-[scale,background-color,border-color] ${token ? '' : 'border-4'} ${state}`}
                style={{
                  width: `${SLOT_SIZE}%`,
                  left: `${50 + SLOT_RADIUS * Math.cos(angle) - SLOT_SIZE / 2}%`,
                  top: `${50 + SLOT_RADIUS * Math.sin(angle) - SLOT_SIZE / 2}%`,
                }}
                animate={
                  burst
                    ? { x: `${Math.cos(angle) * 300}%`, y: `${Math.sin(angle) * 300}%`, scale: 0.4, opacity: 0 }
                    : undefined
                }
                transition={{ duration: 0.8, ease: 'easeIn' }}
              >
                {token ? (
                  <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="size-full">
                    <TokenFace token={token} className="size-full bg-brand text-[1.5rem] text-white shadow-card" />
                  </motion.div>
                ) : (
                  <span className="text-5xl font-bold">{id}</span>
                )}
              </motion.div>
            )
          })}

          <motion.div
            className="absolute top-1/2 left-1/2 grid size-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-ink text-3xl font-bold text-white tabular-nums shadow-card"
            animate={burst ? { scale: 1.6, opacity: 0 } : undefined}
            transition={{ duration: 1 }}
            onAnimationComplete={() => burst && game.finish()}
          >
            {game.correct}/{game.total}
          </motion.div>
        </motion.div>
      </section>

      <TokenBank tokens={bottom} game={game} className="flex-1">
        {t => <TokenFace token={t} className={bankFace} />}
      </TokenBank>
    </>
  )
}
