import { motion } from 'framer-motion'
import CycleArrows from './CycleArrows'

const morph = { duration: 0.9, ease: [0.22, 1, 0.36, 1] }

export default function CycleHero({ art, layout, from, speed, pulse }) {
  return (
    <div className="relative h-full w-full">
      <img src={art.disc} alt="" className="absolute inset-0 h-full w-full" />
      <CycleArrows
        speed={speed}
        className="absolute top-[54.42%] left-[50.16%] w-[87.4%] -translate-x-1/2 -translate-y-1/2"
      />
      <motion.img
        src={art.lungs}
        alt=""
        initial={from ? from.lungs : layout.lungs}
        animate={{ ...layout.lungs, scale: pulse ? [1, 1.06, 1.02] : [1, 1.015, 1] }}
        transition={{
          default: morph,
          scale: pulse ? { duration: 0.8, ease: 'easeOut' } : { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute"
      />
      {art.icons.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          initial={from ? { ...from.icons[i], opacity: 1, scale: 1 } : { ...layout.icons[i], opacity: 0, scale: 0.4 }}
          animate={{ ...layout.icons[i], opacity: 1, scale: pulse ? [1, 1.3, 1.1] : 1 }}
          transition={{
            default: morph,
            opacity: { delay: 0.25 + i * 0.12 },
            scale: { delay: pulse ? i * 0.06 : from ? 0 : 0.25 + i * 0.12, type: 'spring', stiffness: 260, damping: 16 },
          }}
          className="absolute"
        />
      ))}
    </div>
  )
}
