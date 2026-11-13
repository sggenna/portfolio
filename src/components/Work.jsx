import { useEffect, useRef, useState } from 'react';
import { PROJECTS, casePath } from '../data.js';
import { useEnv } from '../hooks/useEnv.js';
import Cursor from './Cursor.jsx';
import Reveal from './Reveal.jsx';

// The frame a card rests on: the `#t=` in its video URL, otherwise the first frame.
const restTime = (src) => Number(src?.match(/#t=([\d.]+)/)?.[1] ?? 0);

// How long the resting frame takes to fade back over the video when it stops.
const SETTLE_MS = 500;

// A live page on the card, scaled as one piece to the tile. It can't be hovered itself, so `playing` tells it.
function CardFrame({ frame, title, playing }) {
  const box = useRef(null);
  const iframe = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    iframe.current?.contentWindow?.postMessage(playing ? 'play' : 'stop', window.location.origin);
  }, [playing]);
  return (
    <div ref={box} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {width > 0 && (
        <iframe
          ref={iframe}
          className="card__frame"
          src={frame.src}
          title={title}
          loading="lazy"
          scrolling="no"
          inert
          style={{ width: frame.w, height: frame.h, transform: `scale(${width / frame.w})` }}
        />
      )}
    </div>
  );
}

function ProjectCard({ p, hovered, onEnter, onLeave, onOpen }) {
  const { motion, narrow, fine, mainRef } = useEnv();
  const video = useRef(null);
  const still = useRef(null);
  const settle = useRef(0);
  const [resting, setResting] = useState(true);
  const lift = hovered && motion;
  const showTags = hovered || narrow;

  // Keep a still of the resting frame so stopping can fade back to it instead of cutting.
  const paintStill = () => {
    const v = video.current;
    const c = still.current;
    if (!v || !c || !v.videoWidth || Math.abs(v.currentTime - restTime(p.video)) > 0.1) return;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
  };

  const wake = (v) => {
    clearTimeout(settle.current);
    setResting(false);
    v.play()?.catch(() => {});
  };

  // Fade the still in while the video keeps playing underneath, then rewind it out of sight.
  const sleep = (v) => {
    setResting(true);
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      v.pause();
      v.currentTime = restTime(p.video);
    }, SETTLE_MS);
  };

  useEffect(() => () => clearTimeout(settle.current), []);

  // Touch / narrow: play whichever videos are mostly on screen. Desktop: play on hover (below).
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    v.setAttribute('playsinline', '');
    if (!motion) { v.pause(); return; }
    if (fine || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) wake(v); else sleep(v); },
      { root: narrow ? null : mainRef.current, threshold: 0.6 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [motion, fine, narrow, mainRef, p.video]);

  const hoverVideo = (on) => {
    const v = video.current;
    if (!v || !fine || !motion) return;
    if (on) wake(v); else sleep(v);
  };

  // A "coming soon" project shows its card but doesn't open.
  const Card = p.soon ? 'div' : 'a';
  const link = p.soon ? {} : { href: casePath(p), onClick: (e) => onOpen(p.key, e) };

  return (
    <Card
      {...link}
      className={`card${fine ? ' card--cursor' : ''}`}
      onMouseEnter={() => { onEnter(p.key); hoverVideo(true); }}
      onMouseLeave={() => { onLeave(); hoverVideo(false); }}
    >
      <div className={`card__media${p.framed ? ' media-framed' : ''}`} style={{ transform: lift ? 'translateY(-4px)' : 'none', background: p.color || p.fit }}>
        {p.video ? (
          <video
            ref={video}
            src={p.video}
            poster={p.poster || undefined}
            muted
            loop
            playsInline
            preload="metadata"
            style={{ transform: p.zoom ? `scale(${p.zoom})` : undefined, objectFit: p.fit ? 'contain' : undefined }}
            onLoadedData={paintStill}
            onSeeked={paintStill}
            aria-label={`${p.name} product video`}
          />
        ) : p.frame ? (
          <CardFrame frame={p.frame} title={`${p.name} product demo`} playing={hovered} />
        ) : !p.soon && (
          <span className="card__placeholder">Product video · 16:9</span>
        )}
        {p.video && (
          <canvas
            ref={still}
            className="card__still"
            aria-hidden="true"
            style={{
              opacity: resting ? 1 : 0,
              transform: p.zoom ? `scale(${p.zoom})` : undefined,
              objectFit: p.fit ? 'contain' : undefined,
              transition: `opacity ${resting ? SETTLE_MS : 200}ms ease`,
            }}
          />
        )}
        <div
          className="card__tags"
          style={{
            opacity: showTags ? 1 : 0,
            transform: showTags || !motion ? 'none' : 'translateY(-4px)',
          }}
        >
          {p.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
      <div className="card__body" style={{ transform: lift ? 'translateX(4px)' : 'none' }}>
        {/* One line: the name in plum, then the outcome in gray. The slash stays with the name when it wraps. */}
        <span className="card__caption">
          <span className="card__title" style={hovered ? { color: 'var(--magenta)' } : undefined}>
            {p.name}{p.caption && <span className="card__slash"> /</span>}
          </span>
          {p.caption && <> <span className="card__outcome">{p.caption}</span></>}
        </span>
        {fine && p.soon && <span className="sr-only">Coming soon</span>}
        {!fine && <span className="card__cta">{p.soon ? 'Coming soon' : 'View case study →'}</span>}
      </div>
      {fine && <Cursor>{p.soon ? 'Coming soon' : '+ View'}</Cursor>}
    </Card>
  );
}

export default function Work({ hover, onHover, onOpen }) {
  return (
    <div className="grid">
      {PROJECTS.map((p) => (
        <Reveal key={p.key}>
          <ProjectCard
            p={p}
            hovered={hover === p.key}
            onEnter={onHover}
            onLeave={() => onHover('')}
            onOpen={onOpen}
          />
        </Reveal>
      ))}
    </div>
  );
}
