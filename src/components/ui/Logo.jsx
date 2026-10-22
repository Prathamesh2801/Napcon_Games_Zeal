import { FaImage } from 'react-icons/fa6'
import config from '../../config/config'

export default function Logo({ className = '' }) {
  if (config.app.logo) return <img src={config.app.logo} alt={config.app.title} className={`object-contain ${className}`} />

  return (
    <div
      className={`flex items-center justify-center gap-4 rounded-[2rem] border-4 border-dashed border-brand/30 bg-brand-soft/60 text-2xl font-semibold tracking-[0.2em] text-brand/60 uppercase ${className}`}
    >
      <FaImage className="text-4xl" /> Logo
    </div>
  )
}
