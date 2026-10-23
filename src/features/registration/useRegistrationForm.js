import { useRef, useState } from 'react'

export default function useRegistrationForm() {
  const [values, setValues] = useState({ name: '', phone: '' })
  const [active, setActive] = useState(null)
  const inputs = useRef({})

  const update = (field, value) => setValues(v => ({ ...v, [field]: value }))

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

  const check = () => ({ name: values.name.trim(), phone: values.phone.trim() })

  const fieldProps = field => ({
    value: values[field],
    active: active === field,
    inputRef: el => (inputs.current[field] = el),
    onFocus: () => setActive(field),
    onChange: e => update(field, e.target.value),
  })

  return { active, focus, press, check, fieldProps }
}
