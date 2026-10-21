import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import config from '../config/config'
import { games } from '../features/games'

export default function PlayPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const settings = config.games[gameId]
  if (!settings || !games[gameId]) return <Navigate to="/" replace />

  const { Component } = games[gameId]
  // A completed game with a finale shows that image instead of the score screen.
  const finish = result =>
    result.won && settings.finale
      ? navigate(`/finale/${gameId}`, { replace: true })
      : navigate('/result', { replace: true, state: { ...result, gameId, player: state?.player } })

  return (
    <Screen>
      <Component settings={settings} onFinish={finish} />
    </Screen>
  )
}
