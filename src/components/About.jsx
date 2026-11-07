import { useEffect, useRef, useState } from 'react';
import { EXPERIENCE, THINGS } from '../data.js';
import { SLOTS } from '../slots.js';
import { useMediaQuery } from '../hooks/useEnv.js';
import ImageSlot from './ImageSlot.jsx';

// One photo opened large. Phones get the share sheet; with a mouse, the link is copied.
function PhotoViewer({ thing, fine, onClose }) {
  const dialog = useRef(null);
  const copiedTimer = useRef(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = dialog.current;
    el.showModal();
    return () => { el.close(); clearTimeout(copiedTimer.current); };
  }, []);

  const share = async () => {
    const url = window.location.href;
    try {
      if (!fine && navigator.share) { await navigator.share({ title: `${thing.short} · Genna Gonzaga`, url }); return; }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch { /* share sheet dismissed, or clipboard blocked: the link is still in the address bar */ }
  };

  return (
    <dialog
      ref={dialog}
      className="viewer"
      aria-label={thing.cap}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === dialog.current) onClose(); }}
    >
      <img className="viewer__img" src={SLOTS[thing.id]} alt={thing.cap} />
      <div className="viewer__foot">
        <p className="viewer__cap">{thing.cap}</p>
        <button type="button" className="viewer__share" onClick={share} aria-live="polite">
          {copied ? 'Link copied' : fine || !navigator.share ? 'Copy link' : 'Share'}
        </button>
      </div>
      <button type="button" className="viewer__close" aria-label="Close" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="m3 3 10 10M13 3 3 13" />
        </svg>
      </button>
    </dialog>
  );
}

export default function About({ photo, onOpenPhoto, onClosePhoto }) {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const tagRef = useRef(null);
  const [tag, setTag] = useState(null);

  // Over the photos the cursor becomes a pill saying what's happening in them (fine pointers only).
  const moveTag = (e) => {
    if (tagRef.current) tagRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
  };
  const showTag = (text) => (e) => { moveTag(e); setTag(text); };
  const hideTag = () => setTag(null);
  const opened = THINGS.find((t) => t.slug === photo);

  return (
    <div className="about">
      <section className="about__hero">
        <div
          className="about__portrait"
          onMouseEnter={showTag('Hi, it’s me!')}
          onMouseLeave={hideTag}
          onMouseMove={moveTag}
        >
          <ImageSlot id="about-portrait" placeholder="Photo of you" alt="Genna" />
        </div>
        <div className="about__text">
          <h1 className="about__label">Hi, I’m Genna!</h1>
          <p data-text="1" className="about__lead">
            I design and build products, and while I love both, the design process is where my heart is.
          </p>
          <p data-text="1">
            I’ve always wondered why things feel right. Why does writing with my right hand feel natural but my left doesn’t? Why do we sleep with the lights off? I think it comes down to structure shaping feeling. We get used to things a certain way, and when something breaks from that, we notice. Moving from Brazil to the US to study made me hyperaware of how much “normal” is just what you’re used to.
          </p>
          <p data-text="1">
            So before I build anything, I ask why it feels good and how I’d explain it. That way I always end up with work I can stand behind, down to the small details that make a product feel smooth.
          </p>
        </div>
      </section>

      <section className="about__section">
        <div className="about__stack">
          <h2 className="about__label">Experience</h2>
          <div className="exp">
            {EXPERIENCE.map((x) => (
              <div className="exp__row" key={x.id}>
                <a className="exp__org" href={x.href} target="_blank" rel="noreferrer">
                  <span className="exp__logo"><ImageSlot id={x.id} radius={6} /></span>
                  <span>{x.org}<sup>↗</sup></span>
                </a>
                <span className="exp__role">{x.role}</span>
                <span className="exp__when">{x.when}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about__section about__section--center">
        <h2 className="about__label">Off screen</h2>
        <div className="things">
          {THINGS.map((t) => (
            <a className="thing-wrap" key={t.id} href={`/about/${t.slug}`} onClick={(e) => onOpenPhoto(t.slug, e)}>
              <figure className="thing-fig">
                <div
                  className="thing"
                  onMouseEnter={showTag(t.cap)}
                  onMouseLeave={hideTag}
                  onMouseMove={moveTag}
                >
                  <ImageSlot id={t.id} placeholder={t.ph} alt={t.cap} />
                </div>
                <figcaption className="thing-cap">{t.short}</figcaption>
              </figure>
            </a>
          ))}
        </div>
      </section>

      {opened && <PhotoViewer key={opened.slug} thing={opened} fine={fine} onClose={onClosePhoto} />}

      <span ref={tagRef} className="cursor-tag" aria-hidden="true" style={{ opacity: fine && tag ? 1 : 0 }}>
        {tag}
      </span>
    </div>
  );
}
