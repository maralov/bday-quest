import { Children, isValidElement, type ReactNode } from 'react'
import '../theme.css'

const typeIds = new WeakMap<object, number>()
let lastId = 0
const typeId = (t: unknown) => {
  if (typeof t !== 'object' && typeof t !== 'function') return String(t)
  if (!typeIds.has(t as object)) typeIds.set(t as object, ++lastId)
  return typeIds.get(t as object)
}

// Ключ екрана: типи й ключі дочірніх елементів. Змінився — перезапускаємо лише оверлей glitch, не самі екрани.
const screenKey = (children: ReactNode) =>
  Children.toArray(children).map((c) => (isValidElement(c) ? `${typeId(c.type)}${c.key}` : '')).join('|')

export function Shell({ letters, total, children }: { letters: string[]; total: number; children: ReactNode }) {
  return (
    <div className="shell">
      <div className="fx" aria-hidden />
      <div className="glitch" key={screenKey(children)} aria-hidden />
      <header className="log">
        <div className="log-title">Журнал сигналів</div>
        <div className="log-cells">
          {Array.from({ length: total }, (_, i) => (
            <span className="log-cell" key={i}>{letters[i] ?? ''}</span>
          ))}
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
