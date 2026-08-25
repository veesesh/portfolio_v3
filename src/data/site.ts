export type SiteLink = {
  label: string;
  href: string;
  /**
   * Screenshot shown while hovering the link, relative to `public/`.
   * A link whose file is not there simply has no preview — see index.astro,
   * which checks the disk rather than trusting this to be accurate.
   */
  preview?: string;
};

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LifeSection = {
  title: string;
  eyebrow: string;
  note: string;
  /** Optional outbound link. The card renders without one when absent. */
  link?: SiteLink;
};

export const site = {
  name: "Vee",
  /** The wordmark expands from `name` to this on hover. */
  fullName: "Veesesh",
  aliasNote: "Hey, my real name is Veesesh but I also go by Vee. That's my alias",
  role: "Community and Operations, Devfolio",
  location: "Hyderabad / Bengaluru",
  email: "curiousvee19@gmail.com",
  /** The keyboard shortcut in the footer opens this. */
  telegram: { label: "Telegram", handle: "@vee19tel", href: "https://t.me/vee19tel" },
} as const;

/**
 * The hero copy.
 *
 * Split into fields rather than one marked-up string so the meta description
 * has something plain to read.
 */
const lead = "I do a bit of everything, and I\u2019m happiest figuring it out as I go.";

export const about = {
  greeting: "hey, nice to e-meet you!",
  lead,
  /**
   * Parked. The hover-reveal markup that used these was taken off the home page
   * on 26 Aug 2026 to be reworked later; the words are kept here so the copy
   * does not have to be written again. Nothing renders them today.
   */
  quoteLead: "As they say,",
  quoteOpen: "\u201cJack of all trades, master of none, but",
  quoteDots: "\u2026",
  quoteClose: "\u201d",
  cta: "there\u2019s more to that quote",
  rest: "oftentimes better than a master of one.",

  /** Split around the one link in it, so the description can stay plain text. */
  now: {
    before: "Currently having a good time at ",
    link: { label: "Devfolio", href: "https://devfolio.co" },
    after:
      ", trying to make the builder experience a little better. Outside work, I mostly try to catch up on sleep.",
  },
} as const;

/** The plain-text description. */
export const aboutPlain =
  `${about.greeting} ${lead} ` +
  `${about.now.before}${about.now.link.label}${about.now.after}`;

/**
 * Which page-heading treatment is live, site-wide.
 *
 * - `"a"` — headings keep their usual size, icons scale down to the caps.
 * - `"b"` — icons lead at 3× and the headings grow to meet them.
 *
 * Compare them side by side at /pixel-head-lab. Changing this one value swaps
 * every page heading at once, which is the point of it living here rather than
 * being spelled out four times.
 */
export const headingVariant: "a" | "b" = "b";

const allNavigation: readonly SiteLink[] = [
  { label: "build", href: "/build" },
  { label: "reading", href: "/reading" },
  { label: "listening", href: "/listening" },
  { label: "pictures", href: "/pictures" },
];

export const navigation: readonly SiteLink[] = allNavigation;

export const profileLinks: readonly SiteLink[] = [
  { label: "GitHub", href: "https://github.com/veesesh", preview: "/images/previews/github.png" },
  { label: "X (Twitter)", href: "https://x.com/vee19twt", preview: "/images/previews/x.png" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vee19/",
    preview: "/images/previews/linkedin.png",
  },
  { label: "Email", href: "mailto:curiousvee19@gmail.com" },
  {
    label: "Résumé",
    href: "https://drive.google.com/file/d/1RI-UVdS7dAdpau2HiPMdHZtdA3trkPKX/view?usp=sharing",
    preview: "/images/previews/resume.png",
  },
];

/** Public Spotify source; swapping the playlist only requires changing this URL. */
export const spotify = {
  playlistUrl: "https://open.spotify.com/playlist/2oqpUuxrELm2pkQItwKJuq",
  embedUrl: "https://open.spotify.com/embed/playlist/2oqpUuxrELm2pkQItwKJuq?utm_source=generator",
  title: "Vee's listening rotation",
} as const;

/** The non-work bits. Kept short on purpose — these are cards, not essays. */
export const lifeSections: readonly LifeSection[] = [
  {
    title: "Movies",
    eyebrow: "Cinephile, allegedly.",
    note: "I\u2019ll watch almost anything if it looks interesting. Still trying to become the kind of person who actually keeps Letterboxd updated.",
    link: { label: "Letterboxd", href: "https://letterboxd.com/veesesh/" },
  },
  {
    title: "Sports",
    eyebrow: "Off screen",
    note: "I used to play cricket and athletics professionally, now I just run metaphorically and literally. still a sportsman in spirit!",
  },
  {
    title: "Biryani",
    eyebrow: "Extremely serious business.",
    note: "I am unreasonably obsessed with biryani. Hyderabadi, obviously. I have opinions, rankings, favourite spots, and very little patience for bad biryani.",
  },
  {
    title: "Dream places",
    eyebrow: "Someday.",
    note: "The list is long, but Vienna has been sitting at the top for a while. Billy Joel may or may not have had something to do with that (also one of my favourite songs).",
    link: {
      label: "Vienna, Billy Joel",
      href: "https://www.youtube.com/watch?v=3jL4S4X97sQ",
    },
  },
];

/**
 * Newest first. The grid alternates two wide tiles with three narrow ones on a
 * five-tile cycle, so the order here also decides which photographs get the
 * large slots — worth a look after adding any.
 */
