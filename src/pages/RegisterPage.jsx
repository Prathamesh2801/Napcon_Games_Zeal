import { FaArrowLeft } from 'react-icons/fa6'
import { Navigate, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import config from '../config/config'
import RegistrationForm from '../features/registration/RegistrationForm'
import useIdleRedirect from '../hooks/useIdleRedirect'

export default function RegisterPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  useIdleRedirect(config.registration.idleTimeoutSeconds)

  const game = config.games[gameId]
  if (!game) return <Navigate to="/" replace />

  return (
    <Screen>
      <header className="flex items-center gap-6 px-10 pt-10">
        <button
          onClick={() => navigate('/')}
          aria-label="Back"
          className="grid size-20 place-items-center rounded-full bg-surface text-3xl shadow-card active:scale-95"
        >
          <FaArrowLeft />
        </button>
        <span className="rounded-full bg-brand-soft px-7 py-3 text-2xl font-semibold text-brand-ink">{game.title}</span>
      </header>

      <RegistrationForm
        gameId={gameId}
        onDone={player => navigate(`/play/${gameId}`, { replace: true, state: { player } })}
      />
    </Screen>
  )
}
