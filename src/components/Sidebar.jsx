import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NAV, NAV_PATHS } from '../data.js';
import { useEnv } from '../hooks/useEnv.js';

export function PulseDot() {
  return <span className="pulse" aria-hidden="true" />;
}

export function ContactLinks({ className = '' }) {
  return (
    <>
      <a className={className} href="mailto:gsg2141@columbia.edu">Email ↗</a>
      <a className={className} href="https://www.linkedin.com/in/genna-gonzaga/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
      <a className={className} href="/genna-gonzaga-resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a>
    </>
  );
}

// What the avatar says when you hover it: a different line each time.
const GREETINGS = ['oi!', 'tudo bem?', 'hi hi!', 'olá!', 'that tickles', 'eita!', 'welcome in!', 'boo!', 'still here :)'];

// The self-portrait: blinks on a timer, looks toward a hovered project, tips on hover, and flips
// the custom cursor to white while it's over the dark parts of the drawing. On a phone there's no
// hover, so a tap does the same: she tips, blinks and says the next line for a moment.
// Until someone plays with her, a small note beside her says how.

const SAY_MS = 1800;

export function Portrait({ lookRight = false, touch = false, className = '' }) {
  const { motion } = useEnv();
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const [greeting, setGreeting] = useState(GREETINGS.length - 1); // first hover lands on 'oi!'
  const [blinking, setBlinking] = useState(false);
  // Shown on every visit until she's played with, so the invitation is always there for someone new.
  const [played, setPlayed] = useState(false);
  const blinkingRef = useRef(false);
  const blinkTimer = useRef(0);
  const sayTimer = useRef(0);
  const pixels = useRef(null);

  const play = () => setPlayed(true);

  const blink = useCallback(() => {
    if (!motion || blinkingRef.current) return;
    blinkingRef.current = true;
    setBlinking(true);
    blinkTimer.current = setTimeout(() => { blinkingRef.current = false; setBlinking(false); }, 360);
  }, [motion]);

  useEffect(() => {
    const id = setInterval(blink, 4800);
    return () => { clearInterval(id); clearTimeout(blinkTimer.current); blinkingRef.current = false; };
  }, [blink]);

  useEffect(() => () => clearTimeout(sayTimer.current), []);

  // A tap is a short hover: the next line, a tip and a blink, then she settles back.
  const tap = () => {
    setGreeting((g) => (g + 1) % GREETINGS.length);
    setHover(true);
    blink();
    play();
    clearTimeout(sayTimer.current);
    sayTimer.current = setTimeout(() => setHover(false), SAY_MS);
  };

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (!pixels.current) {
      pixels.current = 'loading';
      const im = new Image();
      im.onload = () => {
        const c = document.createElement('canvas');
        c.width = im.width; c.height = im.height;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(im, 0, 0);
        pixels.current = { ctx, w: im.width, h: im.height };
      };
      im.src = '/assets/v8/avatar-left.png';
      return;
    }
    if (pixels.current === 'loading') return;
    const { ctx, w, h } = pixels.current;
    const r = el.getBoundingClientRect();
    const px = Math.floor(((e.clientX - r.left) / r.width) * w);
    const py = Math.floor(((e.clientY - r.top) / r.height) * h);
    if (px < 0 || py < 0 || px >= w || py >= h) return;
    const d = ctx.getImageData(px, py, 1, 1).data;
    const dark = d[3] > 120 && 0.3 * d[0] + 0.59 * d[1] + 0.11 * d[2] < 150;
    if (dark !== el.hasAttribute('data-dark')) {
      if (dark) el.setAttribute('data-dark', '1'); else el.removeAttribute('data-dark');
    }
  };

  const leave = () => {
    setHover(false);
    ref.current?.removeAttribute('data-dark');
  };

  const hover_ = touch
    ? { onClick: tap, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(); } } }
    : { onMouseMove: onMove, onMouseEnter: () => { setGreeting((g) => (g + 1) % GREETINGS.length); setHover(true); blink(); play(); }, onMouseLeave: leave };

  return (
    <div
      ref={ref}
      className={`portrait${touch ? ' portrait--touch' : ''}${className ? ` ${className}` : ''}`}
      style={{ transform: hover && motion ? 'rotate(-4deg) translateY(-2px)' : 'none' }}
      {...(touch && { role: 'button', tabIndex: 0, 'aria-label': 'Say hi to Genna’s self-portrait' })}
      {...hover_}
    >
      <img className="portrait__base" src="/assets/v8/avatar-left.png" alt="Genna's self-portrait" />
      <img className="portrait__layer" src="/assets/v8/avatar-right.png" alt="" style={{ opacity: !blinking && lookRight && !hover ? 1 : 0 }} />
      <img className="portrait__layer" src="/assets/v8/avatar-blink.png" alt="" style={{ opacity: blinking ? 1 : 0 }} />
      <span
        className="portrait__oi"
        data-dark="1"
        style={{
          opacity: hover ? 1 : 0,
          transform: hover || !motion ? 'rotate(4deg)' : 'translateY(4px) rotate(4deg)',
        }}
      >
        {GREETINGS[greeting]}
      </span>
      <span className="portrait__hint" aria-hidden="true" style={{ opacity: played || hover ? 0 : 1 }}>
        {touch ? 'click me!' : 'hover me!'}
      </span>
    </div>
  );
}

