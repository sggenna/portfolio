import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useEnv } from '../hooks/useEnv.js';

// One mistake traveling through the platform, drawn live so it stays sharp at any size.
// The scene is authored on a 1600×900 stage and scaled to fit its figure.
const STAGE_W = 1600;
const STAGE_H = 900;
const TOTAL = 14.2;
const CUES = { Corrections: 0, Practice: 3.2, Progress: 6.2, Profile: 8.8, Today: 11.2 };
// With reduced motion, hold the moment when every step has lit up, just before the fade out.
const STILL = 13.7;
// The wide scene's empty space above the timeline, cropped so it sits close to the text above it.
const WIDE_CROP_TOP = 220;
// Below this width the wide stage's text gets too small to read, so the camera zooms in and
// follows the mistake from card to card instead. Sizes below are in stage units.
const COMPACT_BELOW = 720;
const COMPACT_VIEW_W = 330; // how much of the stage fits across a phone
const COMPACT_MAX_ZOOM = 1.35;
const COMPACT_TOP = 250; // the stage's y that sits at the top of the window
const COMPACT_H = 436;
const STACK_GAP = 16, STACK_PAD = 20;
const STACK_H = STACK_PAD * 2 + 5 * 270 + 4 * STACK_GAP;

const MJ = { P: '#781444', INK: '#221419', MUTED: '#6B5860', LINE: '#E3D8D2', OK: '#2F6337', OKBG: '#E3EFE4', TINT: '#F6E3EC', FONT: "'EnDash', 'Satoshi', 'Inter', Helvetica, Arial, sans-serif" };
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, p) => a + (b - a) * p;
const easeOutCubic = (t) => (t - 1) ** 3 + 1;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);
const easeOutBack = (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
const MOTION = { enter: easeOutCubic, move: easeInOutCubic, pop: easeOutBack };

const STEPS = [
  ['Corrections', 'Corrections', 'Teacher'], ['Practice', 'Practice', 'Student'], ['Progress', 'Progress', 'Student'],
  ['Profile', 'Student: Bruno', 'Teacher'], ['Today', 'Today', 'Teacher'],
];
const CW = 228, CH = 270, X0 = 146, STEP = 270, TOP = 360, LY = 300;
const cx = (i) => X0 + i * STEP + CW / 2;

const Clock = createContext(0);
const useK = () => {
  const T = useContext(Clock);
  return (a, b) => clamp((T - a) / (b - a), 0, 1);
};

function Chip({ children, bg, col, style }) {
  return <span style={{ boxSizing: 'content-box', display: 'inline-flex', alignItems: 'center', height: 30, padding: '0 12px', borderRadius: 8, background: bg, color: col, font: `600 14px ${MJ.FONT}`, whiteSpace: 'nowrap', ...style }}>{children}</span>;
}

function CorrectionsBody({ c }) {
  const k = useK(), hl = MOTION.move(k(c + 0.9, c + 1.6)), tag = MOTION.pop(k(c + 1.9, c + 2.3));
  const line = (t, on) => (
    <div style={{ position: 'relative', font: `${on ? 600 : 400} 16px/1.3 ${MJ.FONT}`, color: on ? MJ.INK : '#9A8A90', padding: '4px 6px' }}>
      {on && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${hl * 100}%`, background: MJ.TINT, borderBottom: `2px solid ${MJ.P}`, borderRadius: 4 }} />}
      <span style={{ position: 'relative' }}>{t}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {line('I wake up at 6:30.')}{line('She work in a hospital.', true)}{line('I take the bus.')}
      <div style={{ marginTop: 14, transform: `scale(${tag})`, transformOrigin: 'left center', opacity: Math.min(1, tag) }}>
        <Chip bg={MJ.P} col="#F4F0EC">Grammar · she works</Chip>
      </div>
    </div>
  );
}

function PracticeBody({ c }) {
  const k = useK(), pick = MOTION.pop(k(c + 1.2, c + 1.55)), fill = MOTION.enter(k(c + 1.5, c + 1.9)), ok = MOTION.enter(k(c + 1.9, c + 2.3));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ font: `700 13px ${MJ.FONT}`, color: MJ.P }}>From Prof. Jamile</div>
      <div style={{ font: `600 18px/1.35 ${MJ.FONT}`, color: MJ.INK }}>
        She <span style={{ display: 'inline-block', minWidth: 62, borderBottom: `2px solid ${fill > 0 ? MJ.OK : MJ.LINE}`, textAlign: 'center', color: MJ.OK, opacity: fill }}>works</span> in a hospital.
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Chip bg="#FFFFFF" col={MJ.MUTED} style={{ border: `1px solid ${MJ.LINE}` }}>work</Chip>
        <Chip bg={pick > 0.05 ? MJ.OK : '#FFFFFF'} col={pick > 0.05 ? '#FFFFFF' : MJ.MUTED} style={{ border: `1px solid ${pick > 0.05 ? MJ.OK : MJ.LINE}`, transform: `scale(${1 + 0.08 * Math.sin(Math.PI * clamp(pick, 0, 1))})` }}>works</Chip>
      </div>
      <div style={{ font: `700 14px ${MJ.FONT}`, color: MJ.OK, opacity: ok, transform: `translateY(${(1 - ok) * 6}px)` }}>Correct · +5 XP</div>
    </div>
  );
}

function ProgressBody({ c }) {
  const k = useK(), p = MOTION.move(k(c + 0.6, c + 1.8)), pct = Math.round(lerp(48, 74, p)), xp = MOTION.pop(k(c + 1.6, c + 2.0));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ font: `600 16px ${MJ.FONT}`, color: MJ.INK }}>Present simple</span>
        <span style={{ font: `700 16px ${MJ.FONT}`, color: MJ.P, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
      </div>
      <div style={{ height: 10, borderRadius: 6, background: '#EFE7E2', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: MJ.P, borderRadius: 6 }} />
      </div>
      <div style={{ marginTop: 10, transform: `scale(${xp})`, transformOrigin: 'left center', opacity: Math.min(1, xp) }}>
        <Chip bg={MJ.TINT} col={MJ.P}>+5 XP</Chip>
      </div>
    </div>
  );
}

function ProfileBody({ c }) {
  const k = useK(), sw = MOTION.move(k(c + 0.9, c + 1.4));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: MJ.TINT, color: MJ.P, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 14px ${MJ.FONT}` }}>BL</div>
        <div><div style={{ font: `700 16px ${MJ.FONT}`, color: MJ.INK }}>Bruno Lima</div><div style={{ font: `400 13px ${MJ.FONT}`, color: MJ.MUTED }}>B1 Evening</div></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ font: `600 15px ${MJ.FONT}`, color: MJ.INK }}>she works</span>
        <span style={{ position: 'relative', width: 96, height: 30 }}>
          <Chip bg="#EFE7E2" col={MJ.MUTED} style={{ position: 'absolute', right: 0, opacity: 1 - sw }}>Tagged</Chip>
          <Chip bg={MJ.OKBG} col={MJ.OK} style={{ position: 'absolute', right: 0, opacity: sw, transform: `scale(${0.9 + 0.1 * sw})` }}>Practiced</Chip>
        </span>
      </div>
    </div>
  );
}

