# Hanzalah Waheed's Portfolio v2

A modern, highly customizable portfolio website built with the latest web technologies. This project serves as a comprehensive showcase of my work, experience, and thoughts.

## 🌟 Features

- **Modern Tech Stack**: Built with **Next.js 15**, **React 19**, and **TypeScript** for a robust and type-safe codebase.
- **Styling**: Beautifully styled with **Tailwind CSS v4** and **Shadcn UI** components.
- **Animations**: Smooth and engaging animations powered by **Framer Motion** and **Tailwind CSS Animate**.
- **Centralized Configuration**: Easily customize the portfolio content (personal details, socials, projects, etc.) from a single config file.
- **Database Integration**: Ready for database connections with **Drizzle ORM** and **PostgreSQL** (Neon).
- **GitHub Integration**: Fetches and displays GitHub contributions and repositories.
- **Responsive Design**: Fully responsive layout that looks great on all devices.

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/hanzalahwaheed/portfolio-v2.git
    cd portfolio-v2
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Customization

This portfolio is designed to be easily customizable. You can update your personal information, social links, projects, and more by modifying the configuration file.

**Config Location**: `src/config.ts`

### What you can customize:

- **Personal Details**: Update your name, GitHub username, and other personal info.
- **Social Links**: Add or update links to your social media profiles (GitHub, Twitter, LinkedIn, etc.).
- **OSS Contributions**: highlight your key open source contributions.
- **Work Experience**: Add your professional history with details on roles and tech stacks.
- **Builds (Projects)**: Showcase your projects with descriptions, links, and tech stacks.
- **Books**: Share your favorite reads.

Simply edit the exports in `src/config.ts` and the changes will reflect across the site.

### Microsoft Clarity

Production builds load `@microsoft/clarity` in the browser after the page hydrates.
The project ID is `yrxxrmd7uv`, configured in `src/routes/__root.tsx`.
Clarity is disabled during `npm run dev`.

## 🎨 Inspiration

The design and aesthetic of this portfolio are heavily inspired by the atmosphere and visual style of **Hollow Knight**. The dark themes and subtle interactions aim to capture a similar mood.

## 📄 License

[MIT](LICENSE)
