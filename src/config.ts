export const personalDetails = {
  githubUsername: "hanzalahwaheed",
}

export const socialLinks = {
  github: "https://github.com/hanzalahwaheed",
  twitter: "https://x.com/waheed_hanzalah",
  linkedin: "https://linkedin.com/in/hanzalahwaheed",
}

export const contactLinks = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hanzalah.w@gmail.com",
  scheduleCall: process.env.NEXT_PUBLIC_CALCOM_URL ?? "https://cal.com/hanzalahwaheed",
}

export interface OSSContribution {
  project: string
  projectUrl: string
  githubUrl: string
  description: string
  type: "Pull Request" | "Merge Request" | "Issue"
}

export const ossContributions: OSSContribution[] = [
  {
    project: "Rafiki",
    projectUrl: "https://github.com/interledger/rafiki",
    githubUrl: "https://github.com/interledger/rafiki/pull/3735",
    description:
      "Chore: Refactor the codebase to implment DRY principles and improve code quality by creating a separate FormGroup component.",
    type: "Pull Request",
  },
  {
    project: "DocsGPT",
    projectUrl: "https://github.com/arc53/DocsGPT",
    githubUrl: "https://github.com/arc53/DocsGPT/pull/2110",
    description:
      "Improved modal accessibility and focus clarity. Enhanced visual hierarchy by adding a translucent blurred backdrop behind modals, improving focus and reducing UI distraction during critical actions.",
    type: "Pull Request",
  },
  {
    project: "DocsGPT",
    projectUrl: "https://github.com/arc53/DocsGPT",
    githubUrl: "https://github.com/arc53/DocsGPT/pull/2073",
    description:
      "Refactored ConversationBubble to improve performance. Removed unnecessary hover states and redundant logic, resulting in a smaller, faster, and more maintainable component structure.",
    type: "Pull Request",
  },
  {
    project: "DocsGPT",
    projectUrl: "https://github.com/arc53/DocsGPT",
    githubUrl: "https://github.com/arc53/DocsGPT/pull/2040",
    description:
      "Corrected agent title alignment issue in chat UI. Resolved a bug where an empty object evaluated truthy, causing misalignment. Now perfectly centered.",
    type: "Pull Request",
  },
  {
    project: "DocsGPT",
    projectUrl: "https://github.com/arc53/DocsGPT",
    githubUrl: "https://github.com/arc53/DocsGPT/pull/1999",
    description:
      "Chat UI polishing and UX enhancements. Prevented input border overlap, added hover states for consistency, and introduced slide animations for sidebar interactions.",
    type: "Pull Request",
  },
  {
    project: "DocsGPT",
    projectUrl: "https://github.com/arc53/DocsGPT",
    githubUrl: "https://github.com/arc53/DocsGPT/pull/1920",
    description:
      "Restored response bubble feedback button visibility. Buttons now remain visible at all times instead of only on hover, improving discoverability and usability.",
    type: "Pull Request",
  },
]

export interface WorkExperience {
  company: string
  companyUrl: string
  role: string
  duration: string
  description: string
  techStack: string[]
  /** Optional logo mark shown beside the entry. Path under /public. */
  logo?: string
  logoAlt?: string
}

export const workExperiences: WorkExperience[] = [
  {
    company: "C2SI",
    companyUrl: "https://github.com/c2siorg/dataloom",
    role: "Google Summer of Code 2026 Contributor",
    duration: "Jun 2026 – Aug 2026",
    description:
      "I build DataLoom, an open-source, browser-based data wrangling tool, for the Ceylon Computer Science Institute. I started by setting up the transformation and feature registries the app now extends through, which made every later feature cheap to add: multi-format ingest (TSV, JSON, XLSX, Parquet), data profiling, quality assessment, charts, formula columns, reusable transformation pipelines, and a tabbed workspace layout. I also co-authored the authentication layer and am migrating the frontend to TypeScript.",
    techStack: ["Python", "FastAPI", "pandas", "PostgreSQL", "React", "TypeScript", "Docker"],
    logo: "/images/gsoc.png",
    logoAlt: "Google Summer of Code",
  },
  {
    company: "StockInsights AI",
    companyUrl: "https://www.stockinsights.ai",
    role: "Founding Software Engineer",
    duration: "Aug 2024 – Present",
    description:
      "I build the AI layer of an equity research platform: a RAG pipeline that auto-summarizes 25,000+ SEC and earnings filings a month, a multi-session AI chat system, and the frontend on top of both. Along the way I've migrated our full-text search off MongoDB Atlas, cut our Vercel bill ~80% by tracking down scraper traffic, and shipped the company's first recurring API revenue with Stripe metered billing.",
    techStack: ["Python", "TypeScript", "Next.js", "PostgreSQL", "pgvector", "AWS", "Docker"],
    logo: "/images/stockinsights.svg",
    logoAlt: "StockInsights AI",
  },
]

