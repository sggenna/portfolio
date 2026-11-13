import { useEffect, useRef, useState } from 'react';
import Toc from './Toc.jsx';
import KeyedClip from './KeyedClip.jsx';
import MistakeJourney from './MistakeJourney.jsx';
import AffinityMap from './AffinityMap.jsx';

function LockIcon() {
  return (
    <svg className="lock-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}
import { PROCESS, RESULTS, STUDIES, casePath } from '../data.js';
import { useEnv, useMediaQuery } from '../hooks/useEnv.js';

const ease = 'cubic-bezier(.2,.7,.2,1)';
const SECTIONS = [
  { id: 'cs-summary', label: 'Summary' },
  { id: 'cs-overview', label: 'Overview' },
  { id: 'cs-process', label: 'How I worked' },
  { id: 'cs-solution', label: 'The solution' },
  { id: 'cs-outcome', label: 'The outcome' },
];
const FULL_ON = 'M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9';
const FULL_OFF = 'M6.5 2.5v4h-4M9.5 13.5v-4h4M6.5 6.5 2.5 2.5M9.5 9.5l4 4';

function Label({ children }) {
  return <div className="eyebrow">{children}</div>;
}

// The phone's rectangle at time t, as a clip-path over the whole video frame.
function trackClip({ vw, vh, radius, track }, t) {
  let i = track.findIndex((k) => k[0] > t);
  if (i === -1) i = track.length - 1;
  const a = track[Math.max(0, i - 1)];
  const b = track[i];
  const mix = b[0] > a[0] ? Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))) : 0;
  const [x, y, w, h] = [1, 2, 3, 4].map((n) => a[n] + (b[n] - a[n]) * mix);
  const r = radius * (w / track[0][3]);
  const pct = (v, of) => `${(v / of) * 100}%`;
  return `inset(${pct(y, vh)} ${pct(vw - x - w, vw)} ${pct(vh - y - h, vh)} ${pct(x, vw)} round ${pct(r, vw)} / ${pct(r, vh)})`;
}

// Loops silently while on screen. With reduced motion it waits for the viewer to press play.
function Clip({ src, poster, label, style, eager, tracked }) {
  const { motion } = useEnv();
  const ref = useRef(null);

  // Keep the cut-out on the phone, in step with the frame on screen where the browser can tell us.
  useEffect(() => {
    const v = ref.current;
    if (!v || !tracked) return;
    const apply = () => { v.style.clipPath = trackClip(tracked, v.currentTime); };
    let id = 0;
    const byFrame = 'requestVideoFrameCallback' in v;
    const loop = (_, meta) => {
      v.style.clipPath = trackClip(tracked, meta?.mediaTime ?? v.currentTime);
      id = byFrame ? v.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    };
    apply();
    v.addEventListener('seeked', apply);
    id = byFrame ? v.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    return () => {
      v.removeEventListener('seeked', apply);
      if (byFrame) v.cancelVideoFrameCallback(id); else cancelAnimationFrame(id);
    };
  }, [tracked]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !motion) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play()?.catch(() => {}); else v.pause();
    }, { threshold: 0.05 });
    // Watch the frame, not the video: a cut-out video is mostly hidden, so it would never count as on screen.
    // A low threshold starts it as soon as it appears, so a tall phone never sits frozen while partly in view.
    io.observe(v.parentElement);
    return () => io.disconnect();
  }, [motion, src]);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload={eager ? 'auto' : 'metadata'} controls={!motion} aria-label={label} style={style} />;
}

// Zooms a video to the `cut` region and masks away everything else.
const cutStyle = ({ mask, vw, vh, x, y, w, h, blend }) => ({
  position: 'absolute',
  width: `${(vw / w) * 100}%`,
  height: `${(vh / h) * 100}%`,
  maxWidth: 'none',
  left: `${(-x / w) * 100}%`,
  top: `${(-y / h) * 100}%`,
  // `blend` drops a near-white background: lift it to pure white, then multiply it into the page.
  ...(blend && { filter: 'brightness(1.05)', mixBlendMode: 'multiply' }),
  ...(mask && {
    WebkitMaskImage: `url(${mask})`,
    maskImage: `url(${mask})`,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  }),
});

