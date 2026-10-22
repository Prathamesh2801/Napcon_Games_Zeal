import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowRight, FaCheck, FaDeleteLeft } from 'react-icons/fa6'

const LAYOUTS = {
  text: ['qwertyuiop', 'asdfghjkl', [...'zxcvbnm', 'backspace'], ['space', 'next']],
  numeric: ['123', '456', '789', ['clear', '0', 'backspace']],
}

const LABELS = {
  space: 'Space',
  clear: 'Clear',
  backspace: <FaDeleteLeft />,
  next: (
    <>
      Next <FaArrowRight className="text-[1.8rem]" />
    </>
  ),
}

function keyWidth(key, layout) {
  if (layout === 'numeric') return 'w-[19.5rem]'
  if (key === 'space') return 'w-[42rem]'
  if (key === 'next') return 'w-[17rem]'
  if (key === 'backspace') return 'w-[11.5rem]'
  return 'w-[5.75rem]'
}

function Key({ k, layout, onKey }) {
  const accent = k === 'next'
  return (
    <motion.button
      type="button"
      tabIndex={-1}
      whileTap={{ scale: 0.92, backgroundColor: 'rgb(0 240 249 / 0.45)' }}
      transition={{ duration: 0.08 }}
      onMouseDown={e => e.preventDefault()}
      onPointerDown={e => {
        e.preventDefault()
        onKey(k)
      }}
      className={`flex h-[5.6rem] items-center justify-center gap-3 rounded-[1.1rem] border-2 text-[2.6rem] font-semibold uppercase shadow-[inset_0_-0.3rem_0_rgb(0_0_0/0.25)] ${
        accent ? 'border-cyan bg-cyan/25 text-cyan' : 'border-cyan/25 bg-white/10 text-frost'
      } ${['space', 'next', 'clear'].includes(k) ? 'text-[2rem]! tracking-[0.08em]' : ''} ${keyWidth(k, layout)}`}
    >
      {LABELS[k] ?? k}
    </motion.button>
  )
}

export default function OnScreenKeyboard({ open, layout = 'text', title, onKey }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          exit={{ y: '105%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          onMouseDown={e => e.preventDefault()}
          onPointerDown={e => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute bottom-0 left-[calc(50%-33.75rem)] z-20 flex h-[33rem] w-[67.5rem] flex-col rounded-t-[2.25rem] border-t-2 border-cyan/50 bg-night/85 px-[1.75rem] pb-[2rem] font-display shadow-[0_-1rem_3rem_rgb(0_240_249/0.2)] backdrop-blur-xl"
        >
          <div className="flex h-[5rem] shrink-0 items-center justify-between px-2">
            <span className="text-[1.7rem] tracking-[0.1em] text-cyan uppercase">{title}</span>
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onPointerDown={e => {
                e.preventDefault()
                onKey('done')
              }}
              className="flex h-[3.8rem] items-center gap-3 rounded-full border-2 border-cyan/60 px-7 text-[1.7rem] font-semibold tracking-[0.1em] text-frost uppercase active:bg-cyan/30"
            >
              <FaCheck /> Done
            </button>
          </div>
          <motion.div
            key={layout}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 flex-col justify-between"
          >
            {LAYOUTS[layout].map((row, i) => (
              <div key={i} className="flex justify-center gap-[0.6rem]">
                {[...row].map(k => (
                  <Key key={k} k={k} layout={layout} onKey={onKey} />
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
