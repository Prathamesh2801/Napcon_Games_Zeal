import { animate, motion, useMotionValue } from 'framer-motion'

const spring = { type: 'spring', stiffness: 500, damping: 32 }

const slotAt = ({ x, y }) =>
  document.elementsFromPoint(x, y).find(el => el.dataset.slot)?.dataset.slot ?? null

export default function DragToken({ token, index = 0, rotate = 0, disabled, onDrop, onHover, children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const zIndex = useMotionValue(0)

  const handleDragEnd = (_, info) => {
    onHover(null)
    const result = onDrop(token, slotAt(info.point))
    if (result === 'placed') return
    animate(y, 0, spring)
    animate(x, 0, spring).then(() => {
      zIndex.set(0)
      if (result === 'wrong') animate(x, [0, -14, 14, -8, 8, 0], { duration: 0.4 })
    })
  }

  return (
    <motion.div
      drag={!disabled}
      dragMomentum={false}
      style={{ x, y, rotate, zIndex }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 + index * 0.06 } }}
      whileDrag={{ scale: 1.1, rotate: 0 }}
      onDragStart={() => zIndex.set(50)}
      onDrag={(_, info) => onHover(slotAt(info.point))}
      onDragEnd={handleDragEnd}
      className="relative cursor-grab touch-none active:cursor-grabbing"
    >
      {children}
    </motion.div>
  )
}
