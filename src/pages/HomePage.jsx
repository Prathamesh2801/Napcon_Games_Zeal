import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import Screen from '../components/layout/Screen'
import config from '../config/config'
import { games } from '../features/games'

export default function HomePage() {
  const navigate = useNavigate()
  const start = id => navigate(config.registration.enabled ? `/register/${id}` : `/play/${id}`)

  return (
    <Screen className="px-14 pt-28 pb-20">
      <header className="text-center">
        <h1 className="mt-6 text-7xl font-bold">{config.app.title}</h1>
        <p className="mt-6 text-3xl text-muted">{config.app.subtitle}</p>
      </header>

      <div className="mt-20 flex flex-1 flex-col gap-10">
        {Object.entries(config.games).map(([id, game], i) => {
          const Icon = games[id].Icon
          return (
            <motion.button
              key={id}
              onClick={() => start(id)}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.1 } }}
              className="relative flex flex-1 flex-col items-start justify-end overflow-hidden rounded-[3rem] border border-line bg-surface p-14 text-left shadow-card"
            >
              <Icon aria-hidden className="absolute -top-12 -right-12 text-[24rem] text-brand/5" />
              <span className="grid size-28 place-items-center rounded-[2rem] bg-brand-soft text-6xl text-brand">
                <Icon />
              </span>
              <h2 className="mt-10 text-6xl font-bold">{game.title}</h2>
              <p className="mt-4 text-3xl text-muted">{game.description}</p>
              <span className="mt-10 inline-flex items-center gap-4 text-3xl font-semibold text-brand">
                Tap to play <FaArrowRight />
              </span>
            </motion.button>
          )
        })}
      </div>
    </Screen>
  )
}
