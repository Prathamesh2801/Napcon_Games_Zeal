import { motion } from 'framer-motion'

export default function Screen({ className = '', children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`absolute inset-0 flex flex-col ${className}`}
    >
      {children}
    </motion.main>
  )
}
