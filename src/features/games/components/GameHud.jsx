import { FaCheck, FaClock, FaForwardFast, FaHouse } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import BrandBar from '../../../components/ui/BrandBar'
import config from '../../../config/config'
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

export default function GameHud({ timeLeft, correct, total, onSolve }) {
  const navigate = useNavigate()

  return (
    <header className="shrink-0 px-10 pt-8">
      <BrandBar className="h-20" />
      <div className="mt-6 flex items-center gap-6">
        <button
          onClick={() => navigate('/')}
          aria-label="Exit game"
          className="grid size-20 place-items-center rounded-full bg-surface text-3xl shadow-card active:scale-95"
        >
          <FaHouse />
        </button>
        <div className="flex-1" />
        {config.devMode && (
          <button
            onClick={onSolve}
            className="flex h-20 items-center gap-3 rounded-full bg-accent px-7 text-2xl font-bold text-white shadow-card active:scale-95"
          >
            <FaForwardFast /> Finish
          </button>
        )}
        <Stat icon={<FaCheck />}>
          {correct}/{total}
        </Stat>
        {timeLeft != null && (
          <Stat icon={<FaClock />} danger={timeLeft <= 10}>
            {formatTime(timeLeft)}
          </Stat>
        )}
      </div>
    </header>
  )
}
