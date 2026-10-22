import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaHouse, FaRotateRight } from 'react-icons/fa6'
import ChallengeButton from '../../intro/ChallengeButton'

const fill = (text, values) => text.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '')

export default function TimeUpModal({ copy, stopwatch, tokens, placed, onRetry, onHome }) {
  const [left, setLeft] = useState(copy.homeSeconds)
  const done = new Set(Object.values(placed).map(t => t.id))

  useEffect(() => {
    if (left <= 0) return onHome()
    const id = setTimeout(() => setLeft(s => s - 1), 1000)
    return () => clearTimeout(id)
  }, [left])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-30 grid place-items-center bg-night/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: '4rem' }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 20 }}
        className="relative flex w-[54rem] flex-col items-center rounded-[2.4rem] border-[0.2rem] border-cyan/70 bg-[linear-gradient(180deg,#0b2a86_0%,#061450_100%)] px-[4rem] pt-[8rem] pb-[3.5rem] text-center font-display text-white shadow-[0_0_4rem_rgb(0_240_249/0.35),inset_0_0_2rem_rgb(0_240_249/0.15)]"
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
          className="absolute -top-[6.5rem] grid size-[13rem] place-items-center rounded-full border-[0.3rem] border-cyan bg-night shadow-[0_0_3rem_rgb(0_240_249/0.6)]"
        >
          <motion.img
            src={stopwatch}
            alt=""
            animate={{ rotate: [0, -14, 14, -9, 9, 0] }}
            transition={{ delay: 0.5, duration: 0.6, repeat: Infinity, repeatDelay: 1.6 }}
            className="block w-[7.4rem]"
          />
        </motion.div>

        <h2 className="text-[5rem] leading-none font-semibold [text-shadow:0_0_2rem_rgb(0_240_249/0.7)]">{copy.title}</h2>
        <p className="mt-[1.6rem] text-[2.3rem]">{fill(copy.placed, { placed: done.size, total: tokens.length })}</p>

        <div className="mt-[1.6rem] flex gap-[1rem]">
          {tokens.map((t, i) => (
            <motion.span
              key={t.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35 + i * 0.08, type: 'spring', stiffness: 400, damping: 16 }}
              style={done.has(t.id) ? { background: t.color, boxShadow: `0 0 1rem ${t.color}` } : undefined}
              className={`grid size-[3.4rem] place-items-center rounded-full border-[0.18rem] text-[1.6rem] ${
                done.has(t.id) ? 'border-white text-white' : 'border-cyan/40 text-cyan/50'
              }`}
            >
              {i + 1}
            </motion.span>
          ))}
        </div>

        <p className="mt-[1.6rem] text-[1.9rem] leading-snug text-cyan">{copy.text}</p>

        <div className="mt-[3rem] flex w-full items-center gap-[1.6rem]">
          <ChallengeButton
            label={copy.retry}
            icon={FaRotateRight}
            delay={0.45}
            textClassName="text-[2.6rem]"
            onClick={onRetry}
            className="relative h-[7.2rem] flex-1"
          />
          <motion.button
            type="button"
            initial={{ opacity: 0, y: '2rem' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="flex h-[7.2rem] items-center gap-[1rem] rounded-full border-[0.2rem] border-cyan/70 bg-night/60 px-[2.6rem] text-[2.2rem] tracking-[0.06em] text-white uppercase shadow-[0_0_1.5rem_rgb(0_240_249/0.3)] active:bg-cyan/20"
          >
            <FaHouse className="text-cyan" /> {copy.home}
          </motion.button>
        </div>

        <p className="mt-[2rem] text-[1.5rem] text-white/60 tabular-nums">{fill(copy.homeText, { seconds: left })}</p>
      </motion.div>
    </motion.div>
  )
}
