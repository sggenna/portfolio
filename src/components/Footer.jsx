import { useCallback, useEffect, useRef, useState } from 'react';
import { STATUS } from '../data.js';
import { useEnv } from '../hooks/useEnv.js';
import { ContactLinks } from './Sidebar.jsx';

const NY = 'America/New_York';
const BR = 'America/Sao_Paulo';

function tzMin(zone, t) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date(t));
  const get = (k) => +(parts.find((x) => x.type === k) || {}).value || 0;
  return (get('hour') % 24) * 60 + get('minute');
}
const wrap = (v) => ((Math.round(v) % 1440) + 1440) % 1440;
// Each hour range has several lines: start somewhere different every visit, then move to the next one each minute.
const seed = Math.floor(Math.random() * 1000);
const statusFor = (min) => {
  const lines = STATUS.find(([end]) => Math.floor(min / 60) < end)[1];
  return lines[(seed + Math.floor(Date.now() / 60000)) % lines.length];
};
function fmt(min) {
  min = wrap(min);
  const hr = Math.floor(min / 60);
  return `${(hr % 12) || 12}:${String(min % 60).padStart(2, '0')} ${hr < 12 ? 'am' : 'pm'}`;
}

// "It's 3:14 pm in New York and 4:14 pm in Brasília." with a slider to scrub through the day.
export default function Footer() {
  const { motion, narrow, mainRef } = useEnv();
  const [now, setNow] = useState(() => Date.now());
  const [scrub, setScrubState] = useState(null);
  const [dir, setDir] = useState(0);
  const [hint, setHint] = useState(false);
  const [shown, setShown] = useState('');
  const [statusOp, setStatusOp] = useState(1);
  const [drawn, setDrawn] = useState(!motion);

  const track = useRef(null);
  const foot = useRef(null);
  const scrubRef = useRef(null);
  const dragging = useRef(false);
  const touch = useRef(false);
  const timers = useRef({});
  const raf = useRef(0);
  const fading = useRef(null);

  const setScrub = (v) => { scrubRef.current = v; setScrubState(v); };
  const nyNow = () => tzMin(NY, Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf.current);
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  // Draw the flourish in the first time the footer is on screen.
  useEffect(() => {
    if (drawn) return;
    if (typeof IntersectionObserver === 'undefined') { setDrawn(true); return; }
    const io = new IntersectionObserver(
      (es) => { if (es.some((e) => e.isIntersecting)) { setDrawn(true); io.disconnect(); } },
      { root: narrow ? null : mainRef.current, threshold: 0.2 }
    );
    io.observe(foot.current);
    return () => io.disconnect();
  }, [drawn, narrow, mainRef]);

  const trackMin = (e) => {
    const el = track.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    return Math.min(1425, Math.round((f * 1440) / 15) * 15);
  };

  // Ease back to the real time.
  const release = useCallback(() => {
    clearTimeout(timers.current.touch);
    timers.current.touch = null;
    const from = scrubRef.current;
    if (from == null) return;
    dragging.current = false;
    setDir(0);
    setHint(true);
    clearTimeout(timers.current.hint);
    timers.current.hint = setTimeout(() => setHint(false), 1600);
    if (!motion) { setScrub(null); return; }
    const to = nyNow();
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 300);
      if (k >= 1) { setScrub(null); return; }
      setScrub(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [motion]);

  const onDown = (e) => {
    const v = trackMin(e);
    if (v == null) return;
    cancelAnimationFrame(raf.current);
    clearTimeout(timers.current.touch);
    timers.current.touch = null;
    clearTimeout(timers.current.hint);
    touch.current = e.pointerType === 'touch';
    if (touch.current) { setScrub((Math.round(v / 60) * 60) % 1440); dragging.current = false; setDir(0); return; }
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
    setScrub(v);
    dragging.current = true;
    setDir(0);
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    const v = trackMin(e);
    if (v == null || v === scrubRef.current) return;
    setDir(v > scrubRef.current ? 1 : -1);
    setScrub(v);
  };
  const onUp = () => {
    if (touch.current) { touch.current = false; timers.current.touch = setTimeout(release, 2000); return; }
    if (dragging.current) release();
  };
  const onKey = (e) => {
    const steps = { ArrowRight: 15, ArrowUp: 15, ArrowLeft: -15, ArrowDown: -15, PageUp: 60, PageDown: -60 };
    const cur = scrubRef.current != null ? scrubRef.current : Math.round(nyNow() / 15) * 15;
    let v = null;
    if (e.key in steps) v = cur + steps[e.key] * (e.shiftKey ? 4 : 1);
    else if (e.key === 'Home') v = 0;
    else if (e.key === 'End') v = 1425;
    else if (e.key === 'Escape' && scrubRef.current != null) { e.preventDefault(); e.stopPropagation(); release(); return; }
    if (v == null) return;
    e.preventDefault();
    cancelAnimationFrame(raf.current);
    clearTimeout(timers.current.key);
    v = Math.min(1425, Math.max(0, v));
    dragging.current = false;
    setDir(v > cur ? 1 : -1);
    setScrub(v);
    timers.current.key = setTimeout(() => setDir(0), 300);
  };
  const onBlur = () => { if (scrubRef.current != null && !dragging.current && !timers.current.touch) release(); };

  const nyR = tzMin(NY, now);
  const diff = (((tzMin(BR, now) - nyR) % 1440) + 1440) % 1440;
  const scrubbing = scrub != null;
  const nyM = wrap(scrubbing ? scrub : nyR);
  const brM = wrap(nyM + diff);
  const nyT = fmt(nyM);
  const brT = fmt(brM);
  const want = statusFor(nyM);
  const nyMRef = useRef(nyM);
  nyMRef.current = nyM;

  // Cross-fade the status line when it changes.
  useEffect(() => {
    if (want === shown || fading.current === want) return;
    if (!motion || !shown) { fading.current = null; setShown(want); setStatusOp(1); return; }
    fading.current = want;
    setStatusOp(0);
    clearTimeout(timers.current.status);
    timers.current.status = setTimeout(() => {
      fading.current = null;
      setShown(statusFor(nyMRef.current));
      setStatusOp(1);
    }, 120);
  }, [want, shown, motion]);

  const starRot = motion && dir ? `rotate(${dir * 15}deg)` : 'none';
  const starTr = motion ? 'transform 300ms ease-out' : 'none';
  const ticks = [
    ['0', '12am'], ['25%', '6am'], ['50%', '12pm'], ['75%', '6pm'], ['100%', '12am'],
  ];

  return (
    <footer ref={foot} className="footer">
      <img
        className="footer__flourish"
        src="/assets/v7/flourish.png"
        alt=""
        style={{
          width: narrow ? 120 : 150,
          clipPath: drawn ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
          transition: motion ? 'clip-path 900ms cubic-bezier(.4,0,.2,1)' : 'none',
        }}
      />
      <p className="footer__lead" aria-live="polite">
        {scrubbing ? 'At ' : "It's "}
        <span className="footer__time">{nyT}</span>
        {scrubbing ? ' in New York, it’s ' : ' in New York and '}
        <span className="footer__time">{brT}</span>
        {' in Brasília. '}
        <span className="footer__status" style={{ opacity: statusOp, transition: motion ? 'opacity 120ms ease-out' : 'none' }}>
          {shown || want}
        </span>
      </p>

      <div className="footer__scrub">
        <img src="/assets/v7/swirl-l.png" alt="" />
        <div
          ref={track}
          className="track"
          tabIndex={0}
          role="slider"
          aria-label="Time of day in New York. Use arrow keys to move through the day."
          aria-valuemin={0}
          aria-valuemax={1425}
          aria-valuenow={nyM}
          aria-valuetext={`${nyT} in New York, ${brT} in Brasília. ${want}`}
          onKeyDown={onKey}
          onBlur={onBlur}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div className="track__line" />
          <div className="track__ticks">
            {ticks.map(([left]) => <span key={left} style={left === '100%' ? { right: 0 } : { left }} />)}
          </div>
          <div className="track__pin track__pin--ny" style={{ left: `${(nyM / 1440) * 100}%` }}>
            <span className="track__code">NY</span>
            <img src="/assets/v7/star.png" alt="" style={{ transform: starRot, transition: starTr }} />
          </div>
          <div className="track__pin track__pin--br" style={{ left: `${(brM / 1440) * 100}%` }}>
            <img src="/assets/v7/star.png" alt="" style={{ transform: starRot, transition: starTr }} />
            <span className="track__code">BR</span>
          </div>
          <div className="track__labels">
            {ticks.map(([left, label], i) => (
              <span
                key={left}
                style={{
                  left: i === 4 ? 'auto' : left,
                  right: i === 4 ? 0 : 'auto',
                  transform: i === 0 || i === 4 ? 'none' : 'translateX(-50%)',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <img src="/assets/v7/swirl-r.png" alt="" />
      </div>

      <div className="footer__meta">
        <span>All illustrations drawn by me.</span>
        <span>{hint ? 'Back to right now' : narrow ? 'Tap or drag to see my day' : 'Drag or use arrow keys to see my day'}</span>
      </div>

      {narrow && (
        <div className="footer__contact">
          <p className="eyebrow">Contact</p>
          <div>
            <ContactLinks onResume={(e) => e.preventDefault()} />
          </div>
        </div>
      )}
    </footer>
  );
}
