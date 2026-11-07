// Drop a 16:9 mp4/webm and matching poster into public/ and set `video` / `poster` to show it on the card.
// `zoom` scales the video past black bars baked into the file (e.g. 1.16 for a 1920×936 picture inside 1920×1080).
// A `#t=<seconds>` on `video` picks the frame the card rests on before it plays.
// `frame` puts a live page on the card instead, at its design size; it's told 'play' and 'stop' as the card is hovered.
export const PROJECTS = [
  { key: 'platform', slug: 'bloomin/platform', name: "Bloomin' platform", line: 'One place for an English school to grow.', meta: 'Product design · Frontend · 2025', outcome: '20 min → 90 sec student setup', tags: ['In testing'], video: '/assets/bloomin-platform/cover-teacher-hd.mp4#t=2', fit: '#781444', framed: true, poster: '' },
  { key: 'dicio', slug: 'diciobase', name: 'Diciobase', line: "Brazil's dictionaries, one search.", meta: 'Product design · Frontend · 2026', outcome: '23→1 steps per lookup', tags: ['Shipping 2026'], frame: { src: '/assets/diciobase/demos/search-embed.html', w: 720, h: 405 }, poster: '/assets/diciobase/card-poster.jpg', color: '#141414' },
  { key: 'plate', slug: 'platepal', name: 'PlatePal', line: 'Meal picks that fit your goals at every Columbia dining hall.', meta: 'Product design · Frontend · 2025', outcome: '93% of testers rated it 5 out of 5', tags: ['0→1'], video: '/assets/platepal/cover-solid.mp4#t=8', color: '#2f6f4f', poster: '', zoom: 1.16 },
  { key: 'bloomin', slug: 'bloomin', name: "Bloomin'", line: 'An English school that grew out of an Instagram page.', meta: 'Branding · Web · 2025', outcome: '20% more enrolled students', tags: ['0→1', 'Branding', 'Shipped'], video: '/assets/bloomin/logo-bloom.mp4#t=2.8', poster: '' },
];

