export type SiteLink = {
  label: string;
  href: string;
};

export type TimelineItem = {
  organization: string;
  role: string;
  period: string;
  summary: string;
  href?: string;
};

export type ArchiveItem = {
  title: string;
  descriptor: string;
  summary: string;
  href?: string;
};

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const navigation: readonly SiteLink[] = [
  { label: "Work", href: "/work" },
  { label: "Notes", href: "/notes" },
  { label: "Trove", href: "/trove" },
  { label: "Gallery", href: "/gallery" },
];

export const profileLinks: readonly SiteLink[] = [
  { label: "GitHub", href: "https://github.com/veesesh" },
  { label: "X / Twitter", href: "https://x.com/vee19twt" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vee19/" },
  { label: "Email", href: "mailto:curiousvee19@gmail.com" },
  {
    label: "Résumé",
    href: "https://drive.google.com/file/d/1RI-UVdS7dAdpau2HiPMdHZtdA3trkPKX/view?usp=sharing",
  },
];

export const experience: readonly TimelineItem[] = [
  {
    organization: "Devfolio",
    role: "Community & Operations",
    period: "Jan 2026 — now",
    summary:
      "Leading builder initiatives and building the systems behind community, support, and developer experience.",
    href: "https://devfolio.co",
  },
  {
    organization: "Hackerabad",
    role: "Community lead & mentor",
    period: "Apr 2022 — now",
    summary:
      "Helping a student-run developer community in Hyderabad grow through mentorship, events, and campus programs.",
    href: "https://hackerabad.framer.website/",
  },
  {
    organization: "CodeDay Hyderabad",
    role: "Regional manager & volunteer",
    period: "Jul 2022 — Dec 2024",
    summary:
      "Volunteered across two editions, then led a regional event for student artists, programmers, musicians, and writers.",
    href: "https://event.codeday.org/en-US/hyderabad",
  },
  {
    organization: "KalaKumbh",
    role: "Flutter developer intern",
    period: "Jun — Aug 2023",
    summary: "Built and maintained Flutter experiences across web and mobile.",
    href: "https://www.linkedin.com/company/kalakumbh/",
  },
];

export const programArchive: readonly ArchiveItem[] = [
  {
    title: "Build India 2026",
    descriptor: "Program operations · Bengaluru",
    summary:
      "A builder-first AI sprint focused on products designed for Indian users and realities.",
    href: "https://buildindia2026.devfolio.co/overview",
  },
  {
    title: "Push to Prod with Genspark & Claude",
    descriptor: "Event team · Singapore",
    summary:
      "An in-person sprint for solving real internal workflow problems with AI.",
    href: "https://push-to-prod.devfolio.co/overview",
  },
  {
    title: "Warpspeed 2025",
    descriptor: "Event team · Bengaluru",
    summary:
      "A 24-hour hackathon for agents, structured LLM workflows, and multi-agent systems.",
    href: "https://warpspeed2025.devfolio.co/overview",
  },
  {
    title: "ETHIndiaVilla",
    descriptor: "Event team · Bengaluru",
    summary:
      "A smaller, intentional ETHIndia format built around close collaboration between selected builders and mentors.",
    href: "https://ethindia-villa.devfolio.co/overview",
  },
  {
    title: "ETHDenver 2026",
    descriptor: "Online support",
    summary: "Supported the online side of Devfolio's work for the Ethereum builder program.",
    href: "https://ethdenver2026.devfolio.co/overview",
  },
  {
    title: "The Synthesis",
    descriptor: "Online support",
    summary:
      "Supported an agent-native hackathon where agents assisted with projects and evaluation while people kept final judgment.",
    href: "https://devfolio.co/blog/synthesis/",
  },
];

export const earlierBuilds: readonly ArchiveItem[] = [
  {
    title: "NAASH — Not Another AI Shell",
    descriptor: "AI CLI · HackThisFall 2024 winner",
    summary:
      "A natural-language terminal shell with clipboard and error-log history, built with a team.",
    href: "https://github.com/Sushants-Git/team-gap",
  },
  {
    title: "Scratch Blogs",
    descriptor: "TypeScript · Gemini · Azure",
    summary:
      "A multimodal writing environment for Markdown, diagrams, and images. I worked on the backend.",
    href: "https://github.com/veesesh/backend_scratchblogs",
  },
  {
    title: "Snippet Safe",
    descriptor: "React · MongoDB · Frost Hacks 2024 winner",
    summary: "A team-built bookmarking tool for storing and organizing code snippets.",
    href: "https://github.com/Sushants-Git/SnippetsSafe",
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
