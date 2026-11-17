export function TooEarly({ onBack }: { onBack(): void }) {
  return (
    <section className="screen">
      <p>Цей сигнал ще зашифровано. Спершу розгадай поточне завдання</p>
      <button onClick={onBack}>Назад</button>
    </section>
  )
}
