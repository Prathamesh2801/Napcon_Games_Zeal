import { useState } from 'react'
import { useNavigate } from 'react-router'
import Screen from '../components/layout/Screen'
import config from '../config/config'
import ChallengeButton from '../features/intro/ChallengeButton'

let unlocked = false

const play = video => video?.play().catch(() => {
  video.muted = true
  video.play()
})

export default function IdlePage({ to }) {
  const navigate = useNavigate()
  const [ready, setReady] = useState(unlocked)

  const unlock = () => {
    unlocked = true
    setReady(true)
  }

  if (!ready) {
    return (
      <Screen className="items-center justify-center">
        <img src={config.registration.screen.background} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div onPointerDown={unlock} className="absolute inset-0 flex items-center justify-center">
          <ChallengeButton label={config.idle.button} delay={0.3} className="relative h-[9.5rem] w-[50rem]" />
        </div>
      </Screen>
    )
  }

  return (
    <Screen className="bg-black">
      <video
        ref={play}
        src={config.idle.video}
        loop
        playsInline
        preload="auto"
        onPointerDown={() => navigate(to, { replace: true })}
        className="h-full w-full object-cover"
      />
    </Screen>
  )
}
