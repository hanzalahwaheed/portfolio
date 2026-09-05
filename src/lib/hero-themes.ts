const heroBackgrounds = [
  { src: "/images/hero-forest.webp", accent: "#7fc79b", tint: "rgba(127, 199, 155, 0.08)" },
  { src: "/images/hero-rose.webp", accent: "#cf9a92", tint: "rgba(207, 154, 146, 0.08)" },
  { src: "/images/hero-blue.webp", accent: "#93a8e0", tint: "rgba(147, 168, 224, 0.08)" },
]

export const heroStyles =
  heroBackgrounds
    .map(
      (hero, index) =>
        `${index === 0 ? ":root," : ""}html[data-hero="${index}"]{--hero-background:url("${hero.src}");--brass:${hero.accent};--accent-tint:${hero.tint}}`,
    )
    .join("") + ".hero-background{background-image:var(--hero-background)}"

export const heroInitScript = `(() => {
  let index = 0
  try {
    const stored = Number(localStorage.getItem("hero-bg-index"))
    if (Number.isSafeInteger(stored) && stored >= 0) index = stored % ${heroBackgrounds.length}
    localStorage.setItem("hero-bg-index", String((index + 1) % ${heroBackgrounds.length}))
  } catch {}
  document.documentElement.setAttribute("data-hero", String(index))
})()`
