import { instrumentSerif } from "@/lib/fonts"

const Grind = () => {
  return (
    <svg className="block w-full overflow-visible" viewBox="0 0 1000 122" role="img" aria-label="Keep building">
      <text
        x="0"
        y="116"
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fontSize="158"
        className={`${instrumentSerif.className} fill-brass`}
      >
        KEEP BUILDING
      </text>
    </svg>
  )
}

export default Grind
