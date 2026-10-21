import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import GameHud from '../components/GameHud'
import TokenBank from '../components/TokenBank'
import useMatchGame from '../hooks/useMatchGame'
import { splitHalf } from '../utils'

const SLOT_RADIUS = 36 // % of ring box, slot centers
const SLOT_SIZE = 28 // % of ring box

function TokenFace({ token, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-full p-4 text-center text-xl leading-tight font-semibold hyphens-manual ${className}`}
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
  const bankFace = 'size-44 border-4 border-brand/25 bg-surface text-ink shadow-card'

  return (
    <>
      <GameHud title={settings.title} timeLeft={game.timeLeft} correct={game.correct} total={game.total} />

      <TokenBank tokens={top} game={game} className="flex-1">
        {t => <TokenFace token={t} className={bankFace} />}
      </TokenBank>

      <section className="relative w-full shrink-0">
        <img src={settings.art} alt="" className="block w-full" />

        {/* Ring spins once complete, then the slots fly outward and the result screen follows */}
        <motion.div
          className="absolute aspect-square"
          style={{ left: `${x - size / 2}%`, top: `${y}%`, width: `${size}%`, y: '-50%' }}
          animate={game.complete ? { rotate: 360 } : undefined}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          onAnimationComplete={() => game.complete && setBurst(true)}
        >
          {slotOrder.map((id, i) => {
            const angle = (i / slotOrder.length) * 2 * Math.PI - Math.PI / 2
            const token = game.placed[id]
            const state = token
              ? ''
              : game.hover === id
                ? 'scale-105 border-brand bg-brand-soft text-brand'
                : settings.strictOrder && id === next
                  ? 'border-brand bg-surface text-brand ring-8 ring-brand/15'
                  : 'border-dashed border-brand/40 bg-surface/85 text-brand/50'

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
                    <TokenFace token={token} className="size-full bg-brand text-white shadow-card" />
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
            transition={{ duration: 0.8 }}
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
