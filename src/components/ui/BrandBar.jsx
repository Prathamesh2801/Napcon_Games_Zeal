import config from '../../config/config'

const { logos } = config.app

function Logo({ src, label, className }) {
  if (src) return <img src={src} alt={label} className={`object-contain ${className}`} />

  return (
    <div
      className={`grid place-items-center rounded-2xl border-4 border-dashed border-brand/30 bg-brand-soft/60 text-xl font-semibold tracking-[0.15em] text-brand/70 uppercase ${className}`}
    >
      {label}
    </div>
  )
}

export default function BrandBar({ className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-8 ${className}`}>
      <Logo src={logos.left} label="Sun Pharma" className="aspect-[1.6] h-full" />
      <Logo src={logos.right} label="AB Phylline E" className="aspect-[6.4] h-full" />
    </div>
  )
}
