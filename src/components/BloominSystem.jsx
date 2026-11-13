// The Bloomin' design system, built in code instead of a recorded video, so it sits right on the case study's
// background. Type, the logo and monogram, the site's buttons, and the palette sliding past in a loop.
const COLORS = [
  ['Plum', '#781444'],
  ['Cream', '#F4F0EC'],
  ['Ink', '#221419'],
  ['Pink 1', '#FBF3F4'],
  ['Pink 2', '#F6E4E6'],
  ['Pink 3', '#F1D6DD'],
  ['Pink 4', '#EBCBD4'],
  ['Lilac', '#E8D5E0'],
];

const Arrow = () => (
  <svg className="bds__arrow" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
);

function Swatches({ copy }) {
  return (
    <ul className="bds__swatches" aria-hidden={copy || undefined}>
      {COLORS.map(([name, hex]) => (
        <li key={name} className="bds__swatch">
          <span className="bds__chip" style={{ background: hex }} />
          <strong>{name}</strong>
          <small>{hex}</small>
        </li>
      ))}
    </ul>
  );
}

export default function BloominSystem({ label }) {
  return (
    <div className="bds" role="img" aria-label={label}>
      <div className="bds__top">
        <section className="bds__group bds__group--type">
          <h4 className="bds__label">Typeface</h4>
          <div className="bds__row">
            <div className="bds__tile bds__tile--aa">
              <span className="bds__aa">Aa</span>
              <span className="bds__font">Geist</span>
            </div>
            <div className="bds__tile bds__tile--weights">
              <span style={{ fontWeight: 300 }}>Light 300</span>
              <span style={{ fontWeight: 400 }}>Regular 400</span>
              <span style={{ fontWeight: 500 }}>Medium 500</span>
              <span style={{ fontWeight: 700 }}>Bold 700</span>
            </div>
          </div>
        </section>

        <section className="bds__group bds__group--logo">
          <h4 className="bds__label">Logo</h4>
          <div className="bds__row">
            <div className="bds__tile bds__tile--logo">
              <img src="/assets/bloomin/brand/bloomin-logo.svg" width="259" height="56" alt="" draggable={false} />
            </div>
            <div className="bds__tile bds__tile--mono">
              <img src="/assets/bloomin/brand/bloomin-monogram.svg" width="228" height="265" alt="" draggable={false} />
            </div>
          </div>
        </section>
      </div>

      <section className="bds__group">
        <h4 className="bds__label">Components</h4>
        <div className="bds__components">
          <span className="bds__btn bds__btn--primary">Book a trial class <span className="bds__btn-dot"><Arrow /></span></span>
          <span className="bds__btn bds__btn--outline">Book a class</span>
          <span className="bds__link bds__link--rule">Take the level test <Arrow /></span>
          <span className="bds__link">Learn more <Arrow /></span>
          <span className="bds__fab">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
          </span>
          <span className="bds__circle"><Arrow /></span>
          <span className="bds__dots"><i /><i /><i /></span>
        </div>
      </section>

      <section className="bds__group">
        <h4 className="bds__label">Colors</h4>
        <div className="bds__marquee">
          <div className="bds__track">
            <Swatches />
            <Swatches copy />
          </div>
        </div>
      </section>
    </div>
  );
}
