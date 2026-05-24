import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/routes/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "rich-black": "#2F2A24",
        "olive-grey": "#7A7255",
        turquoise: "#4FE0D0",
        "deep-teal": "#0B5964",
        cream: "#F2EDC5",
      },
    },
  },
}

export default config
