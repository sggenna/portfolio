import { useEffect, useRef, useState } from 'react';
import { useEnv } from '../hooks/useEnv.js';

// After Motion-Primitives' Cursor (motion-primitives.com/docs/cursor), attached to its parent:
// while the pointer is over the parent, `children` follow it on a soft spring.
// The parent hides the system cursor itself (see .card--cursor in styles.css).
const STIFFNESS = 260;
const DAMPING = 26;

export default function Cursor({ children }) {
  const { motion } = useEnv();
  const root = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = root.current;
    const parent = el?.parentElement;
    if (!parent) return;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0, vx: 0, vy: 0 };
    let raf = 0;
    let last = 0;

    const draw = () => { el.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`; };
    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
      last = now;
      for (const k of ['x', 'y']) {
        const a = -STIFFNESS * (pos[k] - target[k]) - DAMPING * pos[`v${k}`];
        pos[`v${k}`] += a * dt;
        pos[k] += pos[`v${k}`] * dt;
      }
      draw();
      const settled = Math.hypot(pos.x - target.x, pos.y - target.y) < 0.1 && Math.hypot(pos.vx, pos.vy) < 1;
      raf = settled ? 0 : requestAnimationFrame(step);
    };
    const snap = () => { pos.x = target.x; pos.y = target.y; pos.vx = pos.vy = 0; draw(); };

    const enter = (e) => { target.x = e.clientX; target.y = e.clientY; snap(); setOn(true); };
    const move = (e) => {
      target.x = e.clientX; target.y = e.clientY;
      if (!motion) { snap(); return; }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
    };
    const leave = () => { setOn(false); cancelAnimationFrame(raf); raf = 0; };

    parent.addEventListener('mouseenter', enter);
    parent.addEventListener('mousemove', move);
    parent.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener('mouseenter', enter);
      parent.removeEventListener('mousemove', move);
      parent.removeEventListener('mouseleave', leave);
    };
  }, [motion]);

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <div className={`cursor__in${on ? ' is-on' : ''}`}>{children}</div>
    </div>
  );
}
