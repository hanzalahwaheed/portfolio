import { instrumentSerif } from "@/lib/fonts"

const Grind = () => {
  return (
    <div className="flex w-full items-center justify-center overflow-hidden bg-[#061113]">
      <h1
        className={`${instrumentSerif.className} text-[18vw] leading-[0.8] tracking-tighter whitespace-nowrap text-white opacity-90 select-none`}
      >
        KEEP BUILDING
      </h1>
    </div>
  )
}

export default Grind
