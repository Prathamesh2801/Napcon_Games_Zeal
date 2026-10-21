import { useEffect, useRef, useState } from 'react'
import config from '../../../config/config'
import { play } from '../../../services/sound'
import { calcScore, canPlace, shuffle, solveBoard } from '../utils'

// Shared engine for both games: tokens are dragged onto slots (token.slot === slot id).
export default function useMatchGame({ tokens, slotOrder, strictOrder = false, timeLimit, onFinish }) {
  const [bank] = useState(() => shuffle(tokens))
  const [placed, setPlaced] = useState({})
  const [mistakes, setMistakes] = useState(0)
  const [hover, setHover] = useState(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? null)
  const finished = useRef(false)

  const total = slotOrder.length
  const correct = Object.keys(placed).length
  const complete = correct === total
  const over = complete || timeLeft === 0

  const finish = () => {
    if (finished.current) return
    finished.current = true
    const stats = { correct, total, mistakes, timeLeft }
    onFinish({ ...stats, won: complete, score: calcScore(stats, config.scoring) })
  }

  // Date-based so it doesn't drift; stops once the board is complete.
  useEffect(() => {
    if (!timeLimit || complete) return
    const end = Date.now() + timeLimit * 1000
    const id = setInterval(() => setTimeLeft(Math.max(0, Math.ceil((end - Date.now()) / 1000))), 200)
    return () => clearInterval(id)
  }, [timeLimit, complete])

  useEffect(() => {
    if (timeLeft === 0 && !complete) finish()
  })

  // Returns 'placed' | 'wrong' | 'none' (dropped outside any open slot).
  const tryPlace = (token, slotId) => {
    if (!slotId || over) return 'none'
    if (!canPlace(token, slotId, { placed, slotOrder, strictOrder })) {
      setMistakes(m => m + 1)
      play('wrong')
      return 'wrong'
    }
    play('correct')
    setPlaced(p => ({ ...p, [slotId]: token }))
    return 'placed'
  }

  // Dev mode only: fill the board correctly so the completion animation + finale can be checked quickly.
  const solve = () => !over && setPlaced(solveBoard(tokens, slotOrder))

  return { bank, placed, mistakes, hover, setHover, timeLeft, correct, total, complete, over, tryPlace, finish, solve }
}
