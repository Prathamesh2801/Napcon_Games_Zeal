import { createHashRouter, Navigate } from 'react-router'
import KioskLayout from '../layouts/KioskLayout'
import config from '../config/config'
import RegisterPage from '../pages/RegisterPage'
import IntroPage from '../pages/IntroPage'
import PlayPage from '../pages/PlayPage'
import FinalePage from '../pages/FinalePage'
import BreakPage from '../pages/BreakPage'

const gameId = Object.keys(config.games)[0]
const start = config.registration.enabled
  ? `/register/${gameId}`
  : config.intro?.enabled
    ? `/intro/${gameId}`
    : `/play/${gameId}`

export const router = createHashRouter([
  {
    path: '/',
    element: <KioskLayout />,
    children: [
      { index: true, element: <Navigate to={start} replace /> },
      { path: 'register/:gameId', element: <RegisterPage /> },
      { path: 'intro/:gameId', element: <IntroPage /> },
      { path: 'play/:gameId', element: <PlayPage /> },
      { path: 'break/:gameId', element: <BreakPage /> },
      { path: 'finale/:gameId', element: <FinalePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
