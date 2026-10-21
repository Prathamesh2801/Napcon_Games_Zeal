import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { FaCircleCheck, FaCirclePlay } from 'react-icons/fa6'
import config from '../../../config/config'
import GameHud from '../components/GameHud'
import TokenBank from '../components/TokenBank'
import useMatchGame from '../hooks/useMatchGame'
import { splitHalf } from '../utils'

const cellId = (row, col) => `${row}-${col}`
const pop = { type: 'spring', stiffness: 420, damping: 16 }

function Value({ token, tones, className = '' }) {
  return (
    <span
      className={`leading-tight ${className}`}
      style={{ color: token.assessment ? tones[token.label] : undefined }}
    >
      {token.label}
    </span>
  )
}

export default function TableGame({ settings, onFinish }) {
  const { rows, columns, cells, tones } = settings
  const tokens = useMemo(() => {
    const flat = cells.flatMap((row, r) => row.map((label, c) => ({ id: cellId(r, c), label, assessment: rows[r].assessment })))
    return flat.map(t => ({ ...t, slot: flat.filter(o => o.label === t.label).map(o => o.id) }))
  }, [cells, rows])
  const slotOrder = useMemo(() => tokens.map(t => t.id), [tokens])
  const game = useMatchGame({ tokens, slotOrder, timeLimit: settings.timeLimit, onFinish })
  const [top, bottom] = splitHalf(game.bank)

  useEffect(() => {
    if (!game.complete) return
    const id = setTimeout(game.finish, config.timing.completionDelayMs)
    return () => clearTimeout(id)
  }, [game.complete]) // eslint-disable-line react-hooks/exhaustive-deps

  const card = t => (
    <div className="grid min-h-28 w-56 place-items-center rounded-2xl border-2 border-line bg-surface px-4 py-4 text-center shadow-card">
      <Value token={t} tones={tones} className={`text-[2rem] ${t.assessment ? 'font-bold' : 'font-semibold'}`} />
    </div>
  )

  const template = `minmax(0, 1.1fr) ${columns.map(c => `minmax(0, ${c.highlight ? 1.2 : 1}fr)`).join(' ')}`
  const at = (row, col) => ({ gridRow: row + 1, gridColumn: col + 1 })
  const divider = r => (r < rows.length - 1 ? 'border-b-2 border-line/70' : '')

  return (
    <>
      <GameHud title={settings.title} timeLeft={game.timeLeft} correct={game.correct} total={game.total} onSolve={game.solve} />

      <TokenBank tokens={top} game={game} columns={4} tilt={4} className="flex-1">
        {card}
      </TokenBank>

      <section className="shrink-0 px-4">
        <div className="grid gap-x-2.5" style={{ gridTemplateColumns: template }}>
          {/* Column cards behind the cells */}
          {[{}, ...columns].map((col, c) => (
            <div
              key={c}
              aria-hidden
              style={{ gridColumn: c + 1, gridRow: `1 / span ${rows.length + 1}` }}
              className={`rounded-[1.75rem] shadow-card ${col.highlight ? 'bg-[#f4f1e2]' : 'border-2 border-line bg-surface'}`}
            />
          ))}

          <div style={at(0, 0)} className="grid min-h-40 place-items-center border-b-2 border-line px-2 text-center text-[1.6rem] leading-tight font-extrabold">
            {settings.corner}
          </div>
          {columns.map((col, c) => (
            <div
              key={col.label}
              style={at(0, c + 1)}
              className="grid min-h-40 place-items-center border-b-2 border-line px-3 text-center leading-tight font-extrabold"
            >
              {col.image ? (
                <img src={col.image} alt={col.label} className="max-h-24 w-full object-contain" />
              ) : (
                <span className={col.highlight ? 'text-[3.2rem] font-black text-[#b3202a]' : 'text-[1.85rem]'}>{col.label}</span>
              )}
            </div>
          ))}

          {rows.map((row, r) => (
            <div
              key={row.label}
              style={{ ...at(r + 1, 0), color: row.color }}
              className={`flex min-h-38 items-center justify-between gap-2 py-3 pr-2 pl-4 text-[1.65rem] leading-tight font-bold ${divider(r)}`}
            >
              {row.label}
              <FaCirclePlay className={`shrink-0 text-[2.2rem] ${row.assessment ? '' : 'text-[#cfcbb0]'}`} />
            </div>
          ))}

          {rows.map((row, r) =>
            columns.map((col, c) => {
              const id = cellId(r, c)
              const token = game.placed[id]
              const badge = token && col.highlight && row.assessment
              const state = token
                ? ''
                : game.hover === id
                  ? 'scale-105 border-4 border-brand bg-brand-soft/70'
                  : 'border-4 border-dashed border-line'

              return (
                <div key={id} style={at(r + 1, c + 1)} className={`relative grid min-h-38 p-2 ${divider(r)}`}>
                  {badge && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-t-lg rounded-b-[1.75rem] bg-linear-to-br from-[#1b3d96] to-[#2aa4e2]"
                    />
                  )}
                  <motion.div
                    data-slot={token ? undefined : id}
                    animate={game.complete ? { scale: [1, 1.12, 1] } : undefined}
                    transition={{ delay: (r * columns.length + c) * 0.04 }}
                    className={`relative grid place-items-center rounded-2xl px-1 text-center transition-[scale,background-color,border-color] ${state}`}
                  >
                    {token && (
                      <>
                        <motion.span
                          aria-hidden
                          initial={{ opacity: 0.9, scale: 0.7 }}
                          animate={{ opacity: 0, scale: 1.3 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 rounded-2xl border-4 border-success"
                        />
                        <motion.span
                          initial={{ scale: 0.3, opacity: 0, y: -12 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          transition={pop}
                          className="flex items-center gap-3"
                        >
                          {badge ? (
                            <>
                              <span className="text-[2.6rem] font-bold text-white">{token.label}</span>
                              <FaCircleCheck className="text-[2.4rem] text-white" />
                            </>
                          ) : (
                            <Value
                              token={token}
                              tones={tones}
                              className={col.highlight ? 'text-[2.4rem] font-extrabold' : `text-[1.75rem] ${token.assessment ? 'font-bold' : 'font-medium'}`}
                            />
                          )}
                        </motion.span>
                      </>
                    )}
                  </motion.div>
                </div>
              )
            }),
          )}
        </div>
      </section>

      <TokenBank tokens={bottom} game={game} columns={4} tilt={4} className="flex-1">
        {card}
      </TokenBank>
    </>
  )
}
