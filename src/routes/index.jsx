import { createHashRouter, Navigate } from 'react-router'
import KioskLayout from '../layouts/KioskLayout'
import config from '../config/config'
import RegisterPage from '../pages/RegisterPage'
import PlayPage from '../pages/PlayPage'
import ResultPage from '../pages/ResultPage'
import FinalePage from '../pages/FinalePage'

const gameId = Object.keys(config.games)[0]
const start = config.registration.enabled ? `/register/${gameId}` : `/play/${gameId}`

export const router = createHashRouter([
  {
    path: '/',
    element: <KioskLayout />,
    children: [
      { index: true, element: <Navigate to={start} replace /> },
      { path: 'register/:gameId', element: <RegisterPage /> },
      { path: 'play/:gameId', element: <PlayPage /> },
      { path: 'result', element: <ResultPage /> },
      { path: 'finale/:gameId', element: <FinalePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
