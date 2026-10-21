import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-brand text-white shadow-card active:bg-brand-ink',
  ghost: 'border-4 border-line bg-surface text-ink',
}

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`inline-flex h-24 items-center justify-center gap-4 rounded-full px-14 text-3xl font-semibold transition-colors disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
