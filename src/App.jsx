import { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS, casePath } from './data.js';
import { EnvContext, useMediaQuery, useMotion, useNarrow } from './hooks/useEnv.js';
import Sidebar from './components/Sidebar.jsx';
import MobileHeader from './components/MobileHeader.jsx';
import Work from './components/Work.jsx';
import About from './components/About.jsx';
import Play from './components/Play.jsx';
import Footer from './components/Footer.jsx';
import CaseStudy from './components/CaseStudy.jsx';

const keyFromPath = () => {
  const slug = window.location.pathname.match(/^\/work\/(.+?)\/?$/)?.[1];
  return PROJECTS.find((p) => p.slug === slug)?.key ?? null;
};
const pathFor = (key) => casePath(PROJECTS.find((p) => p.key === key));

// Case studies this visitor has opened, kept in their browser so "Up next" can suggest the rest first.
const SEEN_KEY = 'gg:seen-cases';
const readSeen = () => {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || []; } catch { return []; }
};

export default function App() {
  const narrow = useNarrow();
  const motion = useMotion();
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)') && !narrow;
  const mainRef = useRef(null);

  const [active, setActive] = useState(0);
  const [hover, setHover] = useState('');
  const [open, setOpen] = useState(keyFromPath);
  const [phase, setPhase] = useState(() => (keyFromPath() ? 'to' : 'idle')); // idle | from | to | back
  const [full, setFull] = useState(false);
  const closeTimer = useRef(0);
  const openRef = useRef(open);
  openRef.current = open;
  const [seen, setSeen] = useState(readSeen);

  const goTo = useCallback((i) => {
    setActive(i);
    if (mainRef.current) mainRef.current.scrollTop = 0;
    if (narrow) window.scrollTo(0, 0);
  }, [narrow]);

  const show = useCallback((key) => {
    clearTimeout(closeTimer.current);
    setHover('');
    setFull(false);
    setOpen(key);
    if (!motion) { setPhase('to'); return; }
    setPhase('from');
    requestAnimationFrame(() => requestAnimationFrame(() => setPhase('to')));
  }, [motion]);

  const hide = useCallback(() => {
    if (!openRef.current) return;
    const done = () => { setOpen(null); setPhase('idle'); setFull(false); };
    if (!motion) { done(); return; }
    setPhase('back');
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(done, 300);
  }, [motion]);

  const openCase = (key, e) => {
    // Let cmd/ctrl/shift/middle-click open the case study's link in a new tab.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    window.history.pushState({ fromSite: true }, '', pathFor(key));
    show(key);
  };

  const switchCase = (key) => {
    window.history.replaceState(window.history.state, '', pathFor(key));
    setOpen(key);
  };

  const close = useCallback((e) => {
    e?.preventDefault?.();
    if (!openRef.current) return;
    // Opened from the grid: step back so the browser's Back button stays in sync.
    // Opened from a pasted link: there's nothing of ours to go back to, so swap the URL.
    if (window.history.state?.fromSite) { window.history.back(); return; }
    window.history.replaceState(null, '', '/');
    hide();
  }, [hide]);

  useEffect(() => {
    if (window.location.pathname !== '/' && !keyFromPath()) window.history.replaceState(null, '', '/');
    const onPop = () => {
      const key = keyFromPath();
      if (!key) hide();
      else if (openRef.current) setOpen(key);
      else show(key);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [show, hide]);

  useEffect(() => {
    const p = PROJECTS.find((x) => x.key === open);
    document.title = p ? `${p.name} · Genna Gonzaga` : 'Genna Gonzaga';
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open || seen.includes(open)) return;
    const next = [...seen, open];
    setSeen(next);
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(next)); } catch { /* private mode: just don't remember */ }
  }, [open, seen]);

  const project = PROJECTS.find((p) => p.key === open);
  // Up next: the other case studies in grid order after this one, the ones not opened yet first.
  const upNext = project
    ? PROJECTS
      .map((_, d) => PROJECTS[(PROJECTS.indexOf(project) + d + 1) % PROJECTS.length])
      .slice(0, -1)
      .sort((a, b) => seen.includes(a.key) - seen.includes(b.key))
      .slice(0, 2)
    : [];

  return (
    <EnvContext.Provider value={{ motion, narrow, fine, mainRef }}>
      <div className={`app${narrow ? ' is-narrow' : ''}`}>
        {narrow ? (
          <MobileHeader active={active} onNav={goTo} />
        ) : (
          <Sidebar active={active} onNav={goTo} lookRight={!!hover} />
        )}

        <main ref={mainRef} className={`main${open ? ' is-locked' : ''}`} data-scroll="work">
          {active === 0 && (
            <Work hover={hover} onHover={setHover} onOpen={openCase} />
          )}
          {active === 1 && <About />}
          {active === 2 && <Play />}
          {active !== 2 && <Footer />}
        </main>

        {project && (
          <CaseStudy
            project={project}
            upNext={upNext}
            phase={phase}
            full={full}
            onToggleFull={() => setFull((f) => !f)}
            onClose={close}
            onSwitch={switchCase}
          />
        )}
      </div>
    </EnvContext.Provider>
  );
}
