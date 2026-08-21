export type HeroTheme = {
  accent: string
  tint: string
}

// Fallback palettes extracted offline from each hero background. Applied
// immediately on load; runtime extraction refines them when it finishes.
export const heroThemes: Record<string, HeroTheme> = {
  "/images/aurora-forest.jpg": {
    accent: "#7fc79b",
    tint: "rgba(127, 199, 155, 0.08)",
  },
  "/images/image copy 2.png": {
    accent: "#cf9a92",
    tint: "rgba(207, 154, 146, 0.08)",
  },
  "/images/image copy 4.png": {
    accent: "#93a8e0",
    tint: "rgba(147, 168, 224, 0.08)",
  },
}

const hexToTint = (hex: string, alpha = 0.08): string => {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 0xff
  const g = (n >> 8) & 0xff
  const b = n & 0xff
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const applyHeroTheme = (theme: HeroTheme) => {
  const root = document.documentElement
  root.style.setProperty("--brass", theme.accent)
  root.style.setProperty("--accent-tint", theme.tint)
}

// Extracts a primary palette from the image itself with node-vibrant, in the
// browser. Returns null on failure so callers can keep the fallback theme.
export const extractHeroTheme = async (src: string): Promise<HeroTheme | null> => {
  if (typeof window === "undefined") return null

  try {
    const { Vibrant } = await import("node-vibrant/browser")
    const palette = await Vibrant.from(src).getPalette()
    const swatch = palette.LightVibrant ?? palette.Vibrant ?? palette.Muted ?? palette.LightMuted
    if (!swatch) return null

    return { accent: swatch.hex, tint: hexToTint(swatch.hex) }
  } catch {
    return null
  }
}