// Written case studies, keyed by project. Projects without one show the template case study.
// Media (and `hero`): { video } or { img, w, h } plus `alt`; `todo` is a labelled placeholder.
// `wide: true` on a row puts its media full width under the text (for diagrams with small type).
// `media` can be a list to stack several; `small: true` keeps an image at illustration size.
// `cut` shows only part of a video through a mask, for recordings with a solid background (MP4s can't be transparent).
// A `track` makes the cut-out follow a phone that moves during the clip.
// `frame` embeds a live HTML prototype, scaled to fit, at its design size `w` by `h`.
// `compare: true` lays a row's media side by side, full width, for before/after screens; `cap` labels each one, `caps` puts a bold label (optional { l, d } for a note under it) under each thing in an image. `beside: true` keeps a pair next to the text instead of full width.
// Rows: `p` (string, list, or { lead, text }), then `bullets` ({ lead?, text }), then `after`. `h` is optional.
// Quotes take an optional `avatar` image; without one they show the speaker's initials, and `avatar: false` hides it.
// A row with its own `quote`/`cite` shows that quote under its text; a lone { quote, cite } is a centered pull quote.
export const STUDIES = {
  plate: {
    lede: 'Meal picks that fit your goals, at every Columbia dining hall.',
    meta: [
      { l: 'Role', v: 'Primary designer, front-end and back-end contributor' },
      { l: 'Team', v: 'Thomas Sibilly, Jaden Hiton, Lexus Chen' },
      { l: 'Timeline', v: 'Sept – Dec 2025' },
      { l: 'Tools', v: 'Figma, Figma Make, React, Firebase, Python' },
    ],
    hero: { video: '/assets/platepal/hero.mp4', cut: { vw: 1920, vh: 1080, x: 740, y: 86, w: 440, h: 908, radius: 72, track: [[0, 746, 90, 428, 900]] }, alt: 'Scanning a plate in PlatePal, seeing its estimated macros, and logging the meal' },
    tldr: 'PlatePal recommends meals across Columbia’s 12+ dining halls based on each student’s goals, and shows the macros for every pick. Students can also take a photo of their plate to estimate its macros and log it, kind of like MyFitnessPal but built for Columbia dining.',
    stats: [
      { v: '93%', l: 'of testers rated PlatePal 5 out of 5 (n=15)' },
      { v: '83%', l: 'of students rated their existing dining tools 1–2 out of 5 (n=12)' },
    ],
    chapters: [
      {
        id: 'cs-research',
        label: 'Research',
        rows: [
          {
            h: 'Every meal was a guessing game',
            quote: 'Concrete numbers would be a lot better than this guessing game.',
            cite: 'Savannah, Columbia student',
            p: 'We surveyed 12 students and followed 5 of them through a whole meal, from picking a hall to sitting down to eat. When they looked up what to eat, Lion Dine had no nutrition info, and the Columbia Dining website only showed the day’s menu. So students with specific goals were left guessing.',
          },
          {
            h: 'Most students had a goal and no way to hit it',
            p: 'Our affinity map showed three types of diners: goal-driven, convenience-driven, and habit-based. Goal-driven students were the biggest group and the most affected by the missing nutrition info, so I designed for them first while keeping the app fast for everyone else.',
            media: { img: '/assets/platepal/motivation.png', w: 1152, h: 400, alt: 'Three types of diners: 58% goal-driven, 25% convenience, 17% habit' },
          },
          {
            h: 'Our first prototype was a text message',
            p: 'For our smoke-and-mirrors test, we texted participants meal picks by hand three times a day, the way the app eventually would. Personalized messages did a lot better than generic ones, and long ones usually went unread. That became my rule for every screen: if something was too long or more than a student needed in that moment, I cut it.',
            media: { img: '/assets/platepal/texts-long-short-hd.webp', w: 3028, h: 1256, alt: 'Two text messages: a long generic list of what every dining hall is serving, and a short personal one, “Grilled chicken bowl at Ferris, 42g protein, fits your goal.”' },
          },
        ],
      },
      {
        id: 'cs-design',
        label: 'Design',
        rows: [
          {
            h: 'Open the app, and dinner’s already decided',
            quote: 'If I also had an app that told me, OK, like… where to go and what macros that would be ideal.',
            cite: 'Kaylie, Columbia student',
            p: 'Participants really liked being told what to eat, especially on busy weekdays. So the plate of the day sits at the top of the home screen, built from each student’s macros, preferences, and favorite meals. The hard part was deciding how much it should say.',
            wide: true,
            media: { img: '/assets/platepal/plate-explorations-hd.webp', w: 3200, h: 1265, caps: [
                { l: 'Too much', d: 'Every macro, a description, “why we picked this,” and the dining hall in tiny text. Way too much for someone who just wants to grab a meal and go.' },
                { l: 'Too little', d: 'Just “Suggested” and the plate. No macros, and no dining hall, so you didn’t even know where to get it.' },
                { l: 'Too many choices', d: 'A few options to compare sounds helpful, but more choices make you take longer to decide, and people end up giving up and just grabbing whatever.' },
                { l: 'Just enough', d: 'One plate that fits your goals: the photo, the name, which dining hall and until when, two pills for calories and protein, and add or dismiss.' },
              ], alt: 'Four versions of the plate of the day: a full nutrition card, a slim Suggested banner, a row of three options, and the final card with one meal' },
          },
          {
            h: 'No mystery meals',
            p: 'Students also wanted to see the numbers for themselves. Llama 3 builds each plate from the day’s menus and the student’s profile, and an estimation layer on USDA FoodData Central gives the macros for every dish, so every suggestion shows its numbers.',
            wide: true,
            media: { img: '/assets/platepal/macro-pipeline-hd.webp', w: 3200, h: 1126, alt: 'Student profile plus today’s menus go to Llama 3, which picks the plate; USDA FoodData Central supplies the macros; the result is a meal card with calories, protein, carbs and fat' },
          },
          {
            h: 'Your camera is the new food scale',
            p: 'The same numbers work for what you actually ate. Take a photo, PlatePal estimates the macros using USDA data, and the meal gets added to your daily totals.',
            media: {
              video: '/assets/platepal/photo-logging.mp4',
              alt: 'Taking a photo, seeing the estimated macros, and adding the meal to the daily totals',
              // The camera pushes in partway through, so the cut-out follows the phone: [seconds, x, y, width, height].
              cut: {
                vw: 1920, vh: 1080, x: 740, y: 104, w: 442, h: 942, width: '50%', radius: 66,
                track: [[0, 754, 108, 412, 866], [1.8, 754, 108, 414, 868], [1.9, 754, 108, 414, 872], [2.1, 752, 110, 416, 874], [2.2, 752, 110, 418, 878], [2.3, 750, 112, 420, 882], [2.4, 750, 114, 422, 886], [2.5, 748, 116, 426, 894], [2.6, 746, 118, 428, 900], [2.7, 744, 120, 432, 906], [2.8, 744, 122, 434, 910], [2.9, 744, 122, 434, 914], [3, 742, 124, 436, 914], [3.1, 742, 124, 436, 918], [4.8, 742, 124, 438, 918], [4.9, 744, 122, 434, 912], [5, 748, 116, 426, 894], [5.1, 750, 112, 420, 882], [5.2, 752, 108, 416, 874], [5.3, 754, 108, 414, 868], [11.3, 754, 106, 414, 868]],
              },
            },
          },
          {
            h: 'Seven questions on one screen was six too many',
            p: 'Version one asked for everything on one screen, and every tester said it felt like homework standing between them and dinner. So I split it into three quick steps: dining halls first since it’s the easiest choice, then restrictions and allergens, then a calorie goal, and PlatePal does the macro math, so nobody has to figure out what 30/40/30 means for them.',
            media: { video: '/assets/platepal/onboarding-before-after.mp4', cut: { mask: '/assets/platepal/onboarding-mask.svg', vw: 1920, vh: 1080, x: 533, y: 106, w: 854, h: 868, width: '98%' }, caps: ['Before', 'After'], alt: 'Before and after: single-page onboarding next to the three new steps for dining halls, restrictions and allergens, and a calorie goal' },
          },
          {
            h: 'Settings is just onboarding, again, on purpose',
            p: 'My first Settings page had so much on it that managing your account felt like a chore. Since it covers the same things as onboarding, I rebuilt it from those screens, so it’s shorter and already familiar. I also swapped sliders for plus and minus steppers, because sliders make exact numbers hard to hit on a phone.',
            beside: true,
            media: [
              { img: '/assets/platepal/settings-before-phone.webp', w: 1400, h: 2917, caps: ['Before'], alt: 'A long Settings page with sliders for calories and macros' },
              { img: '/assets/platepal/settings-after-phone.webp', w: 1400, h: 2917, caps: ['After'], alt: 'A shorter Settings screen rebuilt from onboarding, with plus and minus steppers' },
            ],
          },
          {
            h: 'Twelve dining hall photos made one endless scroll',
            p: 'Finding a specific hall meant scrolling past all twelve photos. A compact toggle helped, but a picture of a dining hall doesn’t help anyone decide what to eat. So the photos went, and halls got their own tab with what’s open, until when, and what’s on tonight, plus search and favorites.',
            wide: true,
            media: {
              caps: [
                { l: 'Photos for every hall', d: 'Pretty, but endless.' },
                { l: 'A compact toggle', d: 'Better, but why keep the photos?' },
                { l: 'Halls get their own tab', d: 'Just the list, plus search and favorites.' },
              ],
              img: '/assets/platepal/home-iterations-final.webp', w: 3200, h: 1970, alt: 'Three versions of the home screen: a large photo for every hall, a compact list toggle, and Dining halls as its own tab with search and favorites' },
          },
        ],
      },
      {
        id: 'cs-reflection',
        label: 'Reflection',
        rows: [
          {
            h: 'Knowing how much people want to see',
            p: 'We could have made every screen as helpful as possible by adding everything we knew about a meal. But we’re college students with short lunch breaks and a lot going on, and nobody has time to think through everything that goes into a meal. Sometimes an app that just tells you what to eat is the best thing that happens in your day. Listening to students showed me what to cut, so nothing stands between them and their food.',
          },
          {
            h: 'Every number is still an estimate',
            p: 'Without official data from Columbia Dining, every macro in PlatePal is an estimate, and students tracking specific goals deserve to know that. Next, I’d want to work with Dining Services on a data partnership, label estimates clearly in the app, and let students flag numbers that look wrong, so the data gets better as more people use it.',
          },
        ],
      },
    ],
  },
  dicio: {
    lede: 'Portuguese dictionaries, one search.',
    live: 'https://diciobase.vercel.app/',
    liveLocked: true, // the demo is on request: the button shows a lock, and its cursor carries the note
    note: 'Live demo available on request. In the beta, saved words only last for your session, and there are no accounts yet.',
    meta: [
      { l: 'Role', v: 'Product designer and developer' },
      { l: 'Team', v: 'FORMAS Research Lab' },
      { l: 'Timeline', v: 'June 2025 – May 2026' },
      { l: 'Tools', v: 'Figma, Figma Make, React, Express, MySQL' },
    ],
    // These demos are built from the Diciobase repo's real screens by its `pnpm build:demos`.
    hero: {
      frame: '/assets/diciobase/demos/tour-embed.html',
      w: 1440,
      h: 900,
      ratio: '16 / 10',
      phoneFrame: { src: '/assets/diciobase/demos/tour-embed.html', w: 358, h: 720 },
      alt: 'A tour of Diciobase: searching saudade from the orbit home page, switching its entry between three dictionaries, seeing where they agree on a meaning, and following the synonym nostalgia to its own entry.',
    },
    tldr: 'Diciobase is a dictionary platform for linguists. You search a Portuguese word once and see what several dictionaries say about it, each in its own original structure.',
    stats: [
      { v: '4 min', l: 'per lookup in early testing, down from a whole morning' },
      { v: '23 → 1', l: 'steps to one search' },
    ],
    chapters: [
      {
        id: 'cs-research',
        label: 'Research',
        rows: [
          {
            h: 'Only 4 of 23 steps were actual research',
            quote: 'Before I can actually do research I spend two hours getting data into a readable format.',
            cite: 'PhD researcher, UFBA',
            avatar: false,
            p: 'I interviewed researchers in Brazil and Portugal and watched them do real lookups. They were working from physical dictionaries, going book by book, and looking up one word took 23 steps. Only 4 of those steps were the research they actually came to do.',
            wide: true,
            media: { img: '/assets/diciobase/task-map-hd.webp', w: 2981, h: 1427, alt: 'Task map of a single lookup: 23 steps across Prepare, Search, Synthesise and Cite' },
          },
          {
            h: 'The researcher with a secret Python script',
            p: 'The lab was digitizing these dictionaries, and the digitized entries were still hard to read. One researcher had written her own script that she ran every day just to get them into a format she could use. She’d never told anyone about it. When people build their own tools in secret, the problem is real.',
          },
          {
            h: '“Please don’t clean up our data”',
            quote: 'I care about the word in front of me and where it came from.',
            cite: 'Master’s student, University of Lisbon',
            avatar: false,
            p: [
              'This was the clearest thing I heard across the interviews. Researchers look at different dictionaries because each one builds its entries differently, and those differences are exactly what they study. Merging everything into one format would have taken that away and made Diciobase useless to them.',
              'So the real question became: how do you put every dictionary in one place and keep what makes each one different?',
            ],
            wide: true,
            media: { live: 'affinity-map', alt: 'Affinity map: 140+ observations in four themes, time and access, provenance and trust, non-linear navigation and citation, each with its finding, a quote and two observations.' },
          },
        ],
      },
      {
        id: 'cs-design',
        label: 'Design',
        rows: [
          {
            h: 'Every dictionary stays exactly as it was written',
            p: 'I kept each dictionary’s microstructure exactly as it is, all the way down to the database. Every entry has the same parts, in the same order, as the dictionary it came from. That’s what lets the interface show the differences between them.',
          },
          {
            h: 'The compare view nobody used',
            p: 'Researchers used to lay their dictionaries open side by side, so my first instinct was a compare view that did the same thing on screen. When I watched people use it, they read one dictionary at a time and never opened compare. It was taking up space, so I dropped it.',
            media: { frame: '/assets/diciobase/demos/feature-embed.html?f=compare', w: 760, h: 380, demo: true, alt: 'The compare view prototype: Wikcionário and Dicionário Aberto side by side for saudade.' },
          },
          {
            h: 'One feature was secretly three questions',
            p: 'Watching them, I realized compare was trying to answer three things at once: what does this dictionary say, how is it built, and do the others agree? So I split it up.',
            bullets: [
              { lead: 'What does it say?', text: 'Each dictionary gets its own tab, with a count of its meanings.' },
              { lead: 'How is it built?', text: 'That’s Estrutura.' },
              { lead: 'Do the others agree?', text: 'Little dots next to a meaning show which other dictionaries have it too.' },
            ],
            media: [
              { frame: '/assets/diciobase/demos/feature-embed.html?f=tabs', w: 760, h: 380, demo: true, alt: 'Switching between the Wikcionário, Dicionário Aberto and OpenWordnet tabs. Each tab has a count of its meanings, and the definitions change.' },
              { frame: '/assets/diciobase/demos/feature-embed.html?f=dots', w: 760, h: 220, demo: true, alt: 'Hovering the dot next to a meaning shows “Também em Dicionário Aberto”.' },
            ],
          },
          {
            h: 'When the structure drowned out the words',
            p: 'My first Estrutura highlighted every part of the entry right in the text, each in its own color, and it felt overwhelming. So I moved the structure to the margin: a colored label and a thin line beside each part, and a strip at the top with the order that dictionary uses. Now you can read the entry and see how it’s built at the same time.',
            compare: true,
            media: [
              { frame: '/assets/diciobase/demos/feature-embed.html?f=estrutura-before', w: 720, h: 470, demo: true, cap: 'Before', alt: 'The first Estrutura: every part of the entry highlighted inline in its own color.' },
              { frame: '/assets/diciobase/demos/feature-embed.html?f=estrutura-after', w: 720, h: 470, demo: true, cap: 'After', alt: 'Estrutura now: colored labels and thin lines in the margin, with the dictionary’s order in a strip.' },
            ],
          },
          {
            h: 'Silence is information too',
            p: 'If a dictionary doesn’t have a word, its tab says “Não consta no OpenWordnet,” because knowing a source doesn’t have something matters to a researcher. Serif only shows up for the dictionary’s own words, so you always know what the dictionary said and what the interface said.',
            media: { frame: '/assets/diciobase/demos/feature-embed.html?f=missing', w: 760, h: 300, demo: true, alt: 'The entry for sertão: opening the OpenWordnet tab shows “Não consta no OpenWordnet”.' },
          },
          {
            h: 'The sign-up page that made people leave',
            p: 'Saving a word used to send you to a separate sign-up page, and in testing a lot of people dropped off right there. So I made sign-up a pop-up, and your word saves the moment you’re done. In the next round, people signed up without leaving the word they were on.',
            compare: true,
            media: [
              { frame: '/assets/diciobase/demos/feature-embed.html?f=signup-before', w: 760, h: 600, demo: true, cap: 'Before', alt: 'Saving a word sends you to a separate sign-up page, and the word is gone.' },
              { frame: '/assets/diciobase/demos/feature-embed.html?f=signup-after', w: 760, h: 600, demo: true, cap: 'After', alt: 'Saving a word opens a sign-up pop-up over the entry, and the word is saved when you finish.' },
            ],
          },
          {
            h: 'Typing it however you can',
            p: 'Search ignores accents, so “sao” still finds “são” on any keyboard, and the tabs stay pinned so you never scroll back up to switch dictionaries.',
            media: { frame: '/assets/diciobase/demos/feature-embed.html?f=search', w: 760, h: 460, demo: true, alt: 'Typing sao in the search bar, and the suggestions show são.' },
          },
          {
            h: 'A globe that was just decoration',
            p: 'My first home page had a globe covered in tiny Portuguese words, and it was the same kind of distraction I’d been removing everywhere else. Now three slow orbits of cards, one per dictionary, frame the search, and the headline word shows its syllables, like the dots in di·cio·ba·se. When you click into the search, everything slows down and fades back.',
            compare: true,
            media: [
              { img: '/assets/diciobase/globe-home.jpg', w: 1440, h: 900, cap: 'Before', alt: 'The first home page: a black dotted globe behind the search bar, under the headline Todos os dicionários. Em um só lugar.' },
              { frame: '/assets/diciobase/demos/feature-embed.html?f=orbit', w: 1440, h: 900, demo: true, cap: 'After', alt: 'The orbit home page: cards drift around the search, then slow and fade back when you click into it.' },
            ],
          },
        ],
      },
      {
        id: 'cs-reflection',
        label: 'Reflection',
        rows: [
          { quote: 'I looked up a word for a paper. It took me four minutes including reading the results. That used to take my whole morning.', cite: 'PhD researcher, UFBA, after testing', avatar: false },
          {
            h: 'Watch the workflow, not just the habit',
            p: 'Laying dictionaries side by side was how researchers worked on paper, so I assumed they’d want it on screen. Watching them showed me the questions they were actually trying to answer, and the design is built around those now.',
          },
          {
            h: 'What I’d test next',
            p: 'Diciobase is still a work in progress, and testing so far has been early. Next, I want to see how researchers use Estrutura over longer sessions, and whether compare earns its way back once more dictionaries come in.',
          },
        ],
      },
    ],
  },
  bloomin: {
    lede: 'Growing an online English school out of an Instagram page.',
    live: 'https://www.bloominenglish.com.br/',
    meta: [
      { l: 'Role', v: 'Brand designer, product designer and developer' },
      { l: 'Client', v: 'Professora Jamile Oliveira' },
      { l: 'Timeline', v: 'January 2025 – March 2026' },
      { l: 'Tools', v: 'Figma, React, Claude Code' },
    ],
    hero: { video: '/assets/bloomin/site-scroll.mp4', poster: '/assets/bloomin/site-scroll-poster.webp', phoneVideo: '/assets/bloomin/site-scroll-phone.mp4', phonePoster: '/assets/bloomin/site-scroll-phone-poster.webp', ratio: '16 / 10', phoneRatio: '390 / 844', big: true, bare: true, alt: 'Scrolling through the Bloomin’ landing page, from the hero through courses, Jamile, how classes work, testimonials, the FAQ and contact' },
    tldr: 'Jamile runs an online English school, and before Bloomin’ all she had was an Instagram page, with no name, logo, or website. I designed the brand and built a mobile-first landing page that answers the questions she used to answer one by one in her DMs. Now I’m designing the platform her students learn on.',
    stats: [
      { v: '20%', l: 'more enrolled students since launch' },
      { v: '80%', l: 'fewer students asking the same questions, from a month of Jamile tracking her DMs after launch' },
    ],
    chapters: [
      {
        id: 'cs-research',
        label: 'Research',
        rows: [
          {
            h: 'A whole English school running out of one Instagram page',
            p: 'Almost all of Jamile’s students found her on Instagram, and every conversation happened in her DMs or on WhatsApp. She did all her own marketing, so the branding never stuck, and she spent hours answering the same questions.',
            media: { img: '/assets/bloomin/instagram-dms.webp', w: 2800, h: 2890, alt: 'Her old Instagram profile in yellow and red next to a list of blurred DMs asking the same questions' },
          },
          {
            h: 'The same six questions, over and over',
            p: 'I went through about 40 of her DM and WhatsApp conversations, and the same six questions kept coming up, from how to join to whether you can try a class first. They became the backbone of the landing page.',
            media: { img: '/assets/bloomin/six-questions.webp', w: 2400, h: 2402, alt: 'The six questions as message bubbles, surrounded by blurred repeats of the same questions' },
          },
          {
            h: 'Designing for the students she wants more of',
            p: 'Jamile teaches kids and teens too, but she prefers teaching adults who are growing in their careers. So that’s who we designed for.',
          },
        ],
      },
      {
        id: 'cs-design',
        label: 'Design',
        rows: [
          {
            h: 'Fluency is the destination. Bloomin’ is how you get there.',
            p: 'Our first idea was Fluency On. But fluency is where students end up, and Jamile’s school is about the process of getting there: growing into your English and becoming more confident. We wanted a name that reflected her approach, and Bloomin’ did.',
          },
          {
            h: 'Bright colors were for a younger crowd',
            p: 'Jamile wanted bright, saturated colors, and honestly I started there too. But when we looked at English schools using saturated palettes, they were mostly targeting younger learners. For adults with careers, that would read more like a children’s book. So we went with one deep burgundy pink for actions and soft lilacs and cream for everything else. It’s still playful, since it’s an English school, not a law firm, but it feels grown-up. Geist keeps the type clean, and each course level gets its own bloom.',
            wide: true,
            media: [
              { video: '/assets/bloomin/design-system.mp4', cut: { vw: 1400, vh: 860, x: 36, y: 36, w: 1328, h: 788, radius: 21, full: true, blend: true, track: [[0, 36, 36, 1328, 788]] }, alt: 'The Bloomin design system: Geist type, logo, buttons, plum, cream and pink colors sliding across, and one bloom illustration per course level' },
            ],
          },
          {
            h: 'A website that answers the DMs for her',
            p: 'Jamile wrote short answers to each of the six questions, and I ordered the page to answer them in the order people ask them. From anywhere on the page, you’re one tap from messaging her on WhatsApp. And when someone comes back to the site after messaging her, petals fall, a small reward for the one step the whole page is designed around.',
            wide: true,
            media: { img: '/assets/bloomin/questions-map.webp', w: 2929, h: 1997, alt: 'The six questions on the left, connected by lines to the page sections that answer them on the right' },
          },
          {
            h: 'One headline, one button',
            p: 'After sketching ideas and setting up the design system in Figma, I used Claude Code to turn them into hero prototypes Jamile could click through, so we could compare real versions without spending weeks on each one. A flower drawing itself felt too plain. Flowers popping out on hover pulled attention from booking a trial class. Flowers that sway a little on hover, like a breeze, kept it fun without competing with the button.',
            wide: true,
            media: { frame: '/assets/bloomin/hero-ideas.html', w: 1800, h: 1590, cap: 'Live prototypes I built so Jamile could compare', alt: 'Three live hero prototypes: a flower that draws itself on scroll, flowers that pop out when you hover the letters, and the final hero, where flowers sway on hover' },
          },
          {
            h: 'When are testimonials too much?',
            p: 'Jamile had over 30 testimonials, including videos, and our first version included all of them. Nobody was going to scroll through that. People come to a landing page to find out what you’re about, what you can do for them, and what to do next, and credibility helps, but it isn’t the point. Research I found suggested people rarely read past six testimonials, which also helped Jamile feel OK leaving the rest out. So we kept six, and for the long ones I pulled the most important line up as a big quote, so you get the same trust without reading the whole thing.',
            compare: true,
            media: [
              { img: '/assets/bloomin/testimonial-full.webp', w: 2640, h: 1656, cap: 'Before', alt: 'A testimonial shown at full length as one long paragraph' },
              { img: '/assets/bloomin/testimonial-quote.webp', w: 2640, h: 1624, cap: 'After', alt: 'The same testimonial with its strongest line as a large headline quote and a Read more link' },
            ],
          },
        ],
      },
      {
        id: 'cs-reflection',
        label: 'Reflection',
        rows: [
          {
            h: 'Clients need a designer with a point of view',
            p: 'Jamile’s colors and her 30 testimonials both came from good instincts. My job wasn’t to just execute them or overrule her. It was to bring reasoning and evidence she could trust.',
          },
          {
            h: 'I’d explore the brand longer up front',
            p: 'We kept deciding on something and realizing weeks later it didn’t work. More exploration early on would have saved us those loops.',
          },
        ],
      },
    ],
  },
  platform: {
    lede: 'One place for an English school to grow.',
    meta: [
      { l: 'Role', v: 'Product designer and developer' },
      { l: 'Client', v: 'Professora Jamile Oliveira' },
      { l: 'Timeline', v: 'December 2025 to present' },
      { l: 'Tools', v: 'Figma, React, Express' },
    ],
    hero: { video: '/assets/bloomin-platform/hero-student.mp4', ratio: '16 / 10', alt: 'A student starts a lesson from Início: a wrong answer brings Bloom’s hint, the right answer earns XP, and Lição concluída shows the results' },
    tldr: 'Bloomin’ is the learning platform for Professora Jamile’s online English school. Students take lessons, practice, and turn in homework, and Jamile runs her classes and keeps track of everyone in the same place.',
    stats: [
      { v: '90 sec', l: 'to set up a new student, down from 20 min' },
      { v: '5 → 1', l: 'apps to run the school' },
    ],
    chapters: [
      {
        id: 'cs-research',
        label: 'Research',
        rows: [
          {
            h: 'Five apps to run one English class',
            quote: 'Sometimes I finish a lesson and I’m not sure if I’m done or if I missed something.',
            cite: 'Beginner student, working full-time',
            avatar: false,
            p: 'Classes were on Meet, homework on WhatsApp or Forms, and recordings on YouTube or Drive. Jamile tracked everything by hand, which wasn’t going to work as the school grew.',
            media: { img: '/assets/bloomin-platform/five-apps.webp', w: 2800, h: 1670, alt: 'Meet, WhatsApp, Drive, YouTube, and Forms all pointing at Ana, a B1 student with five apps to open before class' },
          },
          {
            h: 'Students needed today’s task. Jamile needed to know who was slipping.',
            quote: 'I just want to open it and see what I should do today.',
            cite: 'Maria Eduarda, preparing to move abroad',
            avatar: false,
            p: 'I had Jamile and three students walk me through a normal session, and it gave me one rule for every page: whatever helps you figure out what to do next goes up front, and everything else is one click away.',
          },
          {
            h: 'A correction went nowhere',
            p: 'Jamile would mark a mistake, and that was the end of it. With so many students, she couldn’t remember everyone’s mistakes and make practice for each one, so corrections just got lost. How could a correction become something the student does, and something Jamile can see?',
          },
        ],
      },
      {
        id: 'cs-design',
        label: 'Design',
        rows: [
          {
            h: 'A red mark becomes a lesson',
            p: 'When Jamile tags “She work” as a grammar mistake, it becomes a drill on that student’s practice page, signed “Da Prof. Jamile.” When they practice it, their progress moves, and Jamile sees it too. The platform remembers the mistakes so she doesn’t have to.',
            after: 'The catch: if corrections pile up, students think they’re done when more is on the way.',
            wide: true,
            media: { frame: '/assets/tag-to-drill/Bloomin%20Tag%20to%20Drill.dc.html', w: 1920, h: 1080, demo: true, phoneFrame: { src: '/assets/tag-to-drill/Bloomin%20Tag%20to%20Drill%20Phone.dc.html', w: 430, h: 770 }, stillVideo: '/assets/bloomin-platform/tag-to-drill.mp4', alt: 'Tagging “She work” as grammar, then the same mistake showing up as a drill on the student’s practice page' },
          },
          {
            h: 'Seat counts don’t help you teach tonight',
            p: [
              'Jamile wants to grow the school and bring on more teachers, so I built her first dashboard around the business, with students, occupancy, and open seats. She told me that might matter for growing the school, but day to day she just needed to know what to do with her students that day.',
              'I’d designed for the owner she wants to be, not the teacher she is every day. So the analytics moved one click away, and Hoje starts with her next class and her pending corrections, then who’s drifting.',
            ],
            compare: true,
            media: [
              { img: '/assets/bloomin-platform/hoje-before.webp', w: 2400, h: 2400, cap: 'Before, Painel built around seats and occupancy', alt: 'Painel: student, class, open-seat and occupancy counts, classes with seat-capacity dots, recent activity, shortcuts and the week’s agenda, with pending corrections in a footnote' },
              { img: '/assets/bloomin-platform/hoje-after.webp', w: 2400, h: 2400, cap: 'After, Hoje built around the next class', alt: 'Hoje: the next class and pending corrections, weekly attendance and on-time rates, what to handle before class, then students who need attention' },
            ],
          },
          {
            h: 'When every column speaks at the same volume, nothing is urgent',
            p: 'On the student side, Tarefas has one job: showing what’s late, what’s due this week, and what can wait. It took four layouts to get the hierarchy right.',
            compare: true,
            media: [
              { img: '/assets/bloomin-platform/tarefas-uppercase.webp', w: 2240, h: 1120, caps: [{ l: 'Uppercase labels', d: 'The uppercase group labels were louder than the homework under them, and every row repeated “B1” even though students already know their level.' }], alt: 'Tarefas as cards under uppercase group labels' },
              { img: '/assets/bloomin-platform/tarefas-2.webp', w: 1120, h: 484, caps: [{ l: 'Sentence case', d: 'The labels were softer, but I gave every due date the same rose pill, so “Vence em 7 dias” looked just as urgent as “Atrasada há 3 dias.”' }], alt: 'Tarefas as cards under sentence-case labels, with rose pills' },
              { img: '/assets/bloomin-platform/tarefas-table.webp', w: 2240, h: 1120, caps: [{ l: 'A table', d: 'Every column got the same pill, so “Gramática” looked as important as “Atrasada · 3 dias.” And with Começar and Abrir on every row, there wasn’t one clear thing to do.' }], alt: 'Tarefas as a table with type, status and action columns' },
              { img: '/assets/bloomin-platform/tarefas-tiles.webp', w: 2240, h: 1120, caps: [{ l: 'Date tiles', d: 'The due date sits on the left and only turns rose when it’s late, so you can scan down one edge and know your week. The type and date share one quiet line, and the only filled button is on overdue work.' }], alt: 'Tarefas as a list with a calendar tile for each due date' },
            ],
          },
          {
            h: 'The mascot that barely shows up',
            p: 'Bloom on every page felt noisy, and a little childish for adults learning English for work. So she only shows up at key moments, like your progress, finishing a game, and being all caught up. She can droop for a second when you miss an answer, but never because of your level.',
            media: { img: '/assets/bloomin-platform/bloom-growing.webp', w: 492, h: 600, small: true, alt: 'Bloom growing from a seed to full bloom, A1 to C2' },
          },
          {
            h: 'Twenty minutes of setup, down to ninety seconds',
            p: 'Students open Jamile’s invite, pick a daily goal, and they’re in their first lesson. Across 10 timed test sessions, setup took about 90 seconds.',
            media: { video: '/assets/bloomin-platform/onboarding.mp4', alt: 'Opening Jamile’s invite, setting a daily goal, and landing in the first lesson' },
          },
        ],
      },
      {
        id: 'cs-reflection',
        label: 'Reflection',
        rows: [
          {
            h: 'Emphasis only works when it’s rare',
            p: 'The less Bloom shows up, the more each appearance means, and the same goes for color, motion, and filled buttons.',
          },
          {
            h: 'Sometimes the problem is the layout, not the details',
            p: 'Tarefas went through rounds of small fixes before I realized the layout itself was wrong. Now when something still feels off after a couple of tries, I question the structure instead of tweaking.',
          },
          {
            h: 'Next: contracts and exams, without the weight',
            p: 'We’re adding contract signing and, later, exams. The hard part will be fitting them in for students who just want to open it and see what to do today.',
          },
        ],
      },
    ],
  },
};

