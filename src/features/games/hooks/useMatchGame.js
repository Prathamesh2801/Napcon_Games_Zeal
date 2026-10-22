import { useEffect, useRef, useState } from 'react'
import { play } from '../../../services/sound'
import { canPlace, shuffle } from '../utils'

export default function useMatchGame({ tokens, slotOrder, strictOrder = false, timeLimit, onFinish }) {
  const [bank] = useState(() => shuffle(tokens))
  const [placed, setPlaced] = useState({})
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
    onFinish({ won: complete })
  }

  useEffect(() => {
    if (!timeLimit || complete) return
    const end = Date.now() + timeLimit * 1000
    const id = setInterval(() => setTimeLeft(Math.max(0, Math.ceil((end - Date.now()) / 1000))), 200)
    return () => clearInterval(id)
  }, [timeLimit, complete])

  useEffect(() => {
    if (timeLeft === 0 && !complete) finish()
  })

  const tryPlace = (token, slotId) => {
    if (!slotId || over) return 'none'
    if (!canPlace(token, slotId, { placed, slotOrder, strictOrder })) {
      play('wrong')
      return 'wrong'
    }
    play('correct')
    setPlaced(p => ({ ...p, [slotId]: token }))
    return 'placed'
  }

  return { bank, placed, hover, setHover, timeLeft, correct, total, complete, over, tryPlace, finish }
}