export interface Build {
  name: string
  description: string
  url: string
  techStack: string[]
  githubUrl?: string
  /** Older work, kept for history. Rendered in a collapsed archive, not the main list. */
  archived?: boolean
}

export const builds: Build[] = [
  {
    name: "prfrd",
    description:
      "A performance-review engine where two agents argue. An advocate and an examiner build opposing, evidence-backed cases from an engineer's quarterly signals, an arbiter rules on them, and the full debate transcript is persisted to Postgres so every verdict can be audited. Weekly GitHub and Slack activity is normalized and rolled up into the monthly and quarterly evidence that grounds each claim, then surfaced as manager dashboards with team KPI rollups, risk flags for after-hours load and blockers, and per-engineer drill-downs.",
    url: "https://prfrd.vercel.app/",
    techStack: ["Next.js", "Vercel AI SDK", "TypeScript", "PostgreSQL", "Drizzle", "OpenAI Codex"],
    githubUrl: "https://github.com/hanzalahwaheed/prfrd",
  },
  {
    name: "A/B Image Generator",
    description:
      "An application that helps you club together multiple images and then generate an A/B image for you, that you can post anywhere to A/B test your ideas. Launched on Peerlist, where it reached the top 30 on the leaderboard, and fully open-sourced.",
    url: "https://ab-img-gen.vercel.app/",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript"],
    githubUrl: "https://github.com/hanzalahwaheed/ab-image-generator",
  },
  {
    name: "Product Owl",
    description:
      "A web app that tracks your favourite Amazon products and notifies you when they hit their lowest price, using scheduled web scraping.",
    url: "https://product-owl.vercel.app/",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "PostgreSQL", "Web Scraping"],
    githubUrl: "https://github.com/hanzalahwaheed/product-owl",
  },
  {
    name: "Imagine Text",
    description:
      "An image-to-text extractor built on Tesseract.js, running OCR client-side with Cloudinary handling uploads.",
    url: "https://imagine-text.vercel.app/",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "TesseractJS", "Cloudinary"],
    githubUrl: "https://github.com/hanzalahwaheed/imagine-text",
    archived: true,
  },
  {
    name: "News Nation",
    description:
      "A headlines aggregator for India's top current affairs stories, and one of the first things I ever built, back in 2020.",
    url: "https://news-nation-eta.vercel.app/",
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/hanzalahwaheed/news-nation",
    archived: true,
  },
]

export type Book = {
  id: number
  category: string
  title: string
  subtitle: string
  author: string
  cover: string
  color: string
  quote: string
  rating: number
  link: string
}

export const books: Book[] = [
  {
    id: 1,
    category: "Tech",
    title: "Designing Data-Intensive Applications",
    subtitle: "The Big Ideas Behind",
    author: "Martin Kleppmann",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2574&auto=format&fit=crop",
    color: "from-indigo-900/40 to-black",
    quote: "",
    rating: 4.8,
    link: "#",
  },
  {
    id: 2,
    category: "Fiction",
    title: "The Harry Potter Series",
    subtitle: "",
    author: "J.K. Rowling",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop",
    color: "from-amber-900/40 to-black",
    quote: "Always.",
    rating: 4.7,
    link: "#",
  },
  {
    id: 3,
    category: "Fiction",
    title: "The Percy Jackson Series",
    subtitle: "",
    author: "Rick Riordan",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop",
    color: "from-amber-900/40 to-black",
    quote: "",
    rating: 4.7,
    link: "#",
  },
]

export const bookCategories = ["All", "Non-Fiction", "Tech", "Fiction"]
