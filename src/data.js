// Drop a 16:9 mp4/webm and matching poster into public/ and set `video` / `poster` to show it on the card.
// `zoom` scales the video past black bars baked into the file (e.g. 1.16 for a 1920×936 picture inside 1920×1080).
// A `#t=<seconds>` on `video` picks the frame the card rests on before it plays.
export const PROJECTS = [
  { key: 'plate', slug: 'platepal', name: 'PlatePal', line: 'Meal picks that fit your goals at every Columbia dining hall.', meta: 'Product design · Frontend · 2025', outcome: '93% of testers rated it 5 out of 5', tags: ['0→1'], video: '/assets/platepal/cover.mp4#t=8', poster: '', zoom: 1.16 },
  { key: 'platform', slug: 'bloomin/platform', name: "Bloomin' platform", line: 'One place for an English school to grow.', meta: 'Product design · Frontend · 2025', outcome: '20 min → 90 sec student setup', tags: ['In testing'], video: '/assets/bloomin-platform/cover-teacher-hd.mp4#t=2', fit: '#f5f5f5', framed: true, poster: '' },
  { key: 'bloomin', slug: 'bloomin', name: "Bloomin'", line: 'An English school that grew out of an Instagram page.', meta: 'Branding · Web · 2025', outcome: '20% more enrolled students', tags: ['0→1', 'Branding', 'Shipped'], video: '/assets/bloomin/logo-bloom.mp4#t=2.8', poster: '' },
  { key: 'dicio', slug: 'diciobase', name: 'Diciobase', line: "Brazil's dictionaries, one search.", meta: 'Product design · Frontend · 2026', outcome: '23→1 steps per lookup', tags: ['Shipping 2026'], video: '', poster: '', soon: true },
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
    tldr: 'PlatePal recommends meals across Columbia’s 12+ dining halls based on each student’s goals, with macros shown for every pick. Students can also photograph their plate to estimate its macros and log it, like MyFitnessPal built for Columbia dining.',
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
            p: 'We surveyed 12 students, then followed two of them through an entire meal, from choosing a hall to sitting down to eat. The 2 main websites we saw coming up were Lion Dine (student-built but no nutritional information or personalized recommendations) and the Columbia Dining website which also just displayed the menu of the day. So students with specific goals were left guessing.',
          },
          {
            h: 'Most students had a goal and no way to hit it',
            p: 'Our affinity map revealed three types of diners. Goal-driven students (58%) cared most about what they ate and were hit hardest by the missing nutrition data, so they became my primary user. Convenience-driven students (25%) went to the nearest hall, and habit-based students (17%) returned to the same one regardless of the menu. I designed for goal-driven students first, while keeping the app fast for everyone else.',
            media: { img: '/assets/platepal/motivation.png', w: 1152, h: 400, alt: 'Three types of diners: 58% goal-driven, 25% convenience, 17% habit' },
          },
          {
            h: 'Our first prototype was a text message',
            p: 'We ran a smoke-and-mirrors test, manually texting participants personalized meal picks three times a day, the way the app eventually would. Two patterns emerged. Messages that referenced participants’ own preferences performed noticeably better than generic ones, and longer messages often went unread. That became my standard for every screen: if a student would wonder why something is there, it goes.',
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
              'Participants liked being told what to eat, especially on busy weekdays. So the plate of the day sits at the top of the home screen, built from each student’s macros, preferences, and favorited meals.',
              'However, it was also very important that this extra element wouldnt come across as friction for the user, so I came up with a few different ways of showing it.',
            ],
            wide: true,
            media: { img: '/assets/platepal/plate-explorations-hd.webp', w: 3200, h: 1265, caps: [
                { l: 'Too much', d: 'Answered every question, but read like the long texts participants ignored.' },
                { l: 'Too easy to miss', d: 'Easy to skim, but it hid the numbers.' },
                { l: 'Too many choices', d: 'Brought back the decision students wanted to skip.' },
                { l: 'Just enough', d: 'One meal, where and when it’s served, calories and protein, one tap to add or dismiss.' },
              ], alt: 'Four versions of the plate of the day: a full nutrition card, a slim Suggested banner, a row of three options, and the final card with one meal' },
          },
          {
            h: 'No mystery meals',
            p: 'Students also wanted numbers they could see for themselves. So we split the work in two: Llama 3 builds each recommended plate from the day’s menus and the student’s profile, and an estimation layer on USDA FoodData Central supplies the macros for every dish. Every suggestion shows its numbers.',
            wide: true,
            media: { img: '/assets/platepal/macro-pipeline-hd.webp', w: 3200, h: 1126, alt: 'Student profile plus today’s menus go to Llama 3, which picks the plate; USDA FoodData Central supplies the macros; the result is a meal card with calories, protein, carbs and fat' },
          },
          {
            h: 'Seven questions on one screen was six too many',
            p: [
              'Version one asked for everything on a single screen: name, photo, calorie target, macro split, restrictions, allergens, and dining halls. When I tested it, everyone said it felt like homework standing between them and dinner.',
              'So I split it into three quick steps. Dining halls come first, since it’s the easiest choice and tailors everything after it. Restrictions and allergens share a step. Then students pick a calorie goal and PlatePal does the macro math, so no one has to figure out what 30/40/30 means for them.',
            ],
            media: { video: '/assets/platepal/onboarding-before-after.mp4', cut: { mask: '/assets/platepal/onboarding-mask.svg', vw: 1920, vh: 1080, x: 533, y: 106, w: 854, h: 868, width: '98%' }, caps: ['Before', 'After'], alt: 'Before and after: single-page onboarding next to the three new steps for dining halls, restrictions and allergens, and a calorie goal' },
          },
          {
            h: 'Settings is just onboarding, again, on purpose',
            p: 'My first Settings page put every goal and preference in one place. Students could change anything, but there was so much on the page that managing their account felt overwhelming. Since Settings covers the same ground as onboarding, I rebuilt it from the onboarding screens, so it’s shorter and already familiar. I also replaced the calorie and macro sliders with plus and minus steppers, because sliders make precise values hard to hit on a phone.',
            beside: true,
            media: [
              { img: '/assets/platepal/settings-before-phone.webp', w: 1400, h: 2917, caps: ['Before'], alt: 'A long Settings page with sliders for calories and macros' },
              { img: '/assets/platepal/settings-after-phone.webp', w: 1400, h: 2917, caps: ['After'], alt: 'A shorter Settings screen rebuilt from onboarding, with plus and minus steppers' },
            ],
          },
          {
            h: 'Your camera is the new food scale',
            p: 'Estimating what’s on a plate is tedious and error-prone. With PlatePal, students take a photo, the app estimates its macros using USDA data, and the meal is added to their daily totals.',
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
            p: 'My first home screen gave every dining hall a big photo but finding a specific hall meant scrolling past all twelve. My next version added a compact toggle, but PlatePal is about getting students to dinner with as little friction as possible, and a picture of a dining hall doesn’t really help anyone decide what to eat. So the photos went, and the halls moved to their own tab: a compact list of what’s open, until when, and what’s on tonight, with search and favorites for the halls students actually go to.',
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
        rows: [{
          p: [
              'Honestly the onboarding was a really big learning experience, specially using the results from our Smoke and Mirrors testing. College students, specially with our short attention spans, hate reading or completing long things. So onboarding had to be as seamless as possible so we don`t lose people before they even start using Plate Pal',
              'The biggest open question is accuracy. Without official data from Columbia Dining, every number in PlatePal is an estimate, and students tracking specific goals deserve to know that. Next, I’d pursue a data partnership with Dining Services, label estimates clearly in the app, and let students flag numbers that look wrong, so the data improves as more people use it.',
          ],
        }],
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
    tldr: 'At the FORMAS lab, linguists were spending hours checking dictionaries one by one before they could even start their research. So I designed and built Diciobase, one search across all of them. In testing, a lookup that used to take a whole morning took four minutes.',
    stats: [
      { v: '4 min', l: 'per lookup, down from a whole morning' },
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
            p: 'One lookup took 23 steps, with a different site and login for every dictionary. The data was all there, people just couldn’t get to it easily.',
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
              { lead: 'Calm screens feel easier to use.', text: 'When I was doing market research on other dictionary sites, what stuck with me the most was how overstimulating they were. Ads everywhere, quizzes, games, word of the day, all pulling me away from the word I actually came for. I still wanted people to explore, so I kept it close to the search, with related words on every entry and suggested words on the home page.' },
              { lead: 'People learn by using.', text: 'Most people skip tutorials and just jump straight in, so instead of making them sit through one, the app teaches them as they go.' },
              { lead: 'One dictionary at a time.', text: 'Each entry is already a lot of information, so showing more than one at a time would bring back the exact overload I was trying to get rid of.' },
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
            h: 'Five animations that tell you where you are',
            p: 'I gave every type of move its own motion. Going deeper slides in from the right, switching sections slides sideways, and going from word to word is a soft rise. I wanted people to always know what kind of move they just made, without having to think about it.',
            media: { todo: 'Search, open a word, go back' },
          },
          {
            h: 'Why Diciobase never asks “are you sure?”',
            p: 'I had to decide between an “are you sure?” pop-up and an undo. Removing a word isn’t a big deal and it’s easy to fix, so a pop-up would just slow everyone down to protect against a mistake that rarely happens. So instead, you get a toast with “Desfazer” that puts the word right back where it was.',
            media: { todo: 'Remove a word from Salvos, then undo' },
          },
          {
            h: 'The tutorial nobody has to sit through',
            p: 'Tips only show up once, point at exactly what they’re explaining, and never block the page. I capped them at two per visit so nobody gets the whole tour at once, and you can always turn them off or back on in Perfil.',
            media: { todo: 'First visit, with tips pointing at the search bar' },
          },
          {
            h: 'The sign-up page that made people leave',
            p: 'At first, saving a word took you to a separate sign-up page. When we tested it, a lot of people dropped off right there because it broke their flow. So I made sign-up a pop-up instead, and as soon as you’re done, your word is saved.',
            compare: true,
            media: [
              { todo: 'Separate sign-up page', cap: 'Before' },
              { todo: 'Sign-up pop-up', cap: 'After' },
            ],
          },
          {
            h: 'Three things I took out',
            bullets: [
              { lead: 'The busy globe.', text: 'My first globe was covered in tiny Portuguese words and a location dot. But the whole point of the hero is to make you want to search, so I turned it into a quiet backdrop behind the search bar.' },
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
            p: 'I still wanted it to look academic, so I started from Helvetica, tightened the spacing, and rounded the corners. Since we were planning on reaching people outside of linguistics too, I wanted it to feel a little more inviting.',
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
            p: 'Every dictionary we add makes “one at a time” harder to keep. If I start seeing people flip back and forth between the same two tabs, that’s when I’d bring the compare feature back, starting small with just two entries side by side, only when you ask for it.',
          },
          {
            h: 'Experts and beginners need the same product',
            p: 'Diciobase was my first time designing for academia, and I learned so much by talking to such different people. I think my biggest takeaway was that experts and beginners don’t necessarily need different products, they just need different amounts of help. A linguist never has to open the “i” explainers, but a student can learn what Etimologia means without ever leaving the page.',
          },
        ],
      },
    ],
  },
  bloomin: {
    lede: 'Growing an online English school out of an Instagram page.',
    meta: [
      { l: 'Role', v: 'Brand designer, product designer and developer' },
      { l: 'Client', v: 'Professora Jamile Oliveira' },
      { l: 'Timeline', v: 'January 2025 – March 2026' },
      { l: 'Tools', v: 'Figma, React, Claude Code' },
    ],
    hero: { video: '/assets/bloomin/logo-bloom.mp4', alt: 'The Bloomin’ wordmark, its O’s blooming into flowers as petals fall' },
    tldr: 'Jamile runs an online English school, and before Bloomin’ all she had was an Instagram page. No name, no logo, no website. I designed the brand identity and built a mobile-first landing page that answers the questions she used to answer one by one in her DMs. Since launch, enrollment is up 20%, and she barely gets asked about prices anymore. Now I’m designing the platform her students use for homework and practice games.',
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
              'Jamile teaches everyone from kids to adults who need English for work, travel, or starting from zero, in groups of about 10 and one-on-one. Almost all of her students found her on Instagram, and every conversation happened in her DMs or on WhatsApp. She was doing all her marketing herself, so the branding she’d tried never stuck, and she spent hours answering the same questions about her courses.',
              'Her goal was clear: she wanted to reach more adults learning English for their careers. So whatever we built had to feel grown-up.',
            ],
            media: { img: '/assets/bloomin/instagram-dms.webp', w: 2800, h: 2890, alt: 'Her old Instagram profile in yellow and red next to a list of blurred DMs asking the same questions' },
          },
          {
            h: 'The same six questions, over and over',
            p: 'Jamile let me go through about 40 conversations from her DMs and WhatsApp, and the same questions kept coming up:',
            after: 'These became the backbone of the landing page.',
            media: { img: '/assets/bloomin/six-questions.webp', w: 2400, h: 2402, alt: 'The six questions as message bubbles, surrounded by blurred repeats of the same questions' },
          },
          {
            h: 'Every other school was shouting',
            p: 'We also looked at other English schools, and most of them used loud, saturated colors that were exhausting to look at. That told us where not to go.',
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
            p: 'Our first idea was Fluency On, as in online and on time. But it felt generic, and I couldn’t picture a visual identity that would make it stand out. Jamile’s whole goal is for her students to bloom into their English: to stop being shy and grow into their confidence. Bloomin’ felt right to both of us, and it gave me a lot to work with visually.',
          },
          {
            h: 'Yellow says slow down, red says stop',
            p: [
              'Jamile loves yellow and red, so that’s where we started. But red and yellow fight each other on screen, and they signal opposite things: caution and stop. Neither says “grow.” I walked her through it from her students’ point of view: if you’re an adult deciding whether to trust a teacher with your career, you don’t want to feel overwhelmed the second the page loads.',
              'So we went the other way: one strong color, a deep burgundy pink, used only for accents and actions, with soft lilacs for the calmer parts of the page. It still feels like spring, but grown-up. Once Jamile saw the reasoning, it didn’t take much convincing.',
            ],
            media: { img: '/assets/bloomin/palettes.webp', w: 2400, h: 1216, caps: ['Yellow and red', 'Yellow and blue', 'Burgundy and lilac'], alt: 'Three palettes side by side: yellow and red, yellow and blue, and burgundy with soft lilacs' },
          },
          
          {
            h: 'The design system',
            wide: true,
            media: { video: '/assets/bloomin/design-system.mp4', cut: { vw: 1400, vh: 860, x: 36, y: 36, w: 1328, h: 788, radius: 21, full: true, blend: true, track: [[0, 36, 36, 1328, 788]] }, alt: 'The Bloomin design system: Geist type, logo, buttons, plum, cream and pink colors sliding across, and one bloom illustration per course level' },
          },
          {
            h: 'A website that answers the DMs for her',
            p: 'Jamile wrote short answers to each of the six questions, and I ordered the page to answer them in the order people ask: how to start, the courses, who she is, how classes work, then testimonials and an FAQ. From anywhere on the page, you’re one tap away from messaging her on WhatsApp.',
            wide: true,
            media: { img: '/assets/bloomin/questions-map.webp', w: 2929, h: 1997, alt: 'The six questions on the left, connected by lines to the page sections that answer them on the right' },
          },
          {
            h: 'One headline, one button',
            p: 'I wanted animation in the hero: something fun that still felt serious. My first idea was a flower drawing itself as you scroll, but the hero felt too plain. My second was flowers popping out when you hover over the letters, but that pulled attention away from the one thing the hero needs you to do: book a trial class. I landed on Bloomin’ in big letters, with flowers that sway slightly when you hover, as if a breeze is passing, right next to what the course is and the trial class button.',
            wide: true,
            media: { frame: '/assets/bloomin/hero-ideas.html', w: 1800, h: 1590, cap: 'Live prototypes I built so Jamile could compare', alt: 'Three live hero prototypes: a flower that draws itself on scroll, flowers that pop out when you hover the letters, and the final hero, where flowers sway on hover' },
          },
          {
            h: 'Nobody reads 30 testimonials',
            p: 'Jamile had about 30 great testimonials. I believe in quality over quantity: nobody reads 30 reviews before signing up for a course. In V1, I cut them to 15 and kept them full-length. For V2, since people mostly want to know whether they can trust the teacher, I pulled the strongest line from each to the top so they’re skimmable, and cut the 15 down to 6.',
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
            p: [
              'I built the site in React, mobile first. To speed up our workshops, I used Claude Code to spin up working versions of different ideas, like the hero options, so Jamile could click through real versions instead of picturing them from static mockups. It made our feedback sessions faster and more concrete, and kept the decisions anchored in what felt right.',
              'For the petals, tapping the WhatsApp button saves a small flag in the browser. When someone comes back to the site, like hitting back after sending Jamile a message, the site checks for that flag and the petals fall. It’s a small reward for taking the step the whole page is designed around.',
            ],
          },
        ],
      },
      {
        id: 'cs-reflection',
        label: 'Reflection',
        rows: [
          {
            h: 'What it changed',
            bullets: [
              { lead: '20% more enrolled students', text: 'since the site launched.' },
              { lead: 'Price questions basically stopped.', text: 'Jamile says she barely gets asked about pricing anymore, because the site answers it first.' },
            ],
          },
          {
            h: 'What I learned',
            p: [
              { lead: 'I’d spend more time on the brand up front.', text: 'We kept backtracking: deciding on something, then realizing weeks later it didn’t work. More exploration early would have saved us those loops.' },
              { lead: 'Clients need a designer with a point of view.', text: 'Clients without branding experience often come in with specific ideas, like Jamile’s yellow and red, that aren’t what’s best for their brand. I learned that my job isn’t just executing those ideas. It’s explaining my reasoning clearly enough that the client trusts it.' },
              'This was also my first time doing branding at a professional level. Most of my projects are platforms, where everything has to be as efficient as possible. A landing page still has to be easy to use, but it gave me room to be expressive.',
            ],
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
    tldr: 'Bloomin’ is a learning platform for Professora Jamile’s online English school. Students take lessons, practice, turn in homework, and see their progress, and Jamile runs her classes, grades, and keeps track of everyone, all in one place. Before Bloomin’, all of that was spread across five different apps.',
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
            p: 'The main problem was that everything was scattered. Classes were on Meet, homework on WhatsApp or Forms, and recordings on YouTube or Drive, so the process of finding specific material a student might need for homework was very difficult. Jamile was tracking everything by hand, since she had plans to expand, there was no way to continue managing the school this way.',
            media: { img: '/assets/bloomin-platform/five-apps.webp', w: 2800, h: 1670, alt: 'Meet, WhatsApp, Drive, YouTube, and Forms all pointing at Ana, a B1 student with five apps to open before class' },
          },
          {
            h: 'Students wanted to know what to do today.',
            quote: 'I just want to open it and see what I should do today.',
            cite: 'Maria Eduarda, preparing to move abroad',
            avatar: false,
            p: 'I asked Jamile and three students at different levels to walk me through a session. Jamile needed to see who needed her attention, submit her materials, check attendance, correct homework. Students needed to know what to do today, and whether they were getting any better. That became my rule for every page: whatever helps you know what to do next goes up front, and everything else is one click away.',
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
            p: 'Jamile tags “She work” as grammar. Here’s where that tag goes next. It turns into a drill on the student’s practice page, signed “Da Prof. Jamile.” Practicing it moves the student’s progress, and Jamile sees that change on her side.',
            wide: true,
            media: { frame: '/assets/tag-to-drill/Bloomin%20Tag%20to%20Drill.dc.html', w: 1920, h: 1080, demo: true, phoneFrame: { src: '/assets/tag-to-drill/Bloomin%20Tag%20to%20Drill%20Phone.dc.html', w: 430, h: 770 }, stillVideo: '/assets/bloomin-platform/tag-to-drill.mp4', alt: 'Tagging “She work” as grammar, then the same mistake showing up as a drill on the student’s practice page' },
          },
          {
            h: 'When every column speaks at the same volume, nothing is urgent',
            p: 'Tarefas (homework) has one job: tell you what’s late, what’s due this week, and what can wait. A student should know what to do tonight, and Jamile should be able to look at the same list and see who’s falling behind. Getting there took four layouts, and each one failed at hierarchy in a different way.',
            compare: true,
            media: [
              { img: '/assets/bloomin-platform/tarefas-uppercase.webp', w: 2240, h: 1120, caps: [{ l: 'Uppercase labels', d: 'The tracked, uppercase group labels were louder than the homework under them, and every row repeated the same “B1” the student already knew.' }], alt: 'Tarefas as cards under uppercase group labels' },
              { img: '/assets/bloomin-platform/tarefas-2.webp', w: 1120, h: 484, caps: [{ l: 'Sentence case', d: 'Softer labels, but I gave every due date a rose pill, so “Vence em 7 dias” looked as urgent as “Atrasada há 3 dias.” When everything is highlighted, nothing is.' }], alt: 'Tarefas as cards under sentence-case labels, with rose pills' },
              { img: '/assets/bloomin-platform/tarefas-table.webp', w: 2240, h: 1120, caps: [{ l: 'A table', d: 'A column for the type, a column for the status, and a button on every row. Every column got the same pill treatment, so “Gramática” weighed as much as “Atrasada · 3 dias,” and with Começar and Abrir stacked down the page, there was no single thing to do.' }], alt: 'Tarefas as a table with type, status and action columns' },
              { img: '/assets/bloomin-platform/tarefas-tiles.webp', w: 2240, h: 1120, caps: [{ l: 'Date tiles', d: 'The due date became the anchor on the left, in rose only when it’s late, so you can scan one edge and know your week. Type and due date moved into one quiet line under the title, and the only filled button sits on the work that’s overdue.' }], alt: 'Tarefas as a list with a calendar tile for each due date' },
            ],
          },
          {
            h: 'Same 75%, opposite meaning',
            p: 'When a student sees 75% attendance, it should make them want to show up more. When Jamile sees it, she has to act. So instead of reusing the student pages, I gave her a home of her own. So her next class comes first, then what she has to deal with before it, like three students who haven’t turned in homework, then students falling behind, with a message ready to send. I took “Corrigir agora” (Correct now) off the page, because corrections can wait and the sidebar already counts them.',
            compare: true,
            media: [
              { img: '/assets/bloomin-platform/hoje-before.webp', w: 2400, h: 2400, cap: 'Before: Jamile’s v1 dashboard with seat-capacity dots', alt: 'Painel: student counts, classes with seat-capacity dots, recent activity and the week’s agenda' },
              { img: '/assets/bloomin-platform/hoje-after.webp', w: 2400, h: 2400, cap: 'After: Hoje, sorted by what can’t wait', alt: 'Hoje: the next class first, then what to deal with before it, then students who need attention' },
            ],
          },
          {
            h: 'The mascot that barely shows up',
            p: 'I drew Bloom first, because Jamile’s biggest worry was keeping students practicing, and a mascot builds the kind of warmth Duo does for Duolingo. My instinct was to put her everywhere. But she’s animated, and something moving on every page gets overwhelming and a little elementary, especially for adults learning English for work. So she only shows up in key moments: your home page, your progress, finishing a game, and clearing all your notifications. She can droop for a second when you miss an answer, but never because of your level.',
            media: { img: '/assets/bloomin-platform/bloom-growing.webp', w: 492, h: 600, small: true, alt: 'Bloom growing from a seed to full bloom, A1 to C2' },
          },
          {
            h: 'Twenty minutes to ninety seconds, no tutorial',
            p: 'Setting a student up used to take 20 minutes across all of Jamile’s apps. Now you open her invite, pick a daily goal, and you’re in your first lesson. Across the 10 students testing the platform so far, setup takes about 90 seconds.',
            media: { video: '/assets/bloomin-platform/onboarding.mp4', alt: 'Opening Jamile’s invite, setting a daily goal, and landing in the first lesson' },
          },
        ],
      },
      {
        id: 'cs-reflection',
        label: 'Reflection',
        rows: [{
          p: [
              { lead: 'A mascot works because it’s rare.', text: 'The less Bloom shows up, the more each appearance means, and that turned out to be true for color, motion, and buttons too.' },
              { lead: 'Check structure before polishing.', text: 'Grading went through rounds of small fixes before I realized the layout was the problem. Now when something still feels off after a couple of tries, I stop tweaking and ask whether the structure fits what the page is for.' },
          ],
        }],
      },
    ],
  },
};

