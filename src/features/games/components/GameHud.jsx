import { FaCheck, FaClock, FaHouse } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { formatTime } from '../utils'

function Stat({ icon, danger, children }) {
  return (
    <div
      className={`flex h-20 items-center gap-3 rounded-full px-7 text-3xl font-bold tabular-nums shadow-card ${danger ? 'animate-pulse bg-danger text-white' : 'bg-surface text-ink'}`}
    >
      <span className={danger ? '' : 'text-brand'}>{icon}</span>
      {children}
    </div>
  )
}

export default function GameHud({ title, timeLeft, correct, total }) {
  const navigate = useNavigate()

  return (
    <header className="flex shrink-0 items-center gap-6 px-10 pt-10">
      <button
        onClick={() => navigate('/')}
        aria-label="Exit game"
        className="grid size-20 place-items-center rounded-full bg-surface text-3xl shadow-card active:scale-95"
      >
        <FaHouse />
      </button>
      <h1 className="flex-1 truncate text-4xl font-bold">{title}</h1>
      <Stat icon={<FaCheck />}>
        {correct}/{total}
      </Stat>
      {timeLeft != null && (
        <Stat icon={<FaClock />} danger={timeLeft <= 10}>
          {formatTime(timeLeft)}
        </Stat>
      )}
    </header>
  )
}
