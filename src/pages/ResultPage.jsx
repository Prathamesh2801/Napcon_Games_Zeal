import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { FaHourglassEnd, FaHouse, FaRotateRight, FaTrophy } from 'react-icons/fa6'
import { Navigate, useLocation, useNavigate } from 'react-router'
import Screen from '../components/layout/Screen'
import Button from '../components/ui/Button'
import config from '../config/config'
import { formatTime } from '../features/games/utils'
import useIdleRedirect from '../hooks/useIdleRedirect'

function CountUp({ value }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)
  useEffect(() => animate(count, value, { duration: 1.2, ease: 'easeOut' }).stop, [count, value])
  return <motion.span>{rounded}</motion.span>
}

export default function ResultPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const left = useIdleRedirect(config.timing.resultRedirectSeconds)

  if (!state) return <Navigate to="/" replace />
  const { won, score, correct, total, mistakes, timeLeft, player, gameId } = state

  const stats = [
    ['Correct', `${correct}/${total}`],
    ['Mistakes', mistakes],
    ['Time left', timeLeft == null ? '—' : formatTime(timeLeft)],
  ]

  return (
    <Screen className="items-center justify-center px-14 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.15 }}
        className={`grid size-48 place-items-center rounded-full text-8xl text-white shadow-card ${won ? 'bg-brand' : 'bg-accent'}`}
      >
        {won ? <FaTrophy /> : <FaHourglassEnd />}
      </motion.div>

      <h1 className="mt-12 text-7xl font-bold">{won ? 'Well done!' : "Time's up!"}</h1>
      {player?.name && (
        <p className="mt-4 text-4xl text-muted">
          {won ? 'Great job' : 'Nice try'}, {player.name}
        </p>
      )}

      <div className="mt-16 w-full rounded-[3rem] bg-surface px-12 py-12 shadow-card">
        <p className="text-3xl font-semibold tracking-[0.25em] text-muted uppercase">Score</p>
        <p className="mt-2 text-[9rem] leading-none font-bold text-brand tabular-nums">
          <CountUp value={score} />
        </p>
        <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-10">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt className="text-2xl text-muted">{label}</dt>
              <dd className="mt-2 text-5xl font-bold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-14 flex gap-6">
        <Button variant="ghost" onClick={() => navigate('/', { replace: true })}>
          <FaHouse /> Home
        </Button>
        <Button onClick={() => navigate(`/play/${gameId}`, { replace: true, state: { player } })}>
          <FaRotateRight /> Play again
        </Button>
      </div>

      {left > 0 && <p className="mt-10 text-2xl text-muted">Returning to home in {left}s</p>}
    </Screen>
  )
}
