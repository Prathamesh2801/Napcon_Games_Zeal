import { Navigate, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import config from '../config/config'
import { games } from '../features/games'

export default function PlayPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()

  const settings = config.games[gameId]
  if (!settings || !games[gameId]) return <Navigate to="/" replace />

  const { Component } = games[gameId]
  const finish = () => navigate(`/${settings.break ? 'break' : 'finale'}/${gameId}`, { replace: true })

  return (
    <Screen animateIn={false} className="bg-night">
      <Component settings={settings} onFinish={finish} />
    </Screen>
  )
}
