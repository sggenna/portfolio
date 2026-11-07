import { NAV, NAV_PATHS } from '../data.js';
import { PulseDot } from './Sidebar.jsx';

export default function MobileHeader({ active, onNav }) {
  return (
    <header className="mheader">
      <img className="mheader__avatar" src="/assets/v8/avatar-left.png" alt="Genna's self-portrait" />
      <div className="mheader__name">Genna Gonzaga</div>
      <div className="mheader__school">CS &amp; Visual Arts @ Columbia</div>
      <p className="mheader__bio">I’m a product designer and engineer who makes software that feels handmade, like a person made it for a person, whether that’s my friends or my&nbsp;grandma.</p>
      <p className="mheader__now">
        <PulseDot />
        <span>Designing + Building @ Richemont</span>
      </p>
      <nav className="mheader__nav" aria-label="Portfolio">
        {NAV.map((label, i) => (
          <a
            key={label}
            href={NAV_PATHS[i]}
            aria-current={i === active ? 'page' : 'false'}
            style={{ color: i === active ? '#b21f86' : '#1f1a1d' }}
            onClick={(e) => onNav(i, e)}
          >
            <img src="/assets/v7/sparkle.png" alt="" style={{ opacity: i === active ? 1 : 0 }} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
