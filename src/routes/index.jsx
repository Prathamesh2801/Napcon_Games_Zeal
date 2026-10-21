import { createHashRouter, Navigate } from 'react-router'
import KioskLayout from '../layouts/KioskLayout'
import HomePage from '../pages/HomePage'
import RegisterPage from '../pages/RegisterPage'
import PlayPage from '../pages/PlayPage'
import ResultPage from '../pages/ResultPage'
import FinalePage from '../pages/FinalePage'

export const router = createHashRouter([
  {
    path: '/',
    element: <KioskLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'register/:gameId', element: <RegisterPage /> },
      { path: 'play/:gameId', element: <PlayPage /> },
      { path: 'result', element: <ResultPage /> },
      { path: 'finale/:gameId', element: <FinalePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
