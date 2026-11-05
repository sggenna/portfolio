import { createContext, useContext, useEffect, useState } from 'react';

const query = (q) => typeof matchMedia !== 'undefined' && matchMedia(q).matches;

export function useMediaQuery(q) {
  const [on, setOn] = useState(() => query(q));
  useEffect(() => {
    const mq = matchMedia(q);
    const h = () => setOn(mq.matches);
    h();
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return on;
}

export const useMotion = () => !useMediaQuery('(prefers-reduced-motion: reduce)');

// Below 900px the sidebar becomes a header and the page (not <main>) scrolls.
export function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 900);
  useEffect(() => {
    const on = () => setNarrow(Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0) < 900);
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return narrow;
}

// Shared by components that need the scroll container (reveals, video autoplay, flourish).
export const EnvContext = createContext({ motion: true, narrow: false, fine: false, mainRef: { current: null } });
export const useEnv = () => useContext(EnvContext);
