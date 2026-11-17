export function Caught({ letter, count, total, onContinue }: { letter: string; count: number; total: number; onContinue(): void }) {
  return (
    <section className="screen">
      <h1>Сигнал зловлено</h1>
      <div className="big-letter">{letter}</div>
      <p>Сигналів: {count} з {total}</p>
      <button onClick={onContinue}>Далі</button>
    </section>
  )
}
