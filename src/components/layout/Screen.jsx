import { motion } from 'framer-motion'

export default function Screen({ animateIn = true, className = '', children }) {
  return (
    <motion.main
      initial={animateIn ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`absolute inset-0 flex flex-col ${className}`}
    >
      {children}
    </motion.main>
  )
}
