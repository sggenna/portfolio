// Phone cut of tag-to-drill.jsx: the same story and timing, on the app's real phone layouts.
// Only one window fits, so the camera slides from Jamile to Bruno as the tag flies across.
const MOTION = { enter: Easing.easeOutCubic, move: Easing.easeInOutCubic, pop: Easing.easeOutBack };
const F = "'Satoshi', 'Inter', Helvetica, Arial, sans-serif";
const L = (a, b, p) => a + (b - a) * p;
const VIEW = { w: 430, h: 770 }, LIVE = { w: 390, h: 690 }, STEP = 430, WX = [20, 20 + STEP], WY = 56;
const BAR_LEFT = 4;
const PHRASE = 'She work in a hospital', NOTE = 'He/she + verbo com -s: she works';
const NEWREC = { id: 'pr-new', t: 'She works · present simple', k: 'Gramática', min: 5, ic: 'sparkles', why: 'Da marcação da Prof. Jamile em “My daily routine”.' };
const pulse = (T, t0) => clamp(1 - Math.abs(T - t0) / 0.12, 0, 1);
const A = (s) => Object.assign({ position: 'absolute' }, s);

function rel(root, r) { const R = root.getBoundingClientRect(), k = R.width / LIVE.w || 1; return { x: (r.left - R.left) / k, y: (r.top - R.top) / k, w: r.width / k, h: r.height / k }; }
function phraseRange(root, app, n) {
  const txt = app && app.CORR && app.CORR[0].text; if (!txt) return null;
  const s = txt.indexOf(PHRASE); if (s < 0) return null;
  const seg = [...root.querySelectorAll('[data-off]')].find((x) => { const o = +x.dataset.off; return o <= s && s < o + x.textContent.length; });
  if (!seg) return null;
  const tn = document.createTreeWalker(seg, NodeFilter.SHOW_TEXT).nextNode(); if (!tn) return null;
  const o = +seg.dataset.off, r = document.createRange();
  try { r.setStart(tn, s - o); r.setEnd(tn, Math.min(tn.length, s - o + Math.max(1, n))); } catch (e) { return null; }
  return r;
}
const byText = (root, sel, t) => [...root.querySelectorAll(sel)].find((b) => b.textContent.trim() === t);
function center(root, el, fx = 0.5, fy = 0.5) { if (!root || !el) return null; const q = rel(root, el.getBoundingClientRect()); return [q.x + q.w * fx, q.y + q.h * fy]; }

// The phone layouts stack everything, so the app has to scroll to keep the action in the window.
function scroller(root, el) {
  let n = el && el.parentElement;
  while (n && n !== root) { const o = getComputedStyle(n).overflowY; if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight + 1) return n; n = n.parentElement; }
  return root.scrollHeight > root.clientHeight + 1 ? root : null;
}
function scrollFor(root, el, at = 0.42) {
  const sc = scroller(root, el); if (!sc) return null;
  const a = el.getBoundingClientRect(), b = sc.getBoundingClientRect();
  return { sc, top: clamp(sc.scrollTop + (a.top - b.top) - b.height * at, 0, sc.scrollHeight - sc.clientHeight) };
}

function useTrack(T, keys, mem) {
  let i = keys.length - 2; while (i > 0 && T < keys[i][0]) i--;
  const pts = []; keys.forEach((kk, j) => { const v = kk[1](); if (v) mem[j] = v; pts[j] = mem[j] || pts[j - 1] || [200, 400]; });
  if (T <= keys[0][0]) return pts[0];
  if (T >= keys[keys.length - 1][0]) return pts[keys.length - 1];
  const a = pts[i], b = pts[i + 1], p = MOTION.move(clamp((T - keys[i][0]) / (keys[i + 1][0] - keys[i][0]), 0, 1));
  return [L(a[0], b[0], p), L(a[1], b[1], p)];
}

function Cursor({ p, op, press }) {
  return (
    <div style={A({ left: p[0] - 2, top: p[1] - 1, opacity: op, transform: `scale(${1 - 0.15 * press})`, transformOrigin: '2px 1px', filter: 'drop-shadow(0 2px 4px rgba(34,20,25,.25))', zIndex: 50, pointerEvents: 'none' })}>
      <svg width="20" height="28" viewBox="0 0 20 28"><path d="M1 1 L1 22 L6.5 16.8 L10.2 25.5 L13.8 24 L10.2 15.4 L17.5 15.4 Z" fill="#221419" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    </div>
  );
}

function Win({ i, label, appear, liveRef, children, overlay }) {
  return (
    <div style={A({ left: WX[i], top: WY - 36, opacity: appear, transform: `translateY(${(1 - appear) * 24}px)` })}>
      <div style={{ height: 36, font: `500 15px ${F}`, color: 'rgba(34,20,25,.72)' }}>{label}</div>
      <div style={{ position: 'relative', width: LIVE.w, height: LIVE.h, borderRadius: 16, overflow: 'hidden', background: '#F5F4F4', boxShadow: '0 12px 32px rgba(34,20,25,.12), 0 0 0 1px rgba(34,20,25,.08)' }}>
        <div ref={liveRef} style={A({ left: 0, top: 0, width: LIVE.w, height: LIVE.h, overflow: 'hidden', '--bl-vh': LIVE.h + 'px', pointerEvents: 'none' })}>
          {children}
        </div>
        {/* Outside the scrolling app: these positions are measured on screen, so they mustn't scroll too. */}
        <div style={A({ left: 0, top: 0, width: LIVE.w, height: LIVE.h, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 })}>{overlay}</div>
      </div>
    </div>
  );
}