// Each case study lives at /work/<slug> so the modal can be linked to directly.
export const casePath = (p) => `/work/${p.slug}`;

export const NAV = ['Work', 'About', 'Play'];

export const EXPERIENCE = [
  { id: 'logo-richemont', org: 'Richemont', role: 'Software engineering intern', when: 'JUN 2026–NOW', href: 'https://www.richemont.com' },
  { id: 'logo-bloomin', org: "Bloomin'", role: 'Founding product designer', when: 'JAN 2025–NOW', href: '#' },
  { id: 'logo-formas', org: 'FORMAS Research Lab, UFBA', role: 'Researcher and product designer', when: 'JUN 2025–MAY 2026', href: '#' },
];

export const THINGS = [
  { id: 'about-radio', cap: 'On WKCR, aka making people listen to my playlists', ph: 'Photo: doing radio' },
  { id: 'about-cats', cap: 'Every cat I meet is a friend I haven’t made yet', ph: 'Photo: with a cat' },
  { id: 'about-drawing', cap: 'Drawing with graphite', ph: 'Photo: drawing' },
  { id: 'about-sophia', cap: 'Proud cat auntie to Sophia', ph: 'Photo: Sophia' },
  { id: 'about-food', cap: 'Eating my way through the city', ph: 'Photo: food' },
  { id: 'about-colorstack', cap: 'Running ColorStack Columbia socials', ph: 'Photo: ColorStack' },
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