// A live prototype at its design size, scaled down as one piece so it keeps its layout at any width.
// With a `phone` cut, narrow columns get that instead, never larger than its design size.
const PHONE_FRAME_BELOW = 720;
function LiveFrame({ src, w, h, title, phone, demo }) {
  const box = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = box.current?.parentElement;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const small = phone && width > 0 && width < PHONE_FRAME_BELOW;
  const cut = small ? phone : { src, w, h };
  const scale = small ? Math.min(1, width / cut.w) : width / cut.w;
  return (
    <div ref={box} className="cs__live-frame" style={{ aspectRatio: `${cut.w} / ${cut.h}`, ...(small && { maxWidth: cut.w, margin: '0 auto' }) }}>
      {width > 0 && (
        <iframe key={cut.src} src={cut.src} title={title} loading="lazy" scrolling="no" inert={demo} style={{ width: cut.w, height: cut.h, transform: `scale(${scale})` }} />
      )}
    </div>
  );
}

function Media({ m }) {
  const { motion } = useEnv();
  const fig = m.todo ? <div className="cs__fig cs__fig--empty"><span>{m.todo}</span></div> : (
    <figure
      className={`cs__fig${m.small ? ' cs__fig--small' : ''}${m.cut ? ' cs__fig--cut' : ''}`}
      style={m.cut ? { aspectRatio: `${m.cut.w} / ${m.cut.h}`, '--w': m.cut.width, '--ratio': m.cut.w / m.cut.h, maxWidth: m.cut.full ? 'none' : undefined } : undefined}
    >
      {m.frame && (motion || !m.stillVideo) && <LiveFrame src={m.frame} w={m.w} h={m.h} title={m.alt} phone={m.phoneFrame} demo={m.demo} />}
      {m.frame && !motion && m.stillVideo && <KeyedClip src={m.stillVideo} label={m.alt} />}
      {m.live === 'mistake-journey' && <MistakeJourney label={m.alt} />}
      {m.live === 'affinity-map' && <AffinityMap label={m.alt} />}
      {m.frame || m.live ? null : m.video
        ? <Clip src={m.video} label={m.alt} style={m.cut ? cutStyle(m.cut) : undefined} tracked={m.cut?.track ? m.cut : undefined} />
        : <img src={m.img} alt={m.alt} width={m.w} height={m.h} loading="lazy" draggable={false} />}
    </figure>
  );
  if (!m.cap && !m.caps) return fig;
  return (
    <div className={`cs__shot${m.cut ? ' cs__shot--cut' : ''}`} style={m.cut ? { '--w': m.cut.width, '--ratio': m.cut.w / m.cut.h } : undefined}>
      {fig}
      {m.cap && <span className="cs__cap">{m.cap}</span>}
      {m.caps && (
        <div className={`cs__caps${m.caps.length > 3 ? ' cs__caps--many' : ''}`} style={{ '--n': m.caps.length }}>
          {m.caps.map((c) => (
            <span key={c.l || c} className="cs__cap">
              <strong>{c.l || c}</strong>
              {c.d && <small>{c.d}</small>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// The speaker's photo, or their initials until there is one.
function Avatar({ name, src }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <span className="cs__avatar" aria-hidden="true">
      {src ? <img src={src} alt="" /> : initials}
    </span>
  );
}

function Quote({ q, inline }) {
  const [name, ...role] = q.cite.split(',');
  return (
    <figure className={`cs__pull${inline ? ' cs__pull--inline' : ''}`}>
      <blockquote>“{q.quote}”</blockquote>
      <figcaption>
        {q.avatar !== false && <Avatar name={name} src={q.avatar} />}
        <span>
          <strong>{name}</strong>
          {role.join(',').trim()}
        </span>
      </figcaption>
    </figure>
  );
}

// The problem opens the story as its own chapter, 01, before Research.
const chaptersOf = (study) => (study.problem
  ? [{ id: 'cs-problem', label: 'Problem', p: { lead: study.problem.h, text: study.problem.p } }, ...study.chapters]
  : study.chapters);

function Story({ study }) {
  return (
    <>
      {chaptersOf(study).map((c, n) => (
        <section key={c.id} id={c.id} className="cs__section cs__section--ruled cs__section--story">
          <Label>{String(n + 1).padStart(2, '0')} / {c.label}</Label>
          {c.rows?.map((r) => (r.h || r.p || r.media ? (
            <div key={r.h || [].concat(r.p)[0]} className={`cs__row${r.wide || r.compare ? ' cs__row--wide' : ''}${r.media ? '' : ' cs__row--text'}`}>
              <div>
                {r.h && <h3 className="cs__h3">{r.h}</h3>}
                {r.quote && <Quote q={r} inline />}
                {r.list && (
                  <dl className="cs__list">
                    {r.list.map((i) => (
                      <div key={i.k}>
                        <dt>{i.k}</dt>
                        <dd>{i.v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {[].concat(r.p ?? []).map((t) => (
                  <p key={t.lead || t} className="cs__body">{t.lead ? <><strong>{t.lead}</strong> {t.text}</> : t}</p>
                ))}
                {r.bullets && (
                  <ul className="cs__bullets">
                    {r.bullets.map((b) => (
                      <li key={b.lead || b.text}>{b.lead && <strong>{b.lead}</strong>} {b.text}</li>
                    ))}
                  </ul>
                )}
                {r.after && <p className="cs__body">{r.after}</p>}
              </div>
              {r.media && (
                <div className={`cs__media${r.compare || r.beside ? ' cs__media--compare' : ''}${r.beside ? ' cs__media--beside' : ''}${[].concat(r.media).length === 3 ? ' cs__media--three' : ''}`}>
                  {[].concat(r.media).map((m) => <Media key={m.img || m.video || m.frame || m.live || m.todo} m={m} />)}
                </div>
              )}
            </div>
          ) : <Quote key={r.quote} q={r} />))}
          {c.p && [].concat(c.p).map((t) => (
            <p key={t.lead || t} className="cs__big">
              {t.lead ? <><strong>{t.lead}</strong> {t.text}</> : t}
            </p>
          ))}
        </section>
      ))}
    </>
  );
}

export default function CaseStudy({ project, upNext, phase, full, onToggleFull, onClose, onSwitch }) {
  const { motion, narrow } = useEnv();
  const phone = useMediaQuery('(max-width: 600px)');
  const scroller = useRef(null);
  const dialog = useRef(null);
  const current = useRef(project);
  current.current = project;
  const flat = full || narrow;
  const shown = phase === 'to';

  // Jumping to another case study from "Up next" starts at the top, with keyboard focus there too.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
    dialog.current?.focus({ preventScroll: true });
  }, [project.key]);

  // A real modal for keyboards: the page behind can't be reached, Tab stays inside, and closing goes back to where you were.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return undefined;
    const opener = document.activeElement;
    const behind = [...el.parentElement.children].filter((c) => c !== el && !c.classList.contains('cs-overlay'));
    behind.forEach((c) => { c.inert = true; });
    const onTab = (e) => {
      if (e.key !== 'Tab') return;
      const stops = [...el.querySelectorAll('a[href], button, iframe:not([inert]), video[controls], [tabindex="0"]')].filter((s) => s.getClientRects().length);
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const at = document.activeElement;
      if (e.shiftKey && (at === first || at === el)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
    };
    el.addEventListener('keydown', onTab);
    return () => {
      el.removeEventListener('keydown', onTab);
      behind.forEach((c) => { c.inert = false; });
      // Opened from a direct link there's no opener, so fall back to this project's card.
      const back = opener && opener !== document.body && opener.isConnected
        ? opener
        : document.querySelector(`a.card[href="${casePath(current.current)}"]`);
      back?.focus({ preventScroll: true });
    };
  }, []);

  const study = STUDIES[project.key];
  const sections = study
    ? [{ id: 'cs-summary', label: 'Summary' }, ...chaptersOf(study)]
    : SECTIONS;
  const meta = study ? study.meta : [
    { l: 'Role', v: 'Product designer & engineer' },
    { l: 'Team', v: 'Design & engineering' },
    { l: 'Timeline', v: project.meta.split(' · ').pop() },
    project.outcome
      ? { l: 'Impact', v: project.outcome, accent: true }
      : { l: 'Skills', v: 'Product design, engineering' },
  ];

  return (
    <>
      <div
        className="cs-overlay"
        onClick={onClose}
        style={{ opacity: shown ? 1 : 0, transition: motion ? 'opacity 280ms ease-out' : 'none' }}
      />
      <div
        ref={dialog}
        tabIndex={-1}
        className={`cs${full ? ' cs--full' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} case study`}
        style={{
          inset: flat ? '0px' : 'clamp(16px, 3vh, 32px) clamp(16px, 9vw, 160px)',
          borderRadius: flat ? 0 : 24,
          opacity: shown ? 1 : 0,
          transform: shown || !motion ? 'none' : 'translateY(16px) scale(0.98)',
          transition: motion
            ? `opacity 280ms ease-out, transform 360ms ${ease}, inset 320ms ${ease}, border-radius 320ms ${ease}`
            : 'none',
        }}
      >
        <div className="cs__bar">
          <button className="cs__btn" onClick={onClose} aria-label="Back to work">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7 8 2.5 13.5 7v6.5h-3.5V10h-4v3.5H2.5z" /></svg>
          </button>
          <button className="cs__btn" onClick={onToggleFull} aria-label={full ? 'Exit full screen' : 'Full screen'}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={full ? FULL_OFF : FULL_ON} /></svg>
          </button>
        </div>

        <div ref={scroller} className="cs__scroll">
          {full && !narrow && (
            <div className="cs__dock">
              <Toc key={project.key} items={sections} scrollerRef={scroller} variant="full" />
            </div>
          )}
          <article className="cs__article">
            {/* Written studies keep title, TL;DR, details and video together on the first screen. */}
            <section id="cs-summary" className={`cs__hero${study ? ' cs__hero--study' : ''}${study?.hero.big ? ' cs__hero--big' : ''}`}>
              <div className="cs__hero-text">
                <div>
                  <h1 className="cs__h1">{project.name}</h1>
                  {study ? (
                    <>
                      {study.live && (
                        <a className="cs__live" href={study.live} target="_blank" rel="noreferrer">Try it live <span aria-hidden="true">↗</span></a>
                      )}
                      {/* Not public yet: say so plainly instead of a link */}
                      {!study.live && study.demo && (
                        <p className="cs__live cs__live--locked"><LockIcon /> {study.demo}</p>
                      )}
                      {study.note && <p className="cs__note">{study.note}</p>}
                    </>
                  ) : (
                    <p className="cs__lede">
                      <strong>{project.line}</strong> I turned the idea into a clear, brand-aligned product that feels smooth from first impression through everyday use.
                    </p>
                  )}
                </div>
                {study && (
                  <div className="cs__tldr">
                    <h2 className="cs__tldr-title">TL;DR</h2>
                    <p>{study.tldr}</p>
                  </div>
                )}
                <dl className="cs__meta">
                  {meta.map((k) => (
                    <div key={k.l}>
                      <dt>{k.l}</dt>
                      <dd style={{ color: k.accent ? '#b21f86' : '#111' }}>{k.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {study ? (
                <div className="cs__hero-side">
                  {study.hero.frame ? (
                    <div className="cs__hero-media cs__hero-media--bare" style={{ aspectRatio: phone && study.hero.phoneFrame ? 'auto' : study.hero.ratio }}>
                      <LiveFrame src={study.hero.frame} w={study.hero.w} h={study.hero.h} title={study.hero.alt} phone={phone ? study.hero.phoneFrame : undefined} demo />
                    </div>
                  ) : study.hero.video
                    ? (
                      <div
                        className={`cs__hero-media${study.hero.cut ? ' cs__hero-media--cut' : ''}${study.hero.bare ? ' cs__hero-media--bare' : ''}`}
                        style={study.hero.cut ? { aspectRatio: `${study.hero.cut.w} / ${study.hero.cut.h}` } : study.hero.ratio ? { aspectRatio: phone && study.hero.phoneRatio ? study.hero.phoneRatio : study.hero.ratio } : undefined}
                      >
                        <Clip key={phone && study.hero.phoneVideo ? 'phone' : 'wide'} src={phone && study.hero.phoneVideo ? study.hero.phoneVideo : study.hero.video} poster={phone && study.hero.phonePoster ? study.hero.phonePoster : study.hero.poster} label={study.hero.alt} style={study.hero.cut ? cutStyle(study.hero.cut) : undefined} tracked={study.hero.cut?.track ? study.hero.cut : undefined} eager />
                      </div>
                    )
                    : <div className="cs__hero-media"><span>{study.hero.todo}</span></div>}
                  {study.stats && (
                    <div className="cs__stats cs__stats--top" aria-label="Impact">
                      {study.stats.map((r) => (
                        <div className="cs__result" key={r.l}>
                          <strong>{r.v}</strong>
                          <span>{r.l}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="cs__hero-media"><span>{project.name} preview</span></div>
              )}
            </section>

            {study ? <Story study={study} /> : (
              <>
                <section id="cs-overview" className="cs__section cs__section--ruled">
                  <Label>Overview</Label>
                  <h2 className="cs__h2">Building a clear experience without losing what makes the brand feel human.</h2>
                  <div className="cs__two">
                    <p>The product had grown quickly, but the experience around it had not kept pace. People needed a simpler way to understand what was available and take the next step with confidence.</p>
                    <p>I translated the character of the brand into a calm product system—one that makes complex decisions feel natural and carries smoothly from first impression to daily use.</p>
                  </div>
                </section>

                <section className="cs__quote">
                  <p>“How might we make every step feel obvious, without making the experience feel generic?”</p>
                </section>

                <section id="cs-process" className="cs__section cs__section--process">
                  <Label>How I worked</Label>
                  <h2 className="cs__h2">Listen closely, find the friction, then build through the details.</h2>
                  <div className="cs__three">
                    {PROCESS.map((s) => (
                      <div className="cs__step" key={s.n}>
                        <span>{s.n}</span>
                        <h3>{s.t}</h3>
                        <p>{s.d}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="cs-solution" className="cs__feature">
                  <div>
                    <Label>The solution</Label>
                    <h2 className="cs__h2 cs__h2--tight">One smooth path from curiosity to action.</h2>
                    <p className="cs__body">A flexible interface gives people the right amount of information at each moment, with intentional motion that reinforces where they are and what happens next.</p>
                  </div>
                  <div className="cs__demo" data-dark="1">
                    <span>Welcome back</span>
                    <strong>Everything you need,<br />right where you expect it.</strong>
                    <i>Continue →</i>
                  </div>
                </section>

                <section id="cs-outcome" className="cs__section cs__section--ruled">
                  <Label>The outcome</Label>
                  <h2 className="cs__h2">A foundation designed to ship—and keep growing.</h2>
                  <div className="cs__three">
                    {RESULTS.map((r) => (
                      <div className="cs__result" key={r.l}>
                        <strong>{r.v}</strong>
                        <span>{r.l}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            <section id="cs-next" className="cs__section cs__section--ruled cs__section--last">
              <Label>Up next</Label>
              <div className="cs__next">
                {upNext.map((u) => (
                  <a key={u.key} href={casePath(u)} onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; e.preventDefault(); onSwitch(u.key); }}>
                    <div className={`cs__next-media${u.framed ? ' media-framed' : ''}`} style={{ background: u.color || u.fit }}>
                      {u.video ? (
                        <video
                          src={u.video}
                          muted
                          playsInline
                          preload="metadata"
                          aria-hidden="true"
                          style={{ transform: u.zoom ? `scale(${u.zoom})` : undefined, objectFit: u.fit ? 'contain' : undefined }}
                        />
                      ) : u.poster ? (
                        <img src={u.poster} alt="" aria-hidden="true" draggable={false} />
                      ) : 'Product video · 16:9'}
                    </div>
                    <div className="cs__next-text">
                      <span className="cs__next-title">{u.name}</span>
                      <span>{u.line}</span>
                      <span className="cs__next-meta">{u.meta}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>
    </>
  );
}