function TodayBody({ c }) {
  const k = useK(), flash = k(c + 0.7, c + 1.0), out = MOTION.move(k(c + 1.1, c + 1.7));
  const row = (n, s) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, overflow: 'hidden', ...s }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B5471A', flex: 'none' }} />
      <span style={{ font: `600 15px ${MJ.FONT}`, color: MJ.INK }}>{n}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ font: `700 12px ${MJ.FONT}`, letterSpacing: '.1em', color: MJ.MUTED, marginBottom: 6 }}>NEEDS ATTENTION</div>
      {row('Bruno Lima', { height: 40 * (1 - out), opacity: 1 - out, background: `rgba(227,239,228,${flash * (1 - out)})`, borderRadius: 8, padding: '0 8px', margin: '0 -8px' })}
      {row('Diego Alves')}
      {row('Karina Luz')}
    </div>
  );
}

const BODIES = [CorrectionsBody, PracticeBody, ProgressBody, ProfileBody, TodayBody];

function Card({ i, left = X0 + i * STEP, top = TOP }) {
  const k = useK();
  const c = CUES[STEPS[i][0]], next = i < 4 ? CUES[STEPS[i + 1][0]] : TOTAL + 1;
  const appear = MOTION.enter(k(i * 0.06, 0.4 + i * 0.06));
  const lit = MOTION.enter(k(c - 0.1, c + 0.4)), active = lit * (1 - MOTION.move(k(next, next + 0.5)));
  const enter = MOTION.enter(k(c, c + 0.35));
  const Body = BODIES[i];
  return (
    <div style={{ position: 'absolute', left, top, width: CW, height: CH, opacity: appear, transform: `translateY(${(1 - appear) * 24 - active * 10}px) scale(${1 + active * 0.04})`, transformOrigin: 'center top' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', borderRadius: 18, border: `1.5px solid ${lit > 0.5 ? MJ.P : MJ.LINE}`, boxShadow: `0 ${14 * active}px ${36 * active}px rgba(120,20,68,${0.14 * active})` }} />
      <div style={{ position: 'relative', padding: 22, display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: 0.45 + 0.55 * lit }}>
          <div style={{ font: `700 12px ${MJ.FONT}`, letterSpacing: '.12em', color: MJ.MUTED }}>{STEPS[i][2].toUpperCase()}</div>
          <div style={{ font: `800 24px/1.1 ${MJ.FONT}`, letterSpacing: '-.02em', color: lit > 0.5 ? MJ.P : MJ.INK }}>{STEPS[i][1]}</div>
        </div>
        <div style={{ opacity: enter, transform: `translateY(${(1 - enter) * 8}px)` }}><Body c={c} /></div>
      </div>
    </div>
  );
}

// Reduced motion on a phone: there's no camera to follow, so show every step at once.
function Stack({ viewW }) {
  return STEPS.map((s, i) => <Card key={s[0]} i={i} left={(viewW - CW) / 2} top={STACK_PAD + i * (CH + STACK_GAP)} />);
}

function Journey({ viewW }) {
  const T = useContext(Clock), k = useK();
  let tokX = cx(0);
  for (let i = 1; i < 5; i++) {
    const c = CUES[STEPS[i][0]];
    if (T >= c) tokX = lerp(cx(i - 1), cx(i), MOTION.move(k(c, c + 0.7)));
  }
  const tokOp = MOTION.enter(k(0.2, 0.5));
  const camX = (800 - tokX) * 0.08, camS = 1 + 0.02 * k(0, TOTAL);
  const fade = 1 - k(TOTAL - 0.45, TOTAL);
  const lineIn = MOTION.move(k(0, 0.5));
  const camera = viewW
    ? `translate(${viewW / 2 - tokX}px, ${-COMPACT_TOP}px)`
    : `translateX(${camX}px) scale(${camS})`;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: fade }}>
      <div style={{ position: 'absolute', inset: 0, transform: camera, transformOrigin: viewW ? '0 0' : '800px 470px' }}>
        <div style={{ position: 'absolute', left: cx(0), top: LY - 1, width: (cx(4) - cx(0)) * lineIn, height: 2, background: MJ.LINE }} />
        <div style={{ position: 'absolute', left: cx(0), top: LY - 1.5, width: Math.max(0, tokX - cx(0)) * tokOp, height: 3, background: MJ.P, borderRadius: 2 }} />
        {STEPS.map((s, i) => {
          const on = T >= CUES[s[0]] + 0.1 || (i === 0 && tokOp > 0.5);
          return <div key={s[0]} style={{ position: 'absolute', left: cx(i) - 9, top: LY - 9, width: 18, height: 18, borderRadius: '50%', background: on ? MJ.P : '#F7F5F2', border: `2px solid ${on ? MJ.P : MJ.LINE}`, opacity: lineIn }} />;
        })}
        <div style={{ position: 'absolute', left: tokX - 14, top: LY - 14, width: 28, height: 28, borderRadius: '50%', background: MJ.P, opacity: tokOp, boxShadow: `0 0 0 ${8 + 3 * Math.sin(T * 4)}px rgba(120,20,68,.14)` }} />
        {STEPS.map((s, i) => <Card key={s[0]} i={i} />)}
      </div>
      {viewW && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
          {STEPS.map((s) => <span key={s[0]} style={{ width: 8, height: 8, borderRadius: '50%', background: T >= CUES[s[0]] ? MJ.P : MJ.LINE }} />)}
        </div>
      )}
    </div>
  );
}

