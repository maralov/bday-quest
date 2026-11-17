import type { MirrorPuzzle } from '../core/quest'

export default function Mirror({ data }: { data: MirrorPuzzle }) {
  return (
    <div style={{ textAlign: 'center', color: 'var(--fg, #e8e8f0)' }}>
      <p
        aria-hidden="true"
        style={{
          transform: 'scale(-1, -1)', // віддзеркалено й догори дриґом, в будь-якій орієнтації
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTextSizeAdjust: '100%', // iOS не збільшує текст в альбомному режимі
          fontSize: 28,
          lineHeight: 1.4,
          color: 'var(--neon-cold, #3be8ff)',
        }}
      >
        {data.text}
      </p>
      <p style={{ fontSize: 18 }}>Тут усе навпаки</p>
    </div>
  )
}
