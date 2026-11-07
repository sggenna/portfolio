import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { NAV, NAV_PATHS, PROJECTS, THINGS, casePath } from './data.js';
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
  return PROJECTS.find((p) => p.slug === slug && !p.soon)?.key ?? null;
};
const pathFor = (key) => casePath(PROJECTS.find((p) => p.key === key));
const pageFromPath = () => {
  const { pathname } = window.location;
  if (/^\/about(\/|$)/.test(pathname)) return 1;
  return /^\/play\/?$/.test(pathname) ? 2 : 0;
};
const photoFromPath = () => {
  const slug = window.location.pathname.match(/^\/about\/(.+?)\/?$/)?.[1];
  return THINGS.find((t) => t.slug === slug)?.slug ?? null;
};
// Cmd/ctrl/shift/middle-click opens the link in a new tab instead.
const opensNewTab = (e) => e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;

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

  const [active, setActive] = useState(pageFromPath);
  const [photo, setPhoto] = useState(photoFromPath);
  const activeRef = useRef(active);
  activeRef.current = active;
  const [hover, setHover] = useState('');
  const [open, setOpen] = useState(keyFromPath);
  const [phase, setPhase] = useState(() => (keyFromPath() ? 'to' : 'idle')); // idle | from | to | back
  const [full, setFull] = useState(false);
  const closeTimer = useRef(0);
  const openRef = useRef(open);
  openRef.current = open;
  const [seen, setSeen] = useState(readSeen);

  const showPage = useCallback((i) => {
    const swap = () => {
      flushSync(() => setActive(i));
      if (mainRef.current) mainRef.current.scrollTop = 0;
      if (narrow) window.scrollTo(0, 0);
    };
    // Work → About → Play: the page content crossfades and drifts in the direction you're going; the nav stays put.
    if (!motion || i === activeRef.current || !document.startViewTransition) { swap(); return; }
    document.documentElement.dataset.nav = i > activeRef.current ? 'forward' : 'back';
    document.startViewTransition(swap).finished.finally(() => { delete document.documentElement.dataset.nav; });
  }, [narrow, motion]);

  const goTo = (i, e) => {
    if (opensNewTab(e)) return;
    e.preventDefault();
    if (window.location.pathname !== NAV_PATHS[i]) window.history.pushState(null, '', NAV_PATHS[i]);
    showPage(i);
  };

  const openPhoto = (slug, e) => {
    if (opensNewTab(e)) return;
    e.preventDefault();
    window.history.pushState({ fromSite: true }, '', `/about/${slug}`);
    setPhoto(slug);
  };

  const closePhoto = () => {
    // Same as closing a case study: step back if we opened it, swap the URL if it came from a pasted link.
    if (window.history.state?.fromSite) { window.history.back(); return; }
    window.history.replaceState(null, '', '/about');
    setPhoto(null);
  };

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
    if (opensNewTab(e)) return;
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
    // Tidy links that don't lead anywhere: an unknown photo goes to About, anything else home.
    const page = pageFromPath();
    if (!keyFromPath() && !photoFromPath() && window.location.pathname !== NAV_PATHS[page]) window.history.replaceState(null, '', NAV_PATHS[page]);
    const onPop = () => {
      const nextPage = pageFromPath();
      if (nextPage !== activeRef.current) showPage(nextPage);
      setPhoto(photoFromPath());
      const key = keyFromPath();
      if (!key) hide();
      else if (openRef.current) setOpen(key);
      else show(key);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [show, hide, showPage]);

  useEffect(() => {
    const p = PROJECTS.find((x) => x.key === open);
    const name = p ? p.name : active ? NAV[active] : '';
    document.title = name ? `${name} · Genna Gonzaga` : 'Genna Gonzaga';
  }, [open, active]);

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
      .filter((p) => !p.soon)
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
          {active === 1 && <About photo={photo} onOpenPhoto={openPhoto} onClosePhoto={closePhoto} />}
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