export default function MistakeJourney({ label }) {
  const { motion } = useEnv();
  const box = useRef(null);
  const [width, setWidth] = useState(0);
  const [T, setT] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Runs only while on screen, and picks up where it left off, like the videos do.
  useEffect(() => {
    const el = box.current;
    if (!el || !motion) return undefined;
    let id = 0, last = 0;
    const tick = (now) => {
      const dt = last ? Math.min(now - last, 100) / 1000 : 0;
      last = now;
      setT((t) => (t + dt) % TOTAL);
      id = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(id);
      last = 0;
      if (e.isIntersecting) id = requestAnimationFrame(tick);
    }, { threshold: 0.05 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(id); };
  }, [motion]);

  const compact = width > 0 && width < COMPACT_BELOW;
  const scale = compact ? Math.min(width / COMPACT_VIEW_W, COMPACT_MAX_ZOOM) : width / STAGE_W;
  const viewW = compact ? width / scale : undefined;
  const viewH = compact ? (motion ? COMPACT_H : STACK_H) : STAGE_H;

  return (
    <div ref={box} className="cs__live-frame" role="img" aria-label={label} style={{ ...(compact ? { height: viewH * scale } : { aspectRatio: `${STAGE_W} / ${STAGE_H - WIDE_CROP_TOP}` }) }}>
      {width > 0 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: viewW ?? STAGE_W, height: viewH, transform: compact ? `scale(${scale})` : `scale(${scale}) translateY(${-WIDE_CROP_TOP}px)`, transformOrigin: '0 0', fontFamily: MJ.FONT, letterSpacing: 'normal', lineHeight: 'normal', textAlign: 'left' }}>
          <Clock.Provider value={motion ? T : STILL}>
            {compact && !motion ? <Stack viewW={viewW} /> : <Journey viewW={viewW} />}
          </Clock.Provider>
        </div>
      )}
    </div>
  );
}
