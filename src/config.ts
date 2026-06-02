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
}

export const workExperiences: WorkExperience[] = [
  {
    company: "StockInsights AI",
    companyUrl: "https://www.stockinsights.ai",
    role: "Software Development Engineer",
    duration: "18 Months and Ongoing",
    description:
      "I've been building financial intelligence tools that help investors make better decisions. Working on everything from data pipelines to user interfaces.",
    techStack: ["Python", "TypeScript", "Next.js", "PostgreSQL", "AWS", "Docker"],
  },
]

export interface Build {
  name: string
  description: string
  url: string
  techStack: string[]
  githubUrl?: string
}

export const builds: Build[] = [
  {
    name: "A/B Image Generator",
    description:
      "An application that helps you club together multiple images and then generate an A/B image for you, that you can post anywhere to A/B test your ideas. This project was launched on Peerlist and managed to reach top 30 on the leaderboard, is fully opensourced and has 25+ stars on GitHub!",
    url: "https://ab-img-gen.vercel.app/",
    techStack: ["Nextjs", "Tailwind CSS", "TypeScript"],
    githubUrl: "https://github.com/hanzalahwaheed/ab-image-generator",
  },
  {
    name: "Product Owl",
    description:
      "A web app that helps you track your favourite Amazon products at notifies you when they are at their cheapest! Implemented with the help of Web Scraping!",
    url: "https://product-owl.vercel.app/",
    techStack: ["Nextjs", "Tailwind CSS", "TypeScript", "PostgreSQL", "Web Scraping"],
    githubUrl: "https://github.com/hanzalahwaheed/product-owl",
  },
  {
    name: "Imagine Text",
    description:
      "An image to text extractor using tesseractJS. Extremely slow by current standards. Would not recommend for production use anymore :/",
    url: "https://imagine-text.vercel.app/",
    techStack: ["NextJS", "Tailwind CSS", "TypeScript", "TesseractJS", "Cloudinary"],
    githubUrl: "https://github.com/hanzalahwaheed/imagine-text",
  },
  {
    name: "News Nation",
    description:
      "News Nation is a Platform that shows you India's top headlines and keeps you up to date with the Current Affairs. PS. This was one of my first projects that I built back in 2020!",
    url: "https://news-nation-eta.vercel.app/",
    techStack: ["HTML", "CSS", "JavaScript"],
    githubUrl: "https://github.com/hanzalahwaheed/news-nation",
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
    quote: "The best architectures, requirements, and designs emerge from self-organizing teams.",
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
