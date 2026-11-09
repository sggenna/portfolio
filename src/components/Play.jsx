// Play: a mural of side quests. For now it's drawings, cropped and flattened like scans and hung like a small
// show: a white mat, a fine edge and a soft shadow, each one lifting a little when you hover it.
const LETTERS = ['P', 'l', 'a', 'y'];

// The featured piece, hung alone and largest at the top
const FEATURE = ['dancers', 2400, 1735, 'Charcoal drawing of dancers in full, swirling skirts'];

// [file, width, height, alt]
const DRAWINGS = [
  ['draped-figure', 1071, 1400, 'Charcoal drawing of a woman in a draped gown, standing in an arched niche'],
  ['knights', 1400, 1044, 'Graphite drawing of two knights in armor on horseback in a museum hall'],
  ['plant-triptych', 602, 1400, 'Three line drawings of a leafy plant, hung in a column'],
  ['capoeira', 1400, 992, 'Pencil and charcoal drawing of a capoeira roda under a dark arch'],
  ['sculptures', 1050, 1400, 'Graphite drawing of three sculptures on pedestals in a gallery'],
  ['plaza', 1400, 1014, 'Graphite line drawing of a city plaza and the buildings around it'],
  ['lilies', 975, 1400, 'Charcoal drawing of a figure lying down, holding white lilies'],
  ['gallery-room', 1034, 1400, 'Graphite drawing of a gallery corner with framed works and a hanging sculpture'],
];

export default function Play() {
  return (
    <section className="play">
      <header className="play__head">
        <h1 className="play__word" aria-label="Play">
          {LETTERS.map((ch, i) => <span key={ch} aria-hidden="true" style={{ '--i': i }}>{ch}</span>)}
          <img className="play__spark play__spark--a" src="/assets/v7/sparkle.png" alt="" />
          <img className="play__spark play__spark--b" src="/assets/v7/star.png" alt="" />
        </h1>
        <p className="play__copy" data-text="1">A mural of all my side quests.</p>
      </header>

      <figure className="mural__item mural__feature">
        <img src={`/assets/play/${FEATURE[0]}.webp`} width={FEATURE[1]} height={FEATURE[2]} alt={FEATURE[3]} draggable={false} />
      </figure>

      <ul className="mural" aria-label="Drawings">
        {DRAWINGS.map(([file, w, h, alt]) => (
          <li key={file} className="mural__item">
            <img src={`/assets/play/${file}.webp`} width={w} height={h} alt={alt} loading="lazy" draggable={false} />
          </li>
        ))}
      </ul>
    </section>
  );
}
