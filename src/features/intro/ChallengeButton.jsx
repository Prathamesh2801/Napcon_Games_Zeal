import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa6'

const SPARKLES = [
  { left: '4%', top: '-14%', size: 3.2, delay: 0 },
  { left: '88%', top: '-20%', size: 2.6, delay: 0.7 },
  { left: '96%', top: '62%', size: 2.2, delay: 1.3 },
  { left: '-2%', top: '70%', size: 2.4, delay: 1.9 },
  { left: '46%', top: '-22%', size: 1.8, delay: 2.4 },
  { left: '62%', top: '96%', size: 2, delay: 1 },
]

function Sparkle({ left, top, size, delay }) {
  return (
    <motion.svg
      viewBox="-10 -10 20 20"
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
      transition={{ duration: 1.1, delay, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
      style={{ left, top, width: `${size}rem`, height: `${size}rem` }}
      className="pointer-events-none absolute z-10 drop-shadow-[0_0_0.5rem_rgb(255_255_255/0.95)]"
    >
      <path d="M0 -10 C1 -2 2 -1 10 0 C2 1 1 2 0 10 C-1 2 -2 1 -10 0 C-2 -1 -1 -2 0 -10 Z" fill="#ffffff" />
    </motion.svg>
  )
}

export default function ChallengeButton({
  label,
  disabled,
  idle = false,
  delay = 1.25,
  textClassName = 'text-[2.7rem]',
  icon: Icon = FaArrowRight,
  lead: Lead,
  onClick,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: '5rem', scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
      className={className}
    >
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        animate={{
          opacity: idle ? 0.55 : 1,
          filter: idle ? 'saturate(0.45)' : 'saturate(1)',
          boxShadow: [
            '0 0 0 0.35rem #ff2d7a, 0 0 1.8rem 0.4rem rgb(255 45 122 / 0.45)',
            '0 0 0 0.35rem #ff4f93, 0 0 3.6rem 1rem rgb(255 45 122 / 0.75)',
            '0 0 0 0.35rem #ff2d7a, 0 0 1.8rem 0.4rem rgb(255 45 122 / 0.45)',
          ],
        }}
        transition={{ boxShadow: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }, default: { duration: 0.4 } }}
        className={`relative flex h-full w-full items-center justify-center gap-5 overflow-hidden rounded-full border-[0.3rem] border-white/90 bg-[linear-gradient(180deg,#ff6a9e_0%,#f31a63_45%,#d0004c_100%)] px-[2.5rem] font-arial font-black ${textClassName} tracking-[0.01em] whitespace-nowrap text-white uppercase [text-shadow:0_0.2rem_0.3rem_rgb(120_0_40/0.6)]`}
      >
        <span aria-hidden className="absolute inset-x-[6%] top-[8%] h-[38%] rounded-full bg-white/25" />
        <motion.span
          aria-hidden
          initial={{ x: '-150%' }}
          animate={{ x: '450%' }}
          transition={{ delay: 1.8, duration: 1.2, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
          className="absolute inset-y-0 left-0 w-1/5 -skew-x-20 bg-white/45 blur-md"
        />
        {Lead && (
          <>
            <Lead className="relative shrink-0 text-[1.3em]" />
            <span aria-hidden className="relative h-[1.3em] w-[0.18rem] shrink-0 rounded-full bg-white/80" />
          </>
        )}
        <span className="relative">{label}</span>
        <Icon className="relative shrink-0 text-[0.95em]" />
      </motion.button>
      {!idle && SPARKLES.map(s => <Sparkle key={s.left + s.top} {...s} delay={delay + 0.35 + s.delay} />)}
    </motion.div>
  )
}
