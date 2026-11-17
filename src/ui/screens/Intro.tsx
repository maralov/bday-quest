export function Intro({ title, text, onStart }: { title: string; text: string; onStart(): void }) {
  return (
    <section className="screen">
      <h1>{title}</h1>
      {text.split('\n').map((t, i) => <p key={i}>{t}</p>)}
      <button onClick={onStart}>Відповісти</button>
    </section>
  )
}
