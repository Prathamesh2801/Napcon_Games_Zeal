import { useRef, useState } from 'react'
import config from '../../config/config'

const { fields } = config.registration

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

export default function useRegistrationForm() {
  const [values, setValues] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [active, setActive] = useState(null)
  const inputs = useRef({})

  const update = (field, value) => {
    setValues(v => ({ ...v, [field]: sanitize[field](value) }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  const focus = field => {
    setActive(field)
    if (field) inputs.current[field]?.focus()
    else document.activeElement?.blur()
  }

  const press = key => {
    if (!active) return
    const cur = values[active]
    if (key === 'next') return focus('phone')
    if (key === 'done') return focus(null)
    if (key === 'backspace') return update(active, cur.slice(0, -1))
    if (key === 'clear') return update(active, '')
    if (key === 'space') return update(active, cur + ' ')
    const capitalize = active === 'name' && (!cur || cur.endsWith(' '))
    update(active, cur + (capitalize ? key.toUpperCase() : key))
  }

  const check = () => {
    const errs = validate(values)
    setErrors(errs)
    const firstError = Object.keys(errs)[0]
    if (firstError) {
      focus(firstError)
      return null
    }
    return { name: values.name.trim(), phone: values.phone }
  }

  const fieldProps = field => ({
    value: values[field],
    error: errors[field],
    active: active === field,
    inputRef: el => (inputs.current[field] = el),
    onFocus: () => setActive(field),
    onChange: e => update(field, e.target.value),
  })

  return { active, focus, press, check, fieldProps }
}
