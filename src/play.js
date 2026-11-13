// The Play page: drawings hung on a 12-column editorial grid. Edit captions and placement here.
//
//   image     file in /public/assets/play (no extension); w and h are its pixel size
//   alt       what the drawing shows, for screen readers
//   medium    what it's made with, shown under it: 'Charcoal on paper'
//   caption   optional one-line note; if you add one, it shows first, with the medium after it in lighter gray
//   row       which row it hangs in; rows are 56px apart
//   col       the column it starts on (1–12), and span, how many columns it covers
//   height    how tall it shows, in px, cropped to fill (object-fit: cover); leave it out to show the whole drawing
//   focus     which part stays in view when it's cropped, as a CSS object-position ('center 30%')
//   stack     items in the same row with the same stack name share one column, top to bottom
//   offset    pushes a stack down from the top of its row, in px
//   size      a stacked sketch's width, as a share of its stack (0.55 = 55%)
//   align     'end' pushes a smaller stacked sketch to the right
//
// Never put equal-sized items side by side; each row should have one clear lead.
// On phones every drawing shows whole, one per row, in this order.
export const DRAWINGS = [
  // Row 1: the hero, all twelve columns, shown whole
  {
    image: 'dancers', w: 2000, h: 1446,
    alt: 'Charcoal drawing of candomblé dancers in full, swirling skirts',
    medium: 'Charcoal on paper',
    row: 1, col: 1, span: 12,
  },

  // Row 2: the charcoal pair. The draped figure large on the left, the lilies smaller and lower on the right
  {
    image: 'draped-figure', w: 1530, h: 2000,
    alt: 'Charcoal drawing of a woman in a draped gown, standing in an arched niche',
    medium: 'Charcoal on paper',
    row: 2, col: 1, span: 6,
  },
  {
    image: 'lilies', w: 1392, h: 2000,
    alt: 'Charcoal drawing of a duck beside white lilies',
    medium: 'Charcoal on paper',
    row: 2, col: 8, span: 4, stack: 'lilies', offset: 120,
  },

  // Row 3: the stone wall, with the gallery room smaller and lower beside it
  {
    image: 'stone-wall', w: 1477, h: 2000,
    alt: 'Graphite drawing of a woman leaning on a stone wall under twisting branches',
    medium: 'Graphite on paper',
    row: 3, col: 2, span: 5,
  },
  {
    image: 'gallery-room', w: 1477, h: 2000,
    alt: 'Charcoal and graphite drawing of a gallery corner with framed works and a hanging sculpture',
    medium: 'Charcoal and graphite on paper',
    row: 3, col: 8, span: 4, stack: 'gallery', offset: 80,
  },

  // Row 4: the Central Park bridge, with the plant triptych narrow beside it
  {
    image: 'bridge', w: 1442, h: 2000,
    alt: 'Graphite drawing of a stone bridge in Central Park over a rocky creek, with bare trees above it',
    medium: 'Graphite on paper',
    row: 4, col: 1, span: 5,
  },
  {
    image: 'plant-triptych', w: 859, h: 2000,
    alt: 'Three line drawings of a leafy plant, hung in a column',
    medium: 'Graphite line work',
    row: 4, col: 8, span: 3, stack: 'plant', offset: 64,
  },

  // Row 5: the knights wide, with the sculptures small and lower on the right
  {
    image: 'knights', w: 2000, h: 1491,
    alt: 'Graphite drawing of two knights in armor on horseback in a museum hall',
    medium: 'Graphite on paper',
    row: 5, col: 2, span: 7,
  },
  {
    image: 'sculptures', w: 1500, h: 2000,
    alt: 'Graphite drawing of three sculptures on pedestals in a gallery',
    medium: 'Graphite on paper',
    row: 5, col: 10, span: 3, stack: 'sculptures', offset: 100,
  },
];

// Not on the page right now: your WKCR shows and what you're building. Kept here so nothing is lost.
export const PLAYLISTS = [
  { name: 'the african show', date: '3.13.2025', link: 'https://open.spotify.com/playlist/4kuT3RPfA9USrjf85P4DXT', caption: '[One line about this show]' },
  { name: 'urbano latinx', date: '3.17.2025', link: 'https://open.spotify.com/playlist/1tqb3plmyuOWCH2QJxFE2M', caption: '[One line about this show]' },
  { name: 'mambo machine', date: '11.30.2025', link: 'https://open.spotify.com/playlist/0XSpUEAMaIxwmTktCWiaCT', caption: '[One line about this show]' },
];
export const BUILDING = {
  caption: 'ColorStack Columbia’s chapter site. I’m designing and building it now.',
  link: '[ColorStack site link]', image: '',
};
