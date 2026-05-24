"use client"

import { instrumentSerif } from "@/lib/fonts"

export default function MoreBelow() {
  const handleClick = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 cursor-pointer transition-opacity hover:opacity-100 focus:outline-none"
      aria-label="Scroll down"
    >
      <p className={`${instrumentSerif.className} text-lg text-white opacity-80 transition-opacity hover:opacity-100`}>
        More below
      </p>
    </button>
  )
}
