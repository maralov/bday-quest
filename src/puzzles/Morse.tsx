import type { MorsePuzzle } from '../core/quest'

// Заглушка: справжня головоломка з'явиться у своїй задачі.
export default function Morse({ data }: { data: MorsePuzzle }) {
  return (
    <div>
      <h2>{data.type}</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
