export default function Stage({ className = '', children }) {
  return (
    <div className={`absolute top-[calc(50%-60rem)] left-[calc(50%-33.75rem)] h-[120rem] w-[67.5rem] ${className}`}>
      {children}
    </div>
  )
}
