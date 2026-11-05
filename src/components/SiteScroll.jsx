import { useEffect, useRef, useState } from 'react';
import { useEnv } from '../hooks/useEnv.js';

// A landing page scrolling inside a browser window. The page is one long image moved with a browser
// animation, so it stays sharp and runs at full frame rate. Tiles keep any single image a safe size.
// Sizes and stops are in page pixels, so everything scales with the window.
const COMPACT_BELOW = 720;
const HOLD = 800; // ms paused on each section
const CUTS = {
  desktop: { w: 1440, h: 8239, view: 900, tile: 1600, over: 1.333, tiles: 6, stops: [0, 900, 1708, 2519, 3284, 3955, 4824, 5885, 6507, 7339] },
  phone: { w: 390, h: 10454, view: 700, tile: 1200, over: 1, tiles: 9, stops: [0, 439, 1265, 1860, 2677, 3272, 3867, 4303, 4898, 5493, 6088, 6690, 7285, 7722, 8588, 9432, 9754] },
};

function timeline({ h, view, stops }) {
  const at = (y) => `translate3d(0, ${(-y / h) * 100}%, 0)`;
  const travel = 'cubic-bezier(.65, 0, .35, 1)';
  const steps = [];
  let t = 0;
  stops.forEach((y, i) => {
    steps.push({ transform: at(y), t, easing: 'linear' });
    t += i === 0 ? HOLD * 1.5 : HOLD;
    if (i < stops.length - 1) {
      steps.push({ transform: at(y), t, easing: travel });
      t += Math.min(1500, Math.max(700, ((stops[i + 1] - y) / view) * 1100));
    }
  });
  // A longer hold at the bottom, then one smooth run back up to the top.
  t += HOLD;
  steps.push({ transform: at(stops[stops.length - 1]), t, easing: travel });
  t += 2000;
  steps.push({ transform: at(0), t, easing: 'linear' });
  return { duration: t, frames: steps.map(({ t: at_, ...f }) => ({ ...f, offset: at_ / t })) };
}

export default function SiteScroll({ base, url, label }) {
  const { motion } = useEnv();
  const box = useRef(null);
  const stack = useRef(null);
  const [width, setWidth] = useState(0);
  const [near, setNear] = useState(false);
  const name = width > 0 && width < COMPACT_BELOW ? 'phone' : 'desktop';
  const cut = CUTS[name];

  useEffect(() => {
    const el = box.current?.parentElement;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fetch the images a little before the window arrives on screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    // The margin only counts against the nearest scroller, which here is the case study dialog.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); }, { root: el.closest('.cs__scroll'), rootMargin: '800px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Start once every tile is decoded, so none can flash in blank, and only run while on screen.
  useEffect(() => {
    const el = stack.current;
    if (!el || !near || !motion || width === 0) return undefined;
    const { frames, duration } = timeline(cut);
    const anim = el.animate(frames, { duration, iterations: Infinity });
    anim.pause();
    let visible = false;
    let ready = false;
    const sync = () => { if (visible && ready) anim.play(); else anim.pause(); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(box.current);
    Promise.all([...el.querySelectorAll('img')].map((i) => i.decode().catch(() => {}))).then(() => { ready = true; sync(); });
    return () => { io.disconnect(); anim.cancel(); };
  }, [near, motion, name, width === 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Without motion the visitor scrolls the page themselves.
  const view = motion
    ? { role: 'img', 'aria-label': label }
    : { role: 'region', 'aria-label': label, tabIndex: 0, style: { overflowY: 'auto', aspectRatio: `${cut.w} / ${cut.view}` } };

  return (
    <div ref={box} className={`site-scroll${name === 'phone' ? ' site-scroll--phone' : ''}`}>
      <div className="site-scroll__bar" aria-hidden="true">{url}</div>
      <div className="site-scroll__view" style={{ aspectRatio: `${cut.w} / ${cut.view}` }} {...view}>
        <div ref={stack} key={name} className="site-scroll__page" style={{ aspectRatio: `${cut.w} / ${cut.h}` }}>
          {near && Array.from({ length: cut.tiles }, (_, i) => (
            <img
              key={i}
              src={`${base}/${name}-${i}.webp`}
              alt=""
              draggable={false}
              style={{
                top: `${((i * cut.tile) / cut.h) * 100}%`,
                height: `${(Math.min(cut.tile + cut.over, cut.h - i * cut.tile) / cut.h) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
