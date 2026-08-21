import { instrumentSerif } from "@/lib/fonts"

const Grind = () => {
  return (
    <div className="flex w-full items-center justify-center overflow-hidden bg-ink py-10">
      <h1
        className={`${instrumentSerif.className} text-[16vw] leading-[0.85] tracking-tight whitespace-nowrap text-transparent uppercase select-none [-webkit-text-stroke:1px_rgba(237,230,214,0.35)]`}
      >
        keep building
      </h1>
    </div>
  )
}

export default Grind
