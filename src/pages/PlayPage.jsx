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
  const finish = result =>
    settings.break
      ? navigate(`/break/${gameId}`, { replace: true })
      : settings.finale
      ? navigate(`/finale/${gameId}`, { replace: true })
      : navigate('/result', { replace: true, state: { ...result, gameId, player: state?.player } })

  return (
    <Screen animateIn={false} className="bg-night">
      <Component settings={settings} onFinish={finish} />
    </Screen>
  )
}
