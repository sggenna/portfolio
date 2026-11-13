// Play: drawings hung like an editorial art page. No cards or mats, each straight on the cream, on a 12-column grid
// of uneven sizes. Placement and captions come from DRAWINGS in src/play.js.
// As you scroll, each drawing grows into full size as it reaches the middle of the screen and shrinks as it leaves,
// its caption with it (after Skiper UI's Team Showcase Scroll). Still, at full size, for anyone who asks for less motion.
import { useEffect, useRef } from 'react';
import { useEnv } from '../hooks/useEnv.js';
import { DRAWINGS } from '../play.js';

const SMALLEST = 0.35; // how small a drawing gets at the very edge of the screen

// Scale every piece by how far its middle is from the middle of the screen: full size there, SMALLEST at the edges.
function useScrollScale(on) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!on || !root) return undefined;
    const pieces = [...root.querySelectorAll('.gallery__piece')];
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of pieces) {
        // It scales around its own center, so its middle stays put whatever size it is right now.
        const r = el.getBoundingClientRect();
        const h = el.offsetHeight;
        const mid = r.top + r.height / 2;
        const d = Math.min(1, Math.abs(mid - vh / 2) / (vh / 2 + h / 2));
        el.style.setProperty('--s', (SMALLEST + (1 - SMALLEST) * (1 - d * d)).toFixed(3));
      }
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    // The page scrolls inside .main on wide screens and on the window on narrow ones; listen for both.
    document.addEventListener('scroll', queue, { capture: true, passive: true });
    window.addEventListener('resize', queue);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('scroll', queue, { capture: true });
      window.removeEventListener('resize', queue);
      pieces.forEach((el) => el.style.removeProperty('--s'));
    };
  }, [on]);
  return ref;
}

function Drawing({ d }) {
  return (
    <figure
      className={`gallery__piece${d.height ? ' gallery__piece--crop' : ''}`}
      style={{ '--h': d.height ? `${d.height}px` : undefined, '--size': d.size, '--focus': d.focus, alignSelf: d.align === 'end' ? 'flex-end' : undefined }}
    >
      <img src={`/assets/play/${d.image}.webp`} width={d.w} height={d.h} alt={d.alt} loading="lazy" draggable={false} />
      <figcaption className="gallery__caption">
        {d.caption
          ? <>{d.caption}{d.medium && <span className="gallery__medium"> · {d.medium}</span>}</>
          : d.medium}
      </figcaption>
    </figure>
  );
}

// Group the drawings into rows, and each row into its pieces: a lone drawing, or a stack sharing one column.
function rows() {
  const out = [];
  for (const d of DRAWINGS) {
    let row = out.find((r) => r.n === d.row);
    if (!row) out.push((row = { n: d.row, pieces: [] }));
    const stack = d.stack && row.pieces.find((p) => p.stack === d.stack);
    if (stack) stack.items.push(d);
    else row.pieces.push({ stack: d.stack, col: d.col, span: d.span, offset: d.offset || 0, items: [d] });
  }
  return out.sort((a, b) => a.n - b.n);
}

export default function Play() {
  const { motion } = useEnv();
  const gallery = useScrollScale(motion);
  return (
    <section className="play">
      {/* The plum wordmark with its stars, held still */}
      <header className="play__head">
        <h1 className="play__word">
          Play
          <img className="play__spark play__spark--a" src="/assets/v7/sparkle.png" alt="" />
          <img className="play__spark play__spark--b" src="/assets/v7/star.png" alt="" />
        </h1>
        <p className="play__copy" data-text="1">A mural of some of my side quests.</p>
      </header>

      <div ref={gallery} className={`gallery${motion ? ' gallery--scaling' : ''}`}>
        {rows().map((row) => (
          <div key={row.n} className="gallery__row">
            {row.pieces.map((p) => (
              <div
                key={p.items[0].image}
                className="gallery__cell"
                style={{ gridColumn: `${p.col} / span ${p.span}`, '--offset': `${p.offset}px` }}
              >
                {p.items.map((d) => <Drawing key={d.image} d={d} />)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