// Each case study lives at /work/<slug> so the modal can be linked to directly.
export const casePath = (p) => `/work/${p.slug}`;

export const NAV = ['Work', 'About', 'Play'];
export const NAV_PATHS = ['/', '/about', '/play'];

export const EXPERIENCE = [
  { id: 'logo-richemont', org: 'Richemont', role: 'Software engineering intern', when: 'JUN 2026–NOW', href: 'https://www.richemont.com' },
  { id: 'logo-bloomin', org: "Bloomin'", role: 'Founding product designer', when: 'JAN 2025–NOW', href: '#' },
  { id: 'logo-formas', org: 'FORMAS Research Lab, UFBA', role: 'Researcher and product designer', when: 'JUN 2025–MAY 2026', href: '#' },
];

// `slug` is the photo's link (/about/<slug>), `short` shows under it on phones, `cap` when it's open or hovered.
export const THINGS = [
  { id: 'about-radio', slug: 'radio', short: 'On student radio', cap: 'On student radio, aka making people listen to my playlists', ph: 'Photo: doing radio' },
  { id: 'about-cats', slug: 'cats', short: 'Making cat friends', cap: 'Every cat I meet is a friend I haven’t made yet', ph: 'Photo: with a cat' },
  { id: 'about-drawing', slug: 'drawing', short: 'Drawing with graphite', cap: 'Drawing with graphite', ph: 'Photo: drawing' },
  { id: 'about-sophia', slug: 'sophia', short: 'Cat auntie to Sophia', cap: 'Proud cat auntie to Sophia', ph: 'Photo: Sophia' },
  { id: 'about-food', slug: 'food', short: 'Eating through the city', cap: 'Eating my way through the city', ph: 'Photo: food' },
  { id: 'about-colorstack', slug: 'colorstack', short: 'ColorStack socials', cap: 'Running ColorStack Columbia socials', ph: 'Photo: ColorStack' },
];

