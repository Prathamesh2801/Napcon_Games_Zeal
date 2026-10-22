import { motion } from 'framer-motion'

const TONES = {
  paper: 'bg-[radial-gradient(circle_at_50%_50%,#ffffff_0%,#c9fbff_25%,var(--color-paper)_60%)]',
  night: 'bg-[radial-gradient(circle_at_50%_50%,#ffffff_0%,#7ff6ff_18%,#0b5fd0_45%,var(--color-night)_75%)]',
}

export default function Portal({ tone = 'paper' }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {[0, 0.15, 0.3].map(delay => (
        <motion.div
          key={delay}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 4.5, opacity: [0, 1, 0] }}
          transition={{ delay: 0.6 + delay, duration: 0.8, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -mt-[20rem] -ml-[20rem] size-[40rem] rounded-full border-[0.6rem] border-cyan shadow-[0_0_3rem_1rem_rgb(0_240_249/0.6),inset_0_0_3rem_1rem_rgb(0_240_249/0.5)]"
        />
      ))}
      <motion.div
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(75% at 50% 50%)' }}
        transition={{ delay: 0.85, duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
        className={`absolute inset-0 ${TONES[tone]}`}
      />
    </div>
  )
}
