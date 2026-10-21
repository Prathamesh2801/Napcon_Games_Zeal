import { motion } from 'framer-motion'
import { FaDeleteLeft } from 'react-icons/fa6'

const LAYOUTS = {
  text: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', ['space', 'backspace']],
  numeric: ['123', '456', '789', ['clear', '0', 'backspace']],
}

const LABELS = { space: 'Space', clear: 'Clear', backspace: <FaDeleteLeft /> }

function keyWidth(key, layout) {
  if (layout === 'numeric') return 'w-[18rem]'
  if (key === 'space') return 'w-[36rem]'
  if (key === 'backspace') return 'w-[14rem]'
  return 'w-[5.6rem]'
}

export default function OnScreenKeyboard({ layout = 'text', onKey }) {
  return (
    <motion.div
      key={layout}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 rounded-t-[2.5rem] border-t border-line bg-surface px-6 pt-6 pb-10 shadow-card"
    >
      {LAYOUTS[layout].map((row, i) => (
        <div key={i} className="flex justify-center gap-3">
          {[...row].map(key => (
            <button
              key={key}
              type="button"
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onPointerDown={e => {
                e.preventDefault()
                onKey(key)
              }}
              className={`grid h-32 place-items-center rounded-2xl bg-paper text-5xl font-semibold text-ink uppercase shadow-[inset_0_-0.3rem_0_var(--color-line)] active:translate-y-0.5 active:bg-brand-soft ${keyWidth(key, layout)}`}
            >
              {LABELS[key] ?? key}
            </button>
          ))}
        </div>
      ))}
    </motion.div>
  )
}
