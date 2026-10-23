import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { FaRotateRight } from 'react-icons/fa6'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import Screen from '../components/layout/Screen'
import Stage from '../components/layout/Stage'
import config from '../config/config'
import ChallengeButton from '../features/intro/ChallengeButton'

const HEADER = [9.375, 8.75, 47.8125, 20.625]
const PACK = [18.25, 37.8125, 28.3125, 23.5625]
const ARC = [15.75, 56.125, 32.3125, 13.0625]
const ITEMS = [
  { icon: [6.125, 56.375, 7.375, 6.625], text: [3.0625, 63.75, 12, 5.8125] },
  { icon: [16.125, 66.25, 7.375, 6.5625], text: [13.5625, 73.625, 11.0625, 4.25] },
  { icon: [28.8125, 71.5625, 7.375, 6.625], text: [26.8125, 78.8125, 10.125, 5.9375] },
  { icon: [41.875, 66.25, 7.375, 6.5625], text: [37.75, 73.5, 14.4375, 7.5] },
  { icon: [51.5, 56.375, 7.3125, 6.625], text: [48.375, 63.625, 12.125, 5.8125] },
]

const ITEM_START = 1.3
const ITEM_GAP = 0.55

const box = ([left, top, width, height]) => ({
  left: `${left}rem`,
  top: `${top}rem`,
  width: `${width}rem`,
  height: `${height}rem`,
})

function Layer({ src, rect, ...motionProps }) {
  return <motion.img src={src} alt="" style={box(rect)} className="absolute mix-blend-multiply" {...motionProps} />
}

export default function FinalePage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const fromBreak = !!state?.fromBreak
  const finale = config.games[gameId]?.finale
  const home = () => navigate('/', { replace: true })

  useEffect(() => {
    if (!finale) return
    const id = setTimeout(home, finale.seconds * 1000)
    return () => clearTimeout(id)
  }, [finale])

  if (!finale) return <Navigate to="/" replace />

  const src = name => `${finale.media}/${name}.webp`
  const settle = ITEM_START + ITEMS.length * ITEM_GAP + 0.8

  return (
    <Screen animateIn={!fromBreak} className="bg-white">
      <Stage>
        <motion.img
          src={src('base')}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 w-[67.5rem]"
        />

        <Layer
          src={src('header')}
          rect={HEADER}
          initial={{ opacity: 0, y: '-2.5rem' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        <Layer
          src={src('pack')}
          rect={PACK}
          initial={{ opacity: fromBreak ? 1 : 0 }}
          animate={{ opacity: 1, y: ['0rem', '-0.6rem', '0rem'] }}
          transition={{
            opacity: { duration: 0.6 },
            y: { delay: 0.6, duration: 4, repeat: Infinity, repeatDelay: 0.5, ease: 'easeInOut' },
          }}
        />

        <Layer
          src={src('arc')}
          rect={ARC}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ delay: ITEM_START - 0.1, duration: ITEMS.length * ITEM_GAP, ease: 'easeInOut' }}
        />

        {ITEMS.map((item, i) => {
          const at = ITEM_START + i * ITEM_GAP
          return (
            <div key={i}>
              <Layer
                src={src(`item-${i + 1}-icon`)}
                rect={item.icon}
                initial={{ opacity: 0, scaleX: 0, scaleY: 0, rotate: -40 }}
                animate={{ opacity: 1, scaleX: 1, scaleY: 1, rotate: 0, scale: [1, 1.1, 1] }}
                transition={{
                  opacity: { delay: at, duration: 0.2 },
                  default: { delay: at, type: 'spring', stiffness: 260, damping: 13 },
                  scale: {
                    delay: settle + i * 0.6,
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: ITEMS.length * 0.6 + 1.5,
                    ease: 'easeInOut',
                  },
                }}
              />
              <Layer
                src={src(`item-${i + 1}-text`)}
                rect={item.text}
                initial={{ opacity: 0, y: '1.5rem' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: at + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          )
        })}

        <ChallengeButton
          label={finale.button}
          icon={FaRotateRight}
          delay={settle}
          textClassName="text-[2.5rem]"
          onClick={home}
          className="absolute top-[87.2rem] left-[16.75rem] h-[6.8rem] w-[34rem]"
        />
      </Stage>
    </Screen>
  )
}
