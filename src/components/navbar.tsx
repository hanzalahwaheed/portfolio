"use client"

import { useEffect, useState } from "react"
import NextLink from "@/components/app-link"
import { instrumentSerif } from "@/lib/fonts"

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  const scrollToSection = (id: string) => {
    setIsVisible(true)
    const element = document.getElementById(id)
    if (!element) return
    const top = element.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <nav
      className={`fixed top-4 left-1/2 z-50 w-[95%] -translate-x-1/2 transform text-sm transition-all duration-300 ease-in-out md:w-auto md:min-w-xl md:text-lg ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="min-h-8 rounded-xl bg-white/10 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-center space-x-4 px-4 py-2">
          {/* Navigation Links */}
          <div className={`${instrumentSerif.className} flex items-center justify-center space-x-3 md:space-x-6`}>
            <button
              type="button"
              onClick={() => scrollToSection("about-me")}
              className="cursor-pointer font-medium text-white transition-colors duration-200 hover:text-blue-200"
            >
              Me
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("builds")}
              className="hover:text-glow cursor-pointer font-medium text-white transition-colors duration-200"
            >
              Builds
            </button>
            <NextLink
              href="/blogs"
              target="_blank"
              className="cursor-pointer font-medium text-white transition-colors duration-200 hover:text-blue-200"
            >
              Blogs
            </NextLink>
            <button
              type="button"
              onClick={() => scrollToSection("bookery")}
              className="cursor-pointer font-medium text-white transition-colors duration-200 hover:text-blue-200"
            >
              Bookery
            </button>
            <NextLink
              href="/resume"
              className="rounded-md bg-white px-2 font-medium text-black transition-colors duration-200"
            >
              Resume
            </NextLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
