import { useState } from 'react'
import DragToken from './DragToken'

const rand = (min, max) => min + Math.random() * (max - min)

// A band of draggable tokens laid out in `columns` evenly spaced columns (default: one row),
// with a little random offset/tilt so it doesn't look rigid.
export default function TokenBank({ tokens, game, columns = tokens.length, tilt = 6, className = '', children }) {
  const [jitter] = useState(() =>
    tokens.map(() => ({ x: rand(-0.8, 0.8), y: rand(-1, 1), rotate: rand(-tilt, tilt) })),
  )
  const used = new Set(Object.values(game.placed).map(t => t.id))

  return (
    <div
      className={`grid content-evenly items-center justify-items-center gap-x-4 px-8 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {tokens.map((token, i) => (
        <div
          key={token.id}
          style={{ translate: `${jitter[i].x}rem ${jitter[i].y}rem` }}
          className={used.has(token.id) ? 'invisible' : ''}
        >
          <DragToken
            token={token}
            index={i}
            rotate={jitter[i].rotate}
            disabled={game.over}
            onDrop={game.tryPlace}
            onHover={game.setHover}
          >
            {children(token)}
          </DragToken>
        </div>
      ))}
    </div>
  )
}
