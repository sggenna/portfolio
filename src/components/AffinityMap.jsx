// The Diciobase affinity map, cut down to what each theme taught: the finding, the line that said it best, and two
// of the observations behind it. The full wall had 140+ notes; this is the part worth reading.
const THEMES = [
  {
    name: 'Time and access',
    color: '#c99a1e',
    finding: 'The bottleneck was getting to the data at all.',
    quote: 'I lose an hour before I even start.',
    notes: ['Logs in to each dictionary separately', 'Five browser tabs open at once'],
  },
  {
    name: 'Provenance and trust',
    color: '#2f6396',
    finding: 'Where a definition came from mattered as much as the definition.',
    quote: 'I need to know where it came from.',
    notes: ['Skeptical of normalized or merged data', 'Each dictionary has a different academic weight'],
  },
  {
    name: 'Non-linear navigation',
    color: '#4f7a3a',
    finding: 'Nobody had one word and one question.',
    quote: 'One word leads to six others.',
    notes: ['Follows etymological threads', 'Prints pages to lay them side by side'],
  },
  {
    name: 'Citation',
    color: '#7a4a9e',
    finding: 'A citation has to keep working after it’s published.',
    quote: 'I had to amend a published paper.',
    notes: ['URLs break when databases restructure', 'No permanent link to a specific entry'],
  },
];

export default function AffinityMap({ label }) {
  return (
    <div className="aff" role="img" aria-label={label}>
      <div className="aff__grid">
        {THEMES.map((t) => (
          <section key={t.name} className="aff__theme" style={{ '--theme': t.color }}>
            <h4 className="aff__name">
              <i aria-hidden="true" />
              {t.name}
            </h4>
            <p className="aff__finding">{t.finding}</p>
            <blockquote className="aff__quote">“{t.quote}”</blockquote>
            <ul className="aff__notes">
              {t.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