export const photos: readonly Photo[] = [
  {
    src: "/images/ethindia-organizers.jpg",
    alt: "The ETHIndia organizing team crowded in front of the main screen, badges on, at the end of the hackathon",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/team-lobby.jpg",
    alt: "The team together in the office lobby, everyone mid-pose",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/push-to-prod-team.jpg",
    alt: "The full Push to Prod team and volunteers gathered in two rows after the last session",
    width: 1800,
    height: 1202,
  },
  {
    src: "/images/ethindia-submissions.jpg",
    alt: "Announcing the project submissions from the ETHIndia stage, eighteen projects in",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/singapore-skyline.jpg",
    alt: "The crew in front of the Singapore skyline at Marina Bay after Push to Prod",
    width: 1800,
    height: 1014,
  },
  {
    src: "/images/push-to-prod-sg-stage.jpg",
    alt: "Closing out Push to Prod on stage at Temasek Shophouse in Singapore",
    width: 1800,
    height: 1350,
  },
  {
    src: "/images/sunset-crew.jpg",
    alt: "A sunset selfie with the crew by the water, event lanyards still on",
    width: 1800,
    height: 1350,
  },
  {
    src: "/images/train-to-the-event.jpg",
    alt: "A train compartment full of organizers on the way to an event, banners strung above the berth",
    width: 1800,
    height: 1350,
  },
  {
    src: "/images/community-meetup.jpg",
    alt: "The KnowShubhangi and Devfolio community meetup, everyone gathered beside the banner",
    width: 1800,
    height: 1350,
  },
  {
    src: "/images/community-talk.jpg",
    alt: "On stage mid-talk, in front of a wall of photographs from past community events",
    width: 1080,
    height: 624,
  },
  {
    src: "/images/interfaces-group.jpg",
    alt: "The whole room gathered on the auditorium stage at the end of Interfaces",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/vee-presenting.jpg",
    alt: "Vee presenting at Vibe with Hermes at the Devfolio office, the run of show on screen",
    width: 1280,
    height: 960,
  },
  {
    src: "/images/vibe-with-hermes.jpg",
    alt: "The room set up for Vibe with Hermes at the Devfolio office, under the never-stop-building wall art",
    width: 1800,
    height: 1202,
  },
  {
    src: "/images/push-to-prod-frame.jpg",
    alt: "Posing inside the oversized Push to Prod photo frame, the hackathon run with Claude, Elevation Capital and Mesa School",
    width: 1800,
    height: 1202,
  },
  {
    src: "/images/push-to-prod-floor.jpg",
    alt: "Helping a team at their laptop on the hackathon floor at Push to Prod in Singapore",
    width: 1800,
    height: 1202,
  },
  {
    src: "/images/studio-meetup.jpg",
    alt: "Four of us after a meetup in front of the studio's brick wall mural, camera still in hand",
    width: 1800,
    height: 1350,
  },
  {
    src: "/images/image-2.jpg",
    alt: "Vee speaking to a room of students at a community event",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/image-1.jpg",
    alt: "A large group of student builders gathered after an event",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/image-5.jpg",
    alt: "Community organizers gathered together at a conference",
    width: 1600,
    height: 732,
  },
  {
    src: "/images/image-7.jpg",
    alt: "CodeDay participants and organizers posing for a group photograph",
    width: 1500,
    height: 1000,
  },
  {
    src: "/images/image-6.jpg",
    alt: "An online community meetup with participants joining through video and Discord",
    width: 1800,
    height: 1186,
  },
  {
    src: "/images/image-9.jpg",
    alt: "The Hackerabad organizing team standing in front of the community logo",
    width: 1500,
    height: 1000,
  },
  {
    src: "/images/image-4.jpg",
    alt: "Hackathon participants celebrating together in a crowded group photograph",
    width: 1296,
    height: 864,
  },
  {
    src: "/images/image-10.jpg",
    alt: "A group of builders relaxing together after an event",
    width: 1800,
    height: 1350,
  },
  {
    src: "/images/image-8.jpg",
    alt: "A university developer community gathered onstage after a meetup",
    width: 1356,
    height: 764,
  },
];

/**
 * The four photographs on the home page.
 *
 * Declared outright rather than looked up in `photos`, because the strip and
 * the gallery are no longer the same set: the lounge shot belongs on the home
 * page but was pulled from the grid. Deriving one from the other forced a
 * choice between those two, so they are simply kept apart.
 *
 * Picked for contrast rather than recency — recency clusters, and three group
 * shots from the same fortnight read as one photograph repeated. These four
 * differ in setting, scale and light: a team mid-pose in an office lobby, a
 * train compartment at night, one person mid-sentence on stage, and
 * a hall with a hundred students in it.
 */
export const stripPhotos: readonly Photo[] = [
  {
    src: "/images/team-lobby.jpg",
    alt: "The team together in the office lobby, everyone mid-pose",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/train-to-the-event.jpg",
    alt: "A train compartment full of organizers on the way to an event, banners strung above the berth",
    width: 1800,
    height: 1350,
  },
  {
    src: "/images/ethindia-submissions.jpg",
    alt: "Announcing the project submissions from the ETHIndia stage, eighteen projects in",
    width: 1800,
    height: 1200,
  },
  {
    src: "/images/image-1.jpg",
    alt: "A large group of student builders gathered after an event",
    width: 1800,
    height: 1200,
  },
];
