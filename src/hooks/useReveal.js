import { useEffect, useRef } from 'react';
import { useEnv } from './useEnv.js';

// Fade/slide an element in the first time it scrolls into view. Anything already on screen
// at load is never hidden.
export function useReveal() {
  const ref = useRef(null);
  const { motion, narrow, mainRef } = useEnv();
  useEffect(() => {
    const el = ref.current;
    if (!el || !motion || typeof IntersectionObserver === 'undefined') return;
    let seen = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!seen) {
          seen = true;
          if (e.isIntersecting) { io.disconnect(); return; }
          el.style.transition = 'none';
          el.style.opacity = '0';
          el.style.transform = 'translateY(12px)';
          return;
        }
        if (e.isIntersecting) {
          el.style.transition = 'opacity 360ms cubic-bezier(.2,.7,.2,1), transform 360ms cubic-bezier(.2,.7,.2,1)';
          el.style.opacity = '1';
          el.style.transform = 'none';
          io.disconnect();
        }
      },
      { root: narrow ? null : mainRef.current, threshold: 0.05 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.style.transition = el.style.opacity = el.style.transform = '';
    };
  }, [motion, narrow, mainRef]);
  return ref;
}
