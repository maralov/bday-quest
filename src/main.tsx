import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!)

// App імпортуємо динамічно: validateQuest кидає під час імпорту, і помилку треба показати на екрані.
import('./App').then(
  ({ default: App }) => root.render(<StrictMode><App /></StrictMode>),
  (e: unknown) => root.render(
    <pre style={{ color: '#f66', padding: 16, whiteSpace: 'pre-wrap' }}>
      {e instanceof Error ? e.message : String(e)}
    </pre>,
  ),
)