export const PROCESS = [
  { n: '01', t: 'Understand', d: 'Mapped the current journey and listened for the moments where confidence dropped.' },
  { n: '02', t: 'Shape', d: 'Turned insights into a focused flow, visual language, and interaction principles.' },
  { n: '03', t: 'Build', d: 'Prototyped in code and refined motion, states, and edge cases through production.' },
];

export const RESULTS = [
  { v: '0→1', l: 'Product foundation' },
  { v: '22', l: 'Core screens' },
  { v: 'Shipped', l: 'Into production' },
];

// NY hour ranges → what I'm likely doing. Each range has a few lines; the footer rotates through them.
export const STATUS = [
  [1, [
    'Still up, convinced one more tweak will fix it.',
    'Still up, reading “just one more chapter.”',
  ]],
  [9, [
    'Asleep. Most of Brasília is too.',
    'Fast asleep, dreaming in hex codes.',
    'Asleep. Sophia the cat is not.',
    'Out cold. Back at 9.',
  ]],
  [12, [
    'Class time. Notes are 40% doodles.',
    'In lecture, pretending this isn’t my third coffee.',
    'Sitting in class, sketching UI in the margins.',
  ]],
  [13, [
    'Birria tacos. Non-negotiable.',
    'Dunking a birria taco in consommé right about now.',
    'It’s birria taco o’clock.',
  ]],
  [16, [
    'Back in class, counting down to 4.',
    'Afternoon lecture. Still thinking about those tacos.',
  ]],
  [19, [
    'Nudging a button 1px to the left. Then back.',
    'Arguing with auto layout. Auto layout is winning.',
    'Renaming “Frame 247” to something real.',
    'Choosing between two pinks that are the same pink.',
    'Kerning something nobody will ever notice.',
  ]],
  [22, [
    'Graphite drawing, and somehow it’s all over my hands.',
    'Designing something just for fun, no client in sight.',
    'Making a playlist nobody asked for.',
    'Out eating my way through the city.',
  ]],
  [24, [
    'At the gym.',
    'At the gym, resting between sets for way too long.',
  ]],
];