function Piece({ children }) {
  const { T, CUES: C, authoredTotal: END } = useComposition();
  const k = (a, b) => clamp((T - a) / (b - a), 0, 1);
  const S = C.Select, G = C.Tag, D = C.Send, R = C.Drill, H = C.Hold;
  const tRef = React.useRef(null), sRef = React.useRef(null), memT = React.useRef({}).current, memS = React.useRef({}).current, applied = React.useRef({});
  const [, force] = React.useState(0);
  const kids = React.Children.toArray(children);
  const apps = window.__blApps || {}, ta = apps.t, sa = apps.s;
  React.useEffect(() => { if (!ta || !sa) { const id = setTimeout(() => force((n) => n + 1), 200); return () => clearTimeout(id); } });

  const tr = tRef.current, sr = sRef.current;
  const nSel = Math.round(PHRASE.length * MOTION.move(k(S + 0.8, S + 1.5)));
  const selRects = (() => { if (!tr || !ta || T < S + 0.8 || T >= G + 0.7) return []; const r = phraseRange(tr, ta, nSel); return r ? [...r.getClientRects()].map((q) => rel(tr, q)) : []; })();

  React.useEffect(() => {
    if (ta && tr) {
      const txt = ta.CORR[0].text, s0 = txt.indexOf('a coffee'), s1 = txt.indexOf(PHRASE);
      const v1 = { id: 'v1', s: s0, e: s0 + 8, tag: 'Vocabulário', note: 'Coffee aqui é incontável: drink coffee' };
      const phase = T < S + 1.6 ? 0 : T < G + 0.7 ? 1 : T < D + 0.1 ? 2 : 3;
      const note = NOTE.slice(0, Math.floor(NOTE.length * k(G + 1.4, G + 2.1) + 0.001));
      const key = phase + '|' + (phase === 2 ? note : '') + '|' + (T >= D + 0.1 && T < R + 0.4);
      if (applied.current.t !== key) {
        applied.current.t = key;
        let pend = null;
        if (phase === 1) { const r = phraseRange(tr, ta, PHRASE.length), box = ta._essayBox; if (r && box) { const q = r.getClientRects()[0], w = box.getBoundingClientRect(), R = tr.getBoundingClientRect(), kk = R.width / LIVE.w; pend = { k: 0, s: s1, e: s1 + PHRASE.length, x: Math.round(BAR_LEFT - (w.left - R.left) / kk), y: Math.round((q.top - w.top) / kk) }; } } // The tag bar is nearly as wide as the phone, so it starts at the window's edge, not at the phrase.
        const g1 = { id: 'g1', s: s1, e: s1 + PHRASE.length, tag: 'Gramática', note: phase === 2 ? note : NOTE };
        ta.setState({ corrOpen: true, cg: 0, corr: phase === 3 ? 1 : 0, corrDone: phase === 3 ? [0] : [], pend, noteFocus: false, fbMenu: false,
          marks: { 0: phase >= 2 ? [v1, g1] : [v1] }, am: phase === 2 ? 'g1' : null, amFor: 0,
          toasts: T >= D + 0.1 && T < R + 0.4 ? [{ id: 901, msg: 'Nota 16/20 enviada para Bruno · 2 exercício(s) no Praticar', ic: 'check', undo: true }] : [] });
      }
      // Essay first, then the note she writes, then down to the send button.
      if (T < D + 0.1) {
        const seg = phraseRange(tr, ta, 1), mark = seg && seg.startContainer.parentElement;
        const note = tr.querySelector('input[placeholder="Adicionar nota…"]');
        const send = byText(tr, 'button', 'Enviar correção');
        const a = mark && scrollFor(tr, mark, 0.3), b = note && scrollFor(tr, note, 0.4), c = send && scrollFor(tr, send, 0.7);
        const fromTo = T < G + 0.7 ? [a, a, 0] : T < G + 2.1 ? [a, b || a, MOTION.move(k(G + 0.7, G + 1.3))] : [b || a, c || b || a, MOTION.move(k(G + 2.1, D - 0.2))];
        if (fromTo[0] && fromTo[1]) fromTo[0].sc.scrollTop = L(fromTo[0].top, fromTo[1].top, fromTo[2]);
      }
    }
    if (sa) {
      const on = T >= D + 0.9, hi = on && T < R + 1.4, toast = T >= R + 0.7;
      const key = on + '|' + hi + '|' + toast;
      if (applied.current.s !== key) { applied.current.s = key; sa.setState({ prNew: on ? NEWREC : null, prHi: hi ? 'pr-new' : null, toasts: toast ? [{ id: 902, msg: 'Abrindo ' + NEWREC.t, ic: 'sparkles', undo: false }] : [] }); }
      if (sr) { const el = sr.querySelector('#pr-new') || sr.querySelector('#pr-since'), q = el && scrollFor(sr, el, 0.3); if (q) q.sc.scrollTop = q.top; }
    }
  });

  const tp = useTrack(T, [
    [0.6, () => [300, 560]], [S + 0.05, () => [300, 560]],
    [S + 0.7, () => { const r = tr && phraseRange(tr, ta, 1); return r && center(tr, { getBoundingClientRect: () => r.getBoundingClientRect() }, 0, 0.6); }],
    [S + 0.8, () => memT[2]],
    [S + 1.5, () => { const r = tr && phraseRange(tr, ta, PHRASE.length); if (!r) return null; const q = [...r.getClientRects()].pop(); return center(tr, { getBoundingClientRect: () => q }, 1, 0.6); }],
    [G + 0.1, () => memT[4]],
    [G + 0.55, () => tr && center(tr, (() => { const b = tr.querySelector('[data-bar]'); return b && byText(b, 'button', 'Gramática'); })())],
    [G + 0.85, () => memT[6]],
    [G + 1.3, () => tr && center(tr, tr.querySelector('input[placeholder="Adicionar nota…"]'), 0.2)],
    [G + 2.1, () => memT[8]],
    [D - 0.05, () => tr && center(tr, byText(tr, 'button', 'Enviar correção'))],
    [D + 0.3, () => memT[10]],
  ], memT);
  const tOp = MOTION.enter(k(0.6, 0.9)) * (1 - MOTION.enter(k(D + 0.2, D + 0.5)));
  const tPress = Math.max(T > S + 0.8 && T < S + 1.5 ? 1 : 0, pulse(T, G + 0.7), pulse(T, G + 1.35), pulse(T, D + 0.05));

  const card = () => sr && center(sr, sr.querySelector('#pr-new') || sr.querySelector('#pr-since'), 0.3, 0.4);
  const sp = useTrack(T, [[R - 0.2, () => [300, 600]], [R + 0.5, card], [R + 0.8, () => memS[1]], [R + 1.6, () => memS[1] && [memS[1][0] + 20, memS[1][1] + 24]]], memS);
  const sOp = MOTION.enter(k(R - 0.2, R + 0.1)) * (1 - MOTION.enter(k(H + 0.4, H + 0.8)));
  const sPress = pulse(T, R + 0.6);

  const g = (i, p) => (p ? [WX[i] + p[0], WY + p[1]] : null);
  const from = g(0, memT[10]) || [220, 600], to = g(1, card()) || [STEP + 220, 300];
  const f = k(D + 0.15, D + 0.95), fm = MOTION.move(f);
  const fx = L(from[0], to[0], fm), fy = L(from[1], to[1], fm) - Math.sin(Math.PI * f) * 90;
  const fOp = f > 0 && f < 1 ? Math.min(1, f * 8, (1 - f) * 6) : 0;

  const camX = STEP * fm;
  const fade = 1 - k(END - 0.4, END), appear = MOTION.enter(k(0, 0.7));

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: F, opacity: fade, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: VIEW.w * 2, height: VIEW.h, transform: `translateX(${-camX}px)` }}>
        <Win i={0} label="Professora Jamile · Correções" appear={appear} liveRef={tRef}
          overlay={<>
            {selRects.map((q, j) => <div key={j} style={A({ left: q.x, top: q.y, width: q.w, height: q.h, background: 'rgba(120,20,68,.18)', zIndex: 4 })} />)}
            <Cursor p={tp} op={tOp} press={tPress} />
          </>}>{kids[0]}</Win>
        <Win i={1} label="Aluno Bruno · Praticar" appear={appear} liveRef={sRef}
          overlay={<Cursor p={sp} op={sOp} press={sPress} />}>{kids[1]}</Win>
        <div style={A({ left: fx, top: fy, opacity: fOp, transform: `translate(-50%,-50%) scale(${1 + 0.15 * Math.sin(Math.PI * f)}) rotate(${-4 * Math.sin(Math.PI * f)}deg)`, height: 32, padding: '0 12px', borderRadius: 8, background: '#221419', boxShadow: '0 12px 28px rgba(34,20,25,.28)', display: 'flex', alignItems: 'center', gap: 8, color: '#FBF8F7', font: `500 14px ${F}`, whiteSpace: 'nowrap', zIndex: 60 })}>
          <span style={{ width: 7, height: 8, borderRadius: 4, background: '#EBCBD4' }} />Gramática · she works
        </div>
      </div>
    </div>
  );
}

class Catch extends React.Component { constructor(p) { super(p); this.state = { e: null }; } static getDerivedStateFromError(e) { return { e }; } componentDidCatch(e) { console.warn('[tag-to-drill-phone]', e && e.message); } render() { return this.state.e ? null : this.props.children; } }

function TagToDrillPhone({ children }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <CompositionStage width={VIEW.w} height={VIEW.h} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="transparent">
        <Catch><Piece>{children}</Piece></Catch>
      </CompositionStage>
    </div>
  );
}
window.TagToDrillPhone = TagToDrillPhone;
