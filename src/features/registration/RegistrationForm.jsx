import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa6'
import { LuPhone, LuUser } from 'react-icons/lu'
import config from '../../config/config'

const { onScreenKeyboard } = config.registration

function Field({ label, icon, active, inputRef, top, ...props }) {
  return (
    <>
      <div className="absolute right-[5.56rem] left-[7.25rem] z-10 flex h-[2.6rem] items-center" style={{ top: `${top - 3.4}rem` }}>
        <span className="text-[1.75rem] tracking-[0.06em] text-frost drop-shadow-[0_0.1rem_0.3rem_rgb(0_0_0/0.6)]">{label}</span>
      </div>
      <motion.label
        animate={{
          boxShadow: active
            ? '0 0 0 0.3rem rgb(0 240 249 / 1), 0 0 2.5rem 0.4rem rgb(0 240 249 / 0.55)'
            : '0 0 0 0 rgb(0 240 249 / 0), 0 0.5rem 1.5rem -0.5rem rgb(0 0 0 / 0.35)',
        }}
        transition={{ duration: 0.25 }}
        className="absolute left-[5.56rem] flex h-[6.4rem] w-[55.75rem] items-center gap-6 rounded-[1.25rem] bg-white px-[2.6rem] shadow-[inset_0_-0.3rem_0_#dbe3f3]"
        style={{ top: `${top}rem` }}
      >
        <span className="text-[2.6rem] text-night-ink">{icon}</span>
        <input
          ref={inputRef}
          autoComplete="off"
          inputMode={onScreenKeyboard ? 'none' : undefined}
          className="h-full w-full bg-transparent text-[1.95rem] text-ink caret-night-ink outline-none placeholder:text-hint"
          {...props}
        />
      </motion.label>
    </>
  )
}

export default function RegistrationForm({ screen, fieldProps, submitting }) {
  const [first, second] = screen.title

  return (
    <div className="relative h-[47.75rem] font-display">
      <img src={screen.brush} alt="" className="absolute top-0 left-[2.81rem] h-[10rem] w-[61.31rem]" />
      <h1 className="absolute inset-x-0 top-0 flex h-[10rem] items-center justify-center gap-[2.2rem] pb-[0.4rem] text-[5.3rem] leading-none tracking-[0.01em]">
        <span className="text-frost">{first}</span>
        <span className="text-cyan">{second}</span>
      </h1>
      <p className="absolute inset-x-0 top-[9.9rem] text-center text-[2.25rem] tracking-[0.05em] text-frost">{screen.subtitle}</p>

      <Field label="Full Name :" icon={<LuUser />} placeholder="Enter your full name" top={16.9} {...fieldProps('name')} />
      <Field label="Phone Number:" icon={<LuPhone />} placeholder="Enter your phone number" top={28.4} {...fieldProps('phone')} />

      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ['0 0 1.5rem 0.2rem rgb(0 240 249 / 0.35)', '0 0 2.8rem 0.6rem rgb(0 240 249 / 0.6)', '0 0 1.5rem 0.2rem rgb(0 240 249 / 0.35)'] }}
        transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }}
        className="absolute top-[38.9rem] left-[13rem] flex h-[8.25rem] w-[41rem] items-center justify-center gap-8 overflow-hidden rounded-full border-[0.3rem] border-cyan/80 bg-[linear-gradient(90deg,#0a2a9e_0%,#0b4fcf_45%,#0d8fe0_80%,#12c9e6_100%)] text-[3.3rem] tracking-[0.12em] text-frost uppercase"
      >
        <motion.span
          aria-hidden
          initial={{ x: '-120%' }}
          animate={{ x: '320%' }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.2, ease: 'easeInOut' }}
          className="absolute inset-y-0 left-0 w-1/4 -skew-x-20 bg-white/25 blur-md"
        />
        <span className="relative">{screen.button}</span>
        <FaArrowRight className="relative text-[2.6rem]" />
      </motion.button>
    </div>
  )
}