export default function Sidebar({ active, onNav, lookRight }) {
  const { motion } = useEnv();
  const [navHover, setNavHover] = useState(null);
  const lit = navHover ?? active;

  // The sparkle sits just past the end of the lit link, so measure each link's width.
  const links = useRef([]);
  const [widths, setWidths] = useState(null);
  const measure = useCallback(() => {
    const w = links.current.map((a) => (a ? a.offsetWidth : 0));
    setWidths((prev) => (prev && prev.every((v, i) => v === w[i]) ? prev : w));
  }, []);
  useLayoutEffect(() => {
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <aside className="sidebar">
      <Portrait lookRight={lookRight} />
      <div className="sidebar__name">Genna Gonzaga</div>
      <p className="sidebar__school">CS &amp; Visual Arts @ Columbia ’27</p>
      <p className="sidebar__bio" data-text="1">
        I’m a product designer, engineer, and artist. Drawing taught me to see everything as simple shapes, so I break complicated software down until it feels obvious.
      </p>
      <p className="sidebar__now">
        <PulseDot />
        <span>Designing + Building @ Richemont</span>
      </p>

      <nav className="sidebar__nav" aria-label="Portfolio">
        <span
          className="sidebar__sparkle"
          aria-hidden="true"
          style={{
            opacity: widths ? 1 : 0,
            transform: widths ? `translate(${widths[lit] + 8}px, ${lit * 36 + 8}px)` : 'none',
            transition: motion && widths ? 'transform 250ms cubic-bezier(.2,.8,.3,1)' : 'none',
          }}
        >
          <img
            key={lit}
            src="/assets/v7/sparkle.png"
            alt=""
            style={{ animation: motion ? 'ggTwinkle 320ms ease-out 230ms both' : 'none' }}
          />
        </span>
        {NAV.map((label, i) => (
          <a
            key={label}
            ref={(el) => { links.current[i] = el; }}
            href={NAV_PATHS[i]}
            className="sidebar__link"
            style={{ color: i === lit ? '#b21f86' : '#1f1a1d' }}
            aria-current={i === active ? 'page' : 'false'}
            onClick={(e) => onNav(i, e)}
            onMouseEnter={() => setNavHover(i)}
            onMouseLeave={() => setNavHover(null)}
            onFocus={() => setNavHover(i)}
            onBlur={() => setNavHover(null)}
          >
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar__contact">
        <p className="eyebrow">Contact</p>
        <ContactLinks />
      </div>
    </aside>
  );
}
