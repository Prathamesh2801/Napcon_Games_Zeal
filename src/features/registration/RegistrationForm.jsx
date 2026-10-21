import { useRef, useState } from 'react'
import { FaArrowRight, FaPhone, FaSpinner, FaUser } from 'react-icons/fa6'
import Button from '../../components/ui/Button'
import OnScreenKeyboard from '../../components/ui/OnScreenKeyboard'
import config from '../../config/config'
import { submitRegistration } from '../../services/api/registration'

const { fields, onScreenKeyboard } = config.registration

const sanitize = {
  name: v =>
    v
      .replace(/[^\p{L} .'-]/gu, '')
      .replace(/^\s+/, '')
      .replace(/\s{2,}/g, ' ')
      .slice(0, fields.name.maxLength),
  phone: v => v.replace(/\D/g, '').slice(0, fields.phone.length),
}

function validate({ name, phone }) {
  const errors = {}
  const n = name.trim()
  if (fields.name.required && !n) errors.name = 'Please enter your name'
  else if (n && n.length < fields.name.minLength) errors.name = `At least ${fields.name.minLength} characters`
  if (fields.phone.required && !phone) errors.phone = 'Please enter your phone number'
  else if (phone && phone.length !== fields.phone.length) errors.phone = `Enter a ${fields.phone.length}-digit number`
  return errors
}

function Field({ label, icon, error, active, inputRef, optional, ...props }) {
  const border = error ? 'border-danger' : active ? 'border-brand' : 'border-line'
  return (
    <label className="block">
      <span className="mb-3 block text-3xl font-semibold text-muted">
        {label} {optional && <span className="font-normal">(optional)</span>}
      </span>
      <span className={`flex h-36 items-center gap-7 rounded-[2rem] border-4 bg-surface px-10 transition-colors ${border}`}>
        <span className={`text-4xl ${active ? 'text-brand' : 'text-muted'}`}>{icon}</span>
        <input
          ref={inputRef}
          autoComplete="off"
          inputMode={onScreenKeyboard ? 'none' : undefined}
          className="h-full w-full bg-transparent text-5xl font-medium outline-none placeholder:text-muted/40"
          {...props}
        />
      </span>
      <span className="mt-2 block h-9 text-2xl text-danger">{error}</span>
    </label>
  )
}

export default function RegistrationForm({ gameId, onDone }) {
  const [values, setValues] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [active, setActive] = useState('name')
  const [submitting, setSubmitting] = useState(false)
  const inputs = useRef({})

  const update = (field, value) => {
    setValues(v => ({ ...v, [field]: sanitize[field](value) }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  const press = key => {
    const cur = values[active]
    if (key === 'backspace') return update(active, cur.slice(0, -1))
    if (key === 'clear') return update(active, '')
    if (key === 'space') return update(active, cur + ' ')
    const capitalize = active === 'name' && (!cur || cur.endsWith(' '))
    update(active, cur + (capitalize ? key.toUpperCase() : key))
  }

  const submit = async e => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    const firstError = Object.keys(errs)[0]
    if (firstError) {
      setActive(firstError)
      inputs.current[firstError]?.focus()
      return
    }
    setSubmitting(true)
    const player = { name: values.name.trim(), phone: values.phone }
    await submitRegistration({ ...player, game: gameId, registeredAt: new Date().toISOString() })
    onDone(player)
  }

  const fieldProps = field => ({
    value: values[field],
    error: errors[field],
    active: active === field,
    optional: !fields[field].required,
    inputRef: el => (inputs.current[field] = el),
    onFocus: () => setActive(field),
    onChange: e => update(field, e.target.value),
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center px-16 py-10">
        <h1 className="text-7xl font-bold">Let's get you started</h1>
        <p className="mt-5 text-4xl text-muted">Enter your details to play</p>

        <div className="mt-16 space-y-5">
          <Field label="Full name" icon={<FaUser />} placeholder="Your name" autoFocus {...fieldProps('name')} />
          <Field label="Phone number" icon={<FaPhone />} type="tel" placeholder="10-digit mobile" {...fieldProps('phone')} />
        </div>

        <Button type="submit" disabled={submitting} className="mt-10 h-32! w-full text-4xl!">
          {submitting ? <FaSpinner className="animate-spin" /> : <FaArrowRight />}
          {submitting ? 'Starting…' : 'Start game'}
        </Button>
      </div>

      {onScreenKeyboard && <OnScreenKeyboard layout={active === 'phone' ? 'numeric' : 'text'} onKey={press} />}
    </form>
  )
}
