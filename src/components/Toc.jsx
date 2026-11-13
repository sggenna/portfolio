import { useCallback, useEffect, useRef, useState } from 'react';
import { useEnv } from '../hooks/useEnv.js';

// Reading-aware outline for the case study, after skecher-ui's Table of Content
// (skecher-ui.com/docs/table-of-content). `full` is the roomy version with a tick ruler and
// sliding marker; `compact` is a quiet rail of dashes that names the sections on hover.
const TICK = 7;
const MAJOR = 5;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// Where "now reading" sits. Near the end of the page it slides down so the last section can become active.
function readingLine(root, lastEl) {
  const start = root.getBoundingClientRect().top + 40;
  if (!lastEl) return start;
  const remaining = Math.max(0, root.scrollHeight - root.clientHeight - root.scrollTop);
  const lastAtEnd = lastEl.getBoundingClientRect().top - remaining;
  const needed = Math.max(0, lastAtEnd - start + 16);
  const runway = root.clientHeight / 2;
  return start + needed * (1 - clamp01(remaining / Math.max(1, runway)));
}

export default function Toc({ items, scrollerRef, variant }) {
  const { motion } = useEnv();
  const [active, setActive] = useState(items[0]?.id ?? null);
  const [ticks, setTicks] = useState(0);
  const rail = useRef(null);
  const ruler = useRef(null);
  const thumb = useRef(null);
  const head = useRef({ cur: 0, target: 0, raf: 0 });
  const full = variant === 'full';

  const writeHead = (v) => ruler.current?.style.setProperty('--head', String(v));
  const setHead = useCallback((target) => {
    const h = head.current;
    h.target = target;
    if (!motion) { h.cur = target; writeHead(target); return; }
    if (h.raf) return;
    const tick = () => {
      const d = h.target - h.cur;
      if (Math.abs(d) < 0.1) { h.cur = h.target; writeHead(h.cur); h.raf = 0; return; }
      h.cur += d * 0.2;
      writeHead(h.cur);
      h.raf = requestAnimationFrame(tick);
    };
    h.raf = requestAnimationFrame(tick);
  }, [motion]);

  // Scroll-spy.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || !items.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = readingLine(root, document.getElementById(items[items.length - 1].id));
      let current = items[0].id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(current);

      const r = rail.current;
      const link = r?.querySelector(`[data-toc-id="${current}"]`);
      if (!r || !link) return;
      const top = link.getBoundingClientRect().top - r.getBoundingClientRect().top;
      if (thumb.current) {
        // Move and size it with one transform; its CSS height is a 100px base.
        thumb.current.style.transform = `translateY(${top + 4}px) scaleY(${Math.max(0, link.offsetHeight - 8) / 100})`;
      }
      // How far through the active section we are, for the ruler's glowing head.
      const i = items.findIndex((it) => it.id === current);
      const a = document.getElementById(current);
      const b = items[i + 1] ? document.getElementById(items[i + 1].id) : null;
      let through = 1;
      if (a && b) {
        const s = a.getBoundingClientRect().top;
        through = clamp01((line - s) / Math.max(1, b.getBoundingClientRect().top - s));
      }
      setHead(top + through * link.offsetHeight);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    root.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    if (rail.current) ro.observe(rail.current);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [items, scrollerRef, setHead, variant]);

  useEffect(() => () => cancelAnimationFrame(head.current.raf), []);

  // Ruler: one tick every 7px of rail height.
  useEffect(() => {
    const r = rail.current;
    if (!r || !full) return;
    const measure = () => setTicks(Math.floor(r.offsetHeight / TICK) + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(r);
    const move = (e) => ruler.current?.style.setProperty('--probe', String(e.clientY - r.getBoundingClientRect().top));
    const leave = () => ruler.current?.style.setProperty('--probe', '-999');
    leave();
    r.addEventListener('pointermove', move);
    r.addEventListener('pointerleave', leave);
    return () => { ro.disconnect(); r.removeEventListener('pointermove', move); r.removeEventListener('pointerleave', leave); };
  }, [full]);

  const go = (e, id) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' });
  };

  if (!full) {
    return (
      <nav className="toc toc--compact" aria-label="On this page">
        <ul>
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                data-toc-id={it.id}
                className={it.id === active ? 'is-active' : undefined}
                aria-current={it.id === active ? 'location' : undefined}
                onClick={(e) => go(e, it.id)}
              >
                <span className="toc__dash" />
                <span className="toc__tip">{it.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <span ref={rail} hidden />
      </nav>
    );
  }

  return (
    <nav className="toc toc--full" aria-label="On this page">
      <span className="toc__title">On this page</span>
      <ul ref={rail} className="toc__rail">
        <li ref={ruler} className="toc__ruler" aria-hidden="true">
          {Array.from({ length: ticks }, (_, i) => (
            <span
              key={i}
              style={{
                top: i * TICK,
                '--y': i * TICK,
                '--base': i % MAJOR === 0 ? 8 : 4,
              }}
            />
          ))}
        </li>
        <span ref={thumb} className="toc__thumb" aria-hidden="true" />
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              data-toc-id={it.id}
              className={it.id === active ? 'is-active' : undefined}
              aria-current={it.id === active ? 'location' : undefined}
              onClick={(e) => go(e, it.id)}
            >
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
