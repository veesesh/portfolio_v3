export type SiteLink = {
  label: string;
  href: string;
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
};

export const site = {
  name: "Vee",
  /** The wordmark expands from `name` to this on hover. */
  fullName: "Veesesh",
  aliasNote: "Hey, my real name is Veesesh but I also go by Vee. That's my alias",
  role: "Community and Operations, Devfolio",
  location: "Hyderabad / Bengaluru",
  email: "curiousvee19@gmail.com",
} as const;

/**
 * About copy, split around the one link in it. Kept as segments rather than a
 * string with markup so the meta description can be derived as plain text
 * without ever duplicating the sentence.
 */
export const about = {
  before: "I work where community, developer experience, and operations meet. At ",
  link: { label: "Devfolio", href: "https://devfolio.co" },
  after:
    " I lead builder initiatives and turn repetitive work into small, useful agents and internal tools.",
} as const;

export const aboutPlain = `${about.before}${about.link.label}${about.after}`;

const allNavigation: readonly SiteLink[] = [
  { label: "build", href: "/build" },
  { label: "reading", href: "/reading" },
  { label: "listening", href: "/listening" },
  { label: "pictures", href: "/pictures" },
];

export const navigation: readonly SiteLink[] = allNavigation;

export const profileLinks: readonly SiteLink[] = [
  { label: "GitHub", href: "https://github.com/veesesh" },
  { label: "X", href: "https://x.com/vee19twt" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vee19/" },
  { label: "Email", href: "mailto:curiousvee19@gmail.com" },
  {
    label: "Résumé",
    href: "https://drive.google.com/file/d/1RI-UVdS7dAdpau2HiPMdHZtdA3trkPKX/view?usp=sharing",
  },
];

/** Public Spotify source; swapping the playlist only requires changing this URL. */
export const spotify = {
  playlistUrl: "https://open.spotify.com/playlist/2oqpUuxrELm2pkQItwKJuq",
  embedUrl: "https://open.spotify.com/embed/playlist/2oqpUuxrELm2pkQItwKJuq?utm_source=generator",
  title: "Vee's listening rotation",
} as const;

/** A deliberately loose space for the non-work bits, ready for notes later. */
export const lifeSections: readonly LifeSection[] = [
  {
    title: "Movies",
    eyebrow: "On screen",
    note: "The films I keep returning to, the scenes I replay, and the ones I will definitely make you watch.",
  },
  {
    title: "Moving around",
    eyebrow: "Off screen",
    note: "The physical things I play, attempt, and use to get out of my own head.",
  },
  {
    title: "Biryani",
    eyebrow: "Very serious research",
    note: "An ongoing, extremely personal investigation into the perfect plate of biryani.",
  },
  {
    title: "Dream places",
    eyebrow: "Someday",
    note: "Places I want to be, routes I want to take, and small reasons to keep a bag half-packed.",
  },
];

export const photos: readonly Photo[] = [
  {
    src: "/images/image-3.jpg",
    alt: "A collage of builders, demos, and workshop moments from CodeDay Hyderabad",
    width: 800,
    height: 600,
  },
  {
    src: "/images/image-2.jpg",
    alt: "Vee speaking to a room of students at a community event",
    width: 6000,
    height: 4000,
  },
  {
    src: "/images/image-1.jpg",
    alt: "A large group of student builders gathered after an event",
    width: 6000,
    height: 4000,
  },
  {
    src: "/images/image-5.png",
    alt: "Community organizers gathered together at a conference",
    width: 1600,
    height: 732,
  },
  {
    src: "/images/image-7.png",
    alt: "CodeDay participants and organizers posing for a group photograph",
    width: 1500,
    height: 1000,
  },
  {
    src: "/images/image-6.png",
    alt: "An online community meetup with participants joining through video and Discord",
    width: 2248,
    height: 1482,
  },
  {
    src: "/images/image-9.png",
    alt: "The Hackerabad organizing team standing in front of the community logo",
    width: 1500,
    height: 1000,
  },
  {
    src: "/images/image-4.png",
    alt: "Hackathon participants celebrating together in a crowded group photograph",
    width: 1296,
    height: 864,
  },
  {
    src: "/images/image-10.jpg",
    alt: "A group of builders relaxing together after an event",
    width: 4160,
    height: 3120,
  },
  {
    src: "/images/image-8.png",
    alt: "A university developer community gathered onstage after a meetup",
    width: 1356,
    height: 763,
  },
];
