// Play is still being put together, so this is a big, playful placeholder: a wordmark you can poke
// and a fanned stack of blank pages that opens up on hover.
const LETTERS = ['P', 'l', 'a', 'y'];

export default function Play() {
  return (
    <section className="play">
      <div className="play__stage">
        <h1 className="play__word" aria-label="Play">
          {LETTERS.map((ch, i) => <span key={ch} aria-hidden="true" style={{ '--i': i }}>{ch}</span>)}
          <img className="play__spark play__spark--a" src="/assets/v7/sparkle.png" alt="" />
          <img className="play__spark play__spark--b" src="/assets/v7/star.png" alt="" />
        </h1>

        <div className="play__pages" aria-hidden="true">
          <span className="play__page play__page--back" />
          <span className="play__page play__page--mid" />
          <span className="play__page play__page--front" />
        </div>
      </div>

      <div className="play__note">
        <span className="play__soon">Coming soon</span>
        <p className="play__copy" data-text="1">A mural of all my side quests.</p>
      </div>
    </section>
  );
}
