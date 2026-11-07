// Drop a 16:9 mp4/webm and matching poster into public/ and set `video` / `poster` to show it on the card.
// `zoom` scales the video past black bars baked into the file (e.g. 1.16 for a 1920×936 picture inside 1920×1080).
// A `#t=<seconds>` on `video` picks the frame the card rests on before it plays.
export const PROJECTS = [
  { key: 'plate', slug: 'platepal', name: 'PlatePal', line: 'Meal picks that fit your goals at every Columbia dining hall.', meta: 'Product design · Frontend · 2025', outcome: '93% of testers rated it 5 out of 5', tags: ['0→1'], video: '/assets/platepal/cover-solid.mp4#t=8', color: '#2f6f4f', poster: '', zoom: 1.16 },
  { key: 'platform', slug: 'bloomin/platform', name: "Bloomin' platform", line: 'One place for an English school to grow.', meta: 'Product design · Frontend · 2025', outcome: '20 min → 90 sec student setup', tags: ['In testing'], video: '/assets/bloomin-platform/cover-teacher-hd.mp4#t=2', fit: '#781444', framed: true, poster: '' },
  { key: 'bloomin', slug: 'bloomin', name: "Bloomin'", line: 'An English school that grew out of an Instagram page.', meta: 'Branding · Web · 2025', outcome: '20% more enrolled students', tags: ['0→1', 'Branding', 'Shipped'], video: '/assets/bloomin/logo-bloom.mp4#t=2.8', poster: '' },
  { key: 'dicio', slug: 'diciobase', name: 'Diciobase', line: "Brazil's dictionaries, one search.", meta: 'Product design · Frontend · 2026', outcome: '23→1 steps per lookup', tags: ['Shipping 2026'], video: '', color: '#f2b632', poster: '', soon: true },
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
            p: 'We surveyed 12 students and followed two of them through a whole meal, from picking a hall to sitting down to eat. The two sites students used were Lion Dine, which is student-built but has no nutrition info, and the Columbia Dining website, which only shows the day’s menu. So students with specific goals were left guessing.',
          },
          {
            h: 'Most students had a goal and no way to hit it',
            p: 'Our affinity map showed three types of diners, goal-driven, convenience-driven, and habit-based. Goal-driven students were the biggest group and the most affected by the missing nutrition info, so I designed for them first while keeping the app fast for everyone else.',
            media: { img: '/assets/platepal/motivation.png', w: 1152, h: 400, alt: 'Three types of diners: 58% goal-driven, 25% convenience, 17% habit' },
          },
          {
            h: 'Our first prototype was a text message',
            p: 'We ran a smoke-and-mirrors test where we texted participants meal picks by hand three times a day, the way the app eventually would. Personalized messages did a lot better than generic ones, and long ones usually went unread. That became my rule for every screen. If a student would wonder why something is there, it goes.',
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
            p: [
              'Participants really liked being told what to eat, especially on busy weekdays. So the plate of the day sits at the top of the home screen, built from each student’s macros, preferences, and favorite meals.',
              'I didn’t want it to feel like extra friction though, so I tried a few different ways of showing it.',
            ],
            wide: true,
            media: { img: '/assets/platepal/plate-explorations-hd.webp', w: 3200, h: 1265, caps: [
                { l: 'Too much', d: 'Answered every question, but read like the long texts participants ignored.' },
                { l: 'Too easy to miss', d: 'Easy to skim, but it hid the numbers.' },
                { l: 'Too many choices', d: 'Brought back the decision students wanted to skip.' },
                { l: 'Just enough', d: 'One meal, where and when it’s served, calories and protein, and one tap to add or dismiss.' },
              ], alt: 'Four versions of the plate of the day: a full nutrition card, a slim Suggested banner, a row of three options, and the final card with one meal' },
          },
          {
            h: 'No mystery meals',
            p: 'Students also wanted to see the numbers for themselves. So we split the work in two. Llama 3 builds each plate from the day’s menus and the student’s profile, and an estimation layer on USDA FoodData Central gives the macros for every dish. That way every suggestion shows its numbers.',
            wide: true,
            media: { img: '/assets/platepal/macro-pipeline-hd.webp', w: 3200, h: 1126, alt: 'Student profile plus today’s menus go to Llama 3, which picks the plate; USDA FoodData Central supplies the macros; the result is a meal card with calories, protein, carbs and fat' },
          },
          {
            h: 'Seven questions on one screen was six too many',
            p: [
              'Version one asked for everything on one screen, including name, photo, calorie target, macro split, restrictions, allergens, and dining halls. When I tested it, everyone said it felt like homework standing between them and dinner.',
              'So I split it into three quick steps. Dining halls come first, since it’s the easiest choice and it tailors everything after it. Restrictions and allergens share a step. Then students pick a calorie goal and PlatePal does the macro math, so nobody has to figure out what 30/40/30 means for them.',
            ],
            media: { video: '/assets/platepal/onboarding-before-after.mp4', cut: { mask: '/assets/platepal/onboarding-mask.svg', vw: 1920, vh: 1080, x: 533, y: 106, w: 854, h: 868, width: '98%' }, caps: ['Before', 'After'], alt: 'Before and after: single-page onboarding next to the three new steps for dining halls, restrictions and allergens, and a calorie goal' },
          },
          {
            h: 'Settings is just onboarding, again, on purpose',
            p: 'My first Settings page put every goal and preference in one place, and there was so much on it that managing your account felt like a chore. Since Settings covers the same things as onboarding, I rebuilt it from the onboarding screens, so it’s shorter and already familiar. I also swapped the sliders for plus and minus steppers, because sliders make exact numbers hard to hit on a phone.',
            beside: true,
            media: [
              { img: '/assets/platepal/settings-before-phone.webp', w: 1400, h: 2917, caps: ['Before'], alt: 'A long Settings page with sliders for calories and macros' },
              { img: '/assets/platepal/settings-after-phone.webp', w: 1400, h: 2917, caps: ['After'], alt: 'A shorter Settings screen rebuilt from onboarding, with plus and minus steppers' },
            ],
          },
          {
            h: 'Your camera is the new food scale',
            p: 'Guessing what’s on a plate is tedious and usually wrong. With PlatePal, students take a photo, the app estimates the macros using USDA data, and the meal gets added to their daily totals.',
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
            h: 'Twelve dining hall photos made one endless scroll',
            p: 'My first home screen gave every dining hall a big photo, so finding a specific one meant scrolling past all twelve. My next version added a compact toggle, but a picture of a dining hall doesn’t really help anyone decide what to eat. So the photos went, and the halls got their own tab with what’s open, until when, and what’s on tonight, plus search and favorites.',
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
            h: 'A few text messages shaped the whole app',
            p: 'Honestly, the smoke-and-mirrors test ended up shaping more of PlatePal than any mockup did. Seeing which texts people actually read told me what to cut on the plate of the day, onboarding, and Settings.',
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
    lede: 'Brazil’s dictionaries, one search.',
    live: '', // link for the "Try it live" button; it shows once this is filled in
    meta: [
      { l: 'Role', v: 'Product designer and developer' },
      { l: 'Team', v: 'FORMAS Research Lab' },
      { l: 'Timeline', v: 'June 2025 – May 2026' },
      { l: 'Tools', v: 'Figma, Figma Make, React, Express, MySQL' },
    ],
    hero: { todo: 'Hero video: typing a word and landing on its entry' },
    tldr: 'At the FORMAS lab, linguists were checking dictionaries one by one, each with its own site and login, before they could even start their research. So I designed and built Diciobase, which searches all of them at once.',
    stats: [
      { v: '4 min', l: 'per lookup in testing, down from a whole morning' },
      { v: '23 → 1', l: 'steps to one search' },
    ],
    chapters: [
      {
        id: 'cs-problem',
        label: 'Problem',
        rows: [
          {
            h: 'The two hours linguists lost before research began',
            quote: 'Before I can actually do research I spend two hours getting data into a readable format.',
            cite: 'PhD researcher, UFBA',
            avatar: false,
            p: 'One lookup took 23 steps, with a different site and login for every dictionary. All the data was there, people just couldn’t get to it easily.',
            wide: true,
            media: { img: '/assets/diciobase/task-map-hd.webp', w: 2981, h: 1427, alt: 'Task map of a single lookup: 23 steps across Prepare, Search, Synthesise and Cite' },
          },
        ],
      },
      {
        id: 'cs-principles',
        label: 'Principles',
        rows: [
          {
            h: 'What dictionary sites get wrong about attention',
            quote: 'I care about the word in front of me and where it came from.',
            cite: 'Master’s student, UC Lisbon',
            avatar: false,
            bullets: [
              { lead: 'Calm screens feel easier to use.', text: 'When I looked at other dictionary sites, what stuck with me most was how overstimulating they were. There were ads, quizzes, games, and a word of the day all pulling me away from the word I actually came for. I still wanted people to explore, so I kept that close to the search, with related words on every entry and suggested words on the home page.' },
              { lead: 'People learn by using.', text: 'Most people skip tutorials and jump straight in, so the app teaches them as they go.' },
              { lead: 'One dictionary at a time.', text: 'Each entry is already a lot of information, so showing more than one would bring back the overload I was trying to get rid of.' },
            ],
            media: { todo: 'Diciobase home page, with suggested words under the search bar' },
          },
        ],
      },
      {
        id: 'cs-design',
        label: 'Design',
        rows: [
          {
            h: 'Every kind of move has its own motion',
            p: 'Going deeper slides in from the right, switching sections slides sideways, and going from word to word is a soft rise. I wanted people to always know what kind of move they just made without having to think about it.',
            media: { todo: 'Search, open a word, go back' },
          },
          {
            h: 'Why Diciobase never asks “are you sure?”',
            p: 'Removing a saved word isn’t a big deal and it’s easy to fix, so a pop-up would just slow everyone down to protect against a mistake that rarely happens. Instead, you get a toast with “Desfazer” (Undo) that puts the word right back where it was.',
            media: { todo: 'Remove a word from Salvos, then undo' },
          },
          {
            h: 'The tutorial nobody has to sit through',
            p: 'Tips only show up once, point at exactly what they’re explaining, and never block the page. I capped them at two per visit so nobody gets the whole tour at once, and you can turn them off or back on in Perfil.',
            media: { todo: 'First visit, with tips pointing at the search bar' },
          },
          {
            h: 'The sign-up page that made people leave',
            p: 'At first, saving a word sent you to a separate sign-up page, and when we tested it, a lot of people dropped off right there. So I made sign-up a pop-up instead, and as soon as you’re done, your word is saved.',
            compare: true,
            media: [
              { todo: 'Separate sign-up page', cap: 'Before' },
              { todo: 'Sign-up pop-up', cap: 'After' },
            ],
          },
          {
            h: 'Three things I cut to keep the search front and center',
            bullets: [
              { lead: 'The busy globe.', text: 'My first globe was covered in tiny Portuguese words and a location dot. But the whole point of the hero is to get you to search, so I turned it into a quiet backdrop behind the search bar.' },
              { lead: 'The dark surfaces.', text: 'The login and profile menu were almost black, and it felt like a second theme. Now black is only for primary actions, so it always means “do this.”' },
              { lead: 'Compare view.', text: 'It crowded the screen more than it helped, and Diciobase was already a big change from how linguists were used to working.' },
            ],
            compare: true,
            media: [
              { todo: 'Busy globe', cap: 'Before' },
              { todo: 'Quiet globe', cap: 'After' },
              { todo: 'Dark login', cap: 'Before' },
              { todo: 'Light login', cap: 'After' },
            ],
          },
          {
            h: 'Making Helvetica friendlier',
            p: 'I still wanted it to look academic, so I started from Helvetica, tightened the spacing, and rounded the corners. We were also hoping to reach people outside of linguistics, so I wanted it to feel a little more inviting.',
            media: { todo: 'Helvetica, then tightened, then rounded. Wordmark and monogram side by side.' },
          },
        ],
      },
      {
        id: 'cs-reflection',
        label: 'Reflection',
        rows: [
          { quote: 'I looked up a word for a paper. It took me four minutes including reading the results. That used to take my whole morning.', cite: 'PhD researcher, UFBA, after testing', avatar: false },
          {
            h: 'What happens at eight dictionaries?',
            p: 'Every dictionary we add makes “one at a time” harder to stick to. If I start seeing people flip back and forth between the same two tabs, that’s when I’d bring compare back, starting small with two entries side by side, only when you ask for it.',
          },
          {
            h: 'Experts and beginners need different amounts of help, not different products',
            p: 'Diciobase was my first time designing for academia, and I learned so much from talking to such different people. A linguist never has to open the “i” explainers, but a student can learn what Etimologia means without ever leaving the page.',
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
    tldr: 'Jamile ran her English school entirely out of Instagram DMs. I designed her brand and built a mobile-first landing page that answers students’ questions before they ask, and now I’m designing the platform they’ll learn on.',
    stats: [
      { v: '20%', l: 'more enrolled students since launch' },
      { v: '80%', l: 'fewer students asking the same questions' },
    ],
    chapters: [
      {
        id: 'cs-research',
        label: 'Research',
        rows: [
          {
            h: 'A whole English school running out of one Instagram page',
            p: [
              'Jamile teaches everyone from kids to adults who need English for work or travel, in groups of about 10 and one-on-one. Almost all of her students found her on Instagram, and every conversation happened in her DMs or on WhatsApp. She was doing all her marketing herself, so the branding she tried never really stuck, and she spent hours answering the same questions.',
              'Her goal was to reach more adults learning English for their careers, so whatever we built had to feel grown-up.',
            ],
            media: { img: '/assets/bloomin/instagram-dms.webp', w: 2800, h: 2890, alt: 'Her old Instagram profile in yellow and red next to a list of blurred DMs asking the same questions' },
          },
          {
            h: 'The same six questions, over and over',
            p: 'Jamile let me go through about 40 of her DM and WhatsApp conversations, and the same six questions kept coming up.',
            after: 'These became the backbone of the landing page.',
            media: { img: '/assets/bloomin/six-questions.webp', w: 2400, h: 2402, alt: 'The six questions as message bubbles, surrounded by blurred repeats of the same questions' },
          },
          {
            h: 'Every other school was shouting',
            p: 'We also looked at other English schools, and most of them used loud, saturated colors that were exhausting to look at. That showed us where not to go.',
            media: { img: '/assets/bloomin/competitors.webp', w: 3200, h: 2000, alt: 'Six blurred competitor sites in loud, saturated colors around the calm Bloomin hero' },
          },
        ],
      },
      {
        id: 'cs-design',
        label: 'Design',
        rows: [
          {
            h: 'A name you can grow into',
            p: 'Our first idea was Fluency On, as in online and on time. But it felt generic, and I couldn’t picture a visual identity that would make it stand out. Jamile’s whole goal is for her students to bloom into their English, to stop being shy and grow into their confidence. Bloomin’ felt right to both of us, and it gave me a lot to work with visually.',
          },
          {
            h: 'Yellow says slow down, red says stop',
            p: [
              'Jamile loves yellow and red, so that’s where we started. But red and yellow fight each other on screen, and they signal caution and stop, not “grow.” I walked her through it from her students’ point of view. If you’re an adult deciding whether to trust a teacher with your career, you don’t want to feel overwhelmed the second the page loads.',
              'So we went the other way, with one strong color, a deep burgundy pink, only for accents and actions, and soft lilacs for the calmer parts of the page. It still feels like spring, just more grown-up. Once Jamile saw the reasoning, it didn’t take much convincing.',
            ],
            media: { img: '/assets/bloomin/palettes.webp', w: 2400, h: 1216, caps: ['Yellow and red', 'Yellow and blue', 'Burgundy and lilac'], alt: 'Three palettes side by side: yellow and red, yellow and blue, and burgundy with soft lilacs' },
          },
          {
            h: 'A bloom for every course level',
            p: 'I used Geist for type, plum for actions, cream and pink for everything else, and a bloom illustration for each course level.',
            wide: true,
            media: { video: '/assets/bloomin/design-system.mp4', cut: { vw: 1400, vh: 860, x: 36, y: 36, w: 1328, h: 788, radius: 21, full: true, blend: true, track: [[0, 36, 36, 1328, 788]] }, alt: 'The Bloomin design system: Geist type, logo, buttons, plum, cream and pink colors sliding across, and one bloom illustration per course level' },
          },
          {
            h: 'A website that answers the DMs for her',
            p: 'Jamile wrote short answers to each of the six questions, and I ordered the page to answer them in the order people ask them. It goes from how to start, to the courses, who she is, and how classes work, then testimonials and an FAQ. From anywhere on the page, you’re one tap away from messaging her on WhatsApp.',
            wide: true,
            media: { img: '/assets/bloomin/questions-map.webp', w: 2929, h: 1997, alt: 'The six questions on the left, connected by lines to the page sections that answer them on the right' },
          },
          {
            h: 'One headline, one button',
            p: 'I wanted the hero to be fun but still feel serious. My first idea was a flower drawing itself as you scroll, but it felt too plain. My second was flowers popping out when you hover over the letters, but that pulled attention away from the one thing the hero needs you to do, which is book a trial class. I landed on Bloomin’ in big letters with flowers that sway a little when you hover, like a breeze is passing, right next to the course and the trial class button.',
            wide: true,
            media: { frame: '/assets/bloomin/hero-ideas.html', w: 1800, h: 1590, cap: 'Live prototypes I built so Jamile could compare', alt: 'Three live hero prototypes: a flower that draws itself on scroll, flowers that pop out when you hover the letters, and the final hero, where flowers sway on hover' },
          },
          {
            h: 'Nobody reads 30 testimonials',
            p: 'Jamile had about 30 great testimonials, but nobody reads 30 reviews before signing up for a course. In V1, I cut them to 15 and kept them full length. For V2, since people mostly want to know whether they can trust the teacher, I pulled the strongest line from each one to the top so they’re easy to skim, and kept the best 6.',
            compare: true,
            media: [
              { img: '/assets/bloomin/testimonial-full.webp', w: 2640, h: 1656, cap: 'Before', alt: 'A testimonial shown at full length as one long paragraph' },
              { img: '/assets/bloomin/testimonial-quote.webp', w: 2640, h: 1624, cap: 'After', alt: 'The same testimonial with its strongest line as a large headline quote and a Read more link' },
            ],
          },
        ],
      },
      {
        id: 'cs-build',
        label: 'How I built it',
        rows: [
          {
            h: 'Prototypes she could click, petals you have to earn',
            p: [
              'I built the site in React, mobile first. I used Claude Code to spin up working versions of ideas like the hero options, so Jamile could click through real versions instead of picturing them from static mockups. It made our feedback sessions a lot faster and more concrete.',
              'For the petals, tapping the WhatsApp button saves a small flag in the browser. When someone comes back to the site, like after sending Jamile a message, the petals fall. It’s a little reward for taking the one step the whole page is designed around.',
            ],
          },
        ],
      },
      {
        id: 'cs-reflection',
        label: 'Reflection',
        rows: [
          {
            h: 'I’d explore the brand longer up front',
            p: 'We kept backtracking, deciding on something and then realizing weeks later it didn’t work. More exploration early on would have saved us those loops.',
          },
          {
            h: 'Clients need a designer with a point of view',
            p: 'Clients without branding experience often come in with specific ideas, like Jamile’s yellow and red, that aren’t what’s best for their brand. I learned my job isn’t just executing those ideas, it’s explaining my reasoning clearly enough that they trust it.',
          },
          {
            h: 'A landing page gave me room to be expressive',
            p: 'This was my first time doing branding at a professional level. Most of my projects are platforms, where everything has to be as efficient as possible, so a landing page gave me more room to play.',
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
    tldr: 'Bloomin’ is the learning platform for Professora Jamile’s online English school. Students take lessons, practice, turn in homework, and see how they’re doing, and Jamile runs her classes and keeps track of everyone in the same place.',
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
            p: 'Classes were on Meet, homework was on WhatsApp or Forms, and recordings were on YouTube or Drive, so finding the right material for homework took forever. Jamile was also tracking everything by hand, and since she wants to grow the school, that wasn’t going to work for much longer.',
            media: { img: '/assets/bloomin-platform/five-apps.webp', w: 2800, h: 1670, alt: 'Meet, WhatsApp, Drive, YouTube, and Forms all pointing at Ana, a B1 student with five apps to open before class' },
          },
          {
            h: 'Students needed today’s task. Jamile needed to know who was slipping.',
            quote: 'I just want to open it and see what I should do today.',
            cite: 'Maria Eduarda, preparing to move abroad',
            avatar: false,
            p: 'I had Jamile and three students at different levels walk me through a normal session. Jamile needed to see who needed her attention, share materials, take attendance, and correct homework. Students mostly wanted to know what to do today and whether they were actually getting better. So that became my rule for every page. Whatever helps you figure out what to do next goes up front, and everything else is one click away.',
            wide: true,
            media: { live: 'mistake-journey', alt: 'One “She work” mistake traveling from Corrections to Practice to Progress to Bruno’s profile to Today' },
          },
        ],
      },
      {
        id: 'cs-design',
        label: 'Design',
        rows: [
          {
            h: 'A red mark becomes a lesson',
            p: 'When Jamile tags “She work” as a grammar mistake, it turns into a drill on that student’s practice page, signed “Da Prof. Jamile.” When the student practices it, their progress moves, and Jamile can see that change on her side too.',
            wide: true,
            media: { frame: '/assets/tag-to-drill/Bloomin%20Tag%20to%20Drill.dc.html', w: 1920, h: 1080, demo: true, phoneFrame: { src: '/assets/tag-to-drill/Bloomin%20Tag%20to%20Drill%20Phone.dc.html', w: 430, h: 770 }, stillVideo: '/assets/bloomin-platform/tag-to-drill.mp4', alt: 'Tagging “She work” as grammar, then the same mistake showing up as a drill on the student’s practice page' },
          },
          {
            h: 'When every column speaks at the same volume, nothing is urgent',
            p: 'Tarefas (homework) really only has one job, which is showing what’s late, what’s due this week, and what can wait. A student should know what to do tonight, and Jamile should be able to look at the same list and see who’s falling behind. It took me four layouts to get there, and each one got the hierarchy wrong in a different way.',
            compare: true,
            media: [
              { img: '/assets/bloomin-platform/tarefas-uppercase.webp', w: 2240, h: 1120, caps: [{ l: 'Uppercase labels', d: 'The uppercase group labels were louder than the homework under them, and every row repeated “B1” even though students already know their level.' }], alt: 'Tarefas as cards under uppercase group labels' },
              { img: '/assets/bloomin-platform/tarefas-2.webp', w: 1120, h: 484, caps: [{ l: 'Sentence case', d: 'The labels were softer, but I gave every due date the same rose pill, so “Vence em 7 dias” looked just as urgent as “Atrasada há 3 dias.”' }], alt: 'Tarefas as cards under sentence-case labels, with rose pills' },
              { img: '/assets/bloomin-platform/tarefas-table.webp', w: 2240, h: 1120, caps: [{ l: 'A table', d: 'Every column got the same pill, so “Gramática” looked as important as “Atrasada · 3 dias.” And with Começar and Abrir on every row, there wasn’t one clear thing to do.' }], alt: 'Tarefas as a table with type, status and action columns' },
              { img: '/assets/bloomin-platform/tarefas-tiles.webp', w: 2240, h: 1120, caps: [{ l: 'Date tiles', d: 'The due date sits on the left and only turns rose when it’s late, so you can scan down one edge and know your week. The type and date share one quiet line, and the only filled button is on overdue work.' }], alt: 'Tarefas as a list with a calendar tile for each due date' },
            ],
          },
          {
            h: 'Seat counts don’t help you teach tonight',
            p: [
              'Jamile’s first dashboard was all business numbers, like students, occupancy, and open seats. When I talked to her, she said they didn’t help her day to day. She just wanted to see what was next. So we moved the analytics to Alunos, which costs her one extra click, but she doesn’t need them to get through the day.',
              'Hoje starts with her next class and, right next to it, her corrections. Because of tag-to-drill, every correction becomes practice for a student, so if they pile up, students think they’re done when more is on the way. Getting them back before class means students bring their questions to that class instead of waiting a week.',
              'Below that is what to handle before class, like reminding three students about the Essay, and then who’s drifting, like Ana Maria at 75% attendance.',
            ],
            compare: true,
            media: [
              { img: '/assets/bloomin-platform/hoje-before.webp', w: 2400, h: 2400, cap: 'Before, Painel built around seats and occupancy', alt: 'Painel: student, class, open-seat and occupancy counts, classes with seat-capacity dots, recent activity, shortcuts and the week’s agenda, with pending corrections in a footnote' },
              { img: '/assets/bloomin-platform/hoje-after.webp', w: 2400, h: 2400, cap: 'After, Hoje built around the next class', alt: 'Hoje: the next class and pending corrections, weekly attendance and on-time rates, what to handle before class, then students who need attention' },
            ],
          },
          {
            h: 'The mascot that barely shows up',
            p: 'Jamile’s biggest worry was keeping students practicing, and a mascot can build the kind of warmth Duo does for Duolingo. My first instinct was to put Bloom everywhere, but an animated character on every page gets noisy, and honestly a little childish for adults learning English for work. So she only shows up at key moments, like your home page, your progress, finishing a game, and clearing your notifications. She can droop for a second when you miss an answer, but never because of your level.',
            media: { img: '/assets/bloomin-platform/bloom-growing.webp', w: 492, h: 600, small: true, alt: 'Bloom growing from a seed to full bloom, A1 to C2' },
          },
          {
            h: 'Twenty minutes of setup, down to ninety seconds',
            p: 'Setting up a new student used to take 20 minutes across all of Jamile’s apps. Now you open her invite, pick a daily goal, and you’re already in your first lesson. With the 10 students testing it so far, setup takes about 90 seconds.',
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
            p: 'The less Bloom shows up, the more each appearance means, and I realized the same thing was true for color, motion, and filled buttons.',
          },
          {
            h: 'Sometimes the problem is the layout, not the details',
            p: 'Grading went through a bunch of rounds of small fixes before I realized the layout itself was the problem. Now when something still feels off after a couple of tries, I stop tweaking and ask whether the structure actually fits what the page is for.',
          },
          {
            h: 'Adding contracts and exams without making it heavy',
            p: 'Bloomin’ is still a work in progress. Next, we’re adding a way for students to sign their contracts in the platform and find them in their profile, and eventually exams too. The hard part will be fitting all of that in without making the platform feel heavy, especially for students who just want to open it and see what to do today.',
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
  { id: 'about-radio', slug: 'radio', short: 'On WKCR', cap: 'On WKCR, aka making people listen to my playlists', ph: 'Photo: doing radio' },
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
