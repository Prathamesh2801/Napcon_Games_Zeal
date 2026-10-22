import { motion, motionValue, useAnimationFrame } from 'framer-motion'

const rotate = motionValue(0)

const R = 100
const GAP = 13
const HEAD = 15

const point = (deg, r = R) => {
  const a = (deg * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a)]
}

function Arrow({ index, count }) {
  const start = -90 + (360 / count) * index + GAP
  const end = start + 360 / count - GAP * 2
  const [x0, y0] = point(start)
  const [x1, y1] = point(end)
  const a = (end * Math.PI) / 180
  const t = [-Math.sin(a), Math.cos(a)]
  const n = [Math.cos(a), Math.sin(a)]
  const tip = [x1 + t[0] * HEAD, y1 + t[1] * HEAD]
  const left = [x1 + n[0] * 11, y1 + n[1] * 11]
  const right = [x1 - n[0] * 11, y1 - n[1] * 11]
  const id = `cycle-arrow-${count}-${index}`

  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x0} y1={y0} x2={x1} y2={y1}>
          <stop offset="0" stopColor="#3d8bff" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#8fd9ff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <path d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`} fill="none" stroke={`url(#${id})`} strokeWidth="9" strokeLinecap="round" />
      <path d={`M ${tip.join(' ')} L ${left.join(' ')} L ${right.join(' ')} Z`} fill="#ffffff" strokeLinejoin="round" stroke="#ffffff" strokeWidth="2" />
    </g>
  )
}

export default function CycleArrows({ speed, count = 6, className = '', style }) {
  useAnimationFrame((_, delta) => {
    rotate.set((rotate.get() + (speed.get() * delta) / 1000) % 360)
  })

  return (
    <motion.svg
      viewBox="-125 -125 250 250"
      style={{ ...style, rotate }}
      className={`drop-shadow-[0_0_0.6rem_rgb(120_210_255/0.9)] ${className}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <Arrow key={i} index={i} count={count} />
      ))}
    </motion.svg>
  )
}
