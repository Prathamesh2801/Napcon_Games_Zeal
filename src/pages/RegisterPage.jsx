import { Navigate, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import BrandBar from '../components/ui/BrandBar'
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
      <header className="px-10 pt-10">
        <BrandBar className="h-28" />
      </header>

      <RegistrationForm
        gameId={gameId}
        onDone={player => navigate(`/play/${gameId}`, { replace: true, state: { player } })}
      />
    </Screen>
  )
}
