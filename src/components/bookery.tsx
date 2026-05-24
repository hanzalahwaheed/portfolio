"use client"
import React, { useState, useEffect } from "react"

import { Star, ArrowRight, Quote } from "lucide-react"

import { books as library, bookCategories as categories, Book } from "../config"
import { instrumentSerif } from "@/lib/fonts"

const Bookery = () => {
  const [activeBook, setActiveBook] = useState<Book>(library[0])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredLibrary =
    selectedCategory === "All" ? library : library.filter(book => book.category === selectedCategory)

  const handleBookChange = (book: Book) => {
    if (activeBook.id === book.id) return

    setIsTransitioning(true)
    setTimeout(() => {
      setActiveBook(book)
      setIsTransitioning(false)
    }, 300) // Wait for fade out
  }

  // Update active book when category changes
  useEffect(() => {
    if (filteredLibrary.length > 0 && !filteredLibrary.some(book => book.id === activeBook.id)) {
      setActiveBook(filteredLibrary[0])
    }
  }, [selectedCategory, filteredLibrary, activeBook.id])

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#061113] font-sans text-white selection:bg-white/20 selection:text-white md:flex-row">
      {/* --- Ambient Background Layer --- */}
      {/* This creates the mood lighting based on the book cover */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-br ${activeBook.color} via-[#061113] to-[#0D1B21] opacity-40 transition-colors duration-1000 ease-in-out`}
      />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay"></div>

      {/* --- LEFT: The Collection List --- */}
      <div className="relative z-10 flex h-full w-full flex-col border-r border-[#1E383C]/50 bg-[#0D1B21]/40 p-8 backdrop-blur-sm md:w-5/12 md:p-16">
        <header className="mb-8">
          <h2
            className={`bg-gradient-to-b from-white to-white/60 bg-clip-text ${instrumentSerif.className} text-4xl tracking-tight text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-5xl`}
          >
            Bookery
          </h2>
          <p className="mt-4 max-w-md text-neutral-500">I love reading. Here are some of my favorite books.</p>
        </header>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                selectedCategory === category
                  ? "border-[#66acb6] bg-[#66acb6]/20 text-[#66acb6]"
                  : "border-[#1E383C] bg-transparent text-neutral-500 hover:border-[#66acb6]/50 hover:text-neutral-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <nav className="scrollbar-hide flex-1 overflow-y-auto pr-4">
          <ul className="space-y-6">
            {filteredLibrary.map(book => (
              <li key={book.id} className="group cursor-pointer" onClick={() => handleBookChange(book)}>
                <div
                  className={`flex items-baseline gap-4 transition-all duration-300 ${
                    activeBook.id === book.id ? "translate-x-4" : "hover:translate-x-2"
                  }`}
                >
                  <span
                    className={`text-xs transition-colors duration-300 ${
                      activeBook.id === book.id ? "text-white" : "text-neutral-600 group-hover:text-neutral-400"
                    }`}
                  >
                    {String(book.id).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={`text-3xl leading-none transition-all duration-300 md:text-4xl ${
                        activeBook.id === book.id ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                      }`}
                    >
                      {book.title}
                    </span>
                    {/* {book.subtitle && (
                      <span
                        className={`mt-1 text-xs tracking-wider uppercase transition-all duration-300 ${
                          activeBook.id === book.id ? "text-neutral-400 opacity-100" : "h-0 overflow-hidden opacity-0"
                        }`}
                      >
                        {book.subtitle}
                      </span>
                    )} */}
                    <span
                      className={`mt-1 text-xs tracking-wider uppercase transition-all duration-300 ${
                        activeBook.id === book.id ? "text-neutral-400 opacity-100" : "h-0 overflow-hidden opacity-0"
                      }`}
                    >
                      {book.author}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* <footer className="mt-8 font-mono text-xs text-[#1E383C]">
          <p>SELECT A TITLE TO VIEW</p>
        </footer> */}
      </div>

      {/* --- RIGHT: The Stage (Visualization) --- */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-8 md:w-7/12 md:p-16">
        {/* Book Container */}
        <div
          className={`relative transform transition-all duration-500 ease-out ${
            isTransitioning ? "translate-y-4 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100"
          }`}
        >
          {/* Floating Effect Wrapper */}
          <div className="animate-float relative">
            {/* The Book Cover */}
            <div className="group perspective-1000 relative z-20 aspect-[2/3] w-[260px] rounded-sm shadow-2xl md:w-[320px]">
              <img
                src={activeBook.cover}
                alt={activeBook.title}
                className="h-full w-full rounded-sm border border-white/10 object-cover shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
              />

              {/* Glossy Reflection overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              {/* Spine hint on left */}
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>

            {/* Reflection on 'floor' */}
            <div className="mask-linear-fade absolute right-0 -bottom-4 left-0 z-10 h-full origin-bottom scale-y-[-1] transform opacity-20 blur-sm">
              <img src={activeBook.cover} className="h-full w-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061113] via-[#061113]/80 to-transparent"></div>
            </div>
          </div>

          {/* Book Metadata Overlay */}
          <div className="absolute -right-4 bottom-12 z-30 max-w-xs md:-right-12 md:bottom-20">
            <div className="rounded-xl border border-[#1E383C] bg-[#0D1B21]/80 p-6 shadow-xl backdrop-blur-md">
              <Quote size={20} className="mb-3 text-[#66acb6]" />
              <p className="mb-4 font-serif text-lg leading-relaxed text-white italic">
                &ldquo;{activeBook.quote}&rdquo;
              </p>

              <div className="flex items-center justify-between border-t border-[#1E383C] pt-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.floor(activeBook.rating) ? "fill-[#66acb6] text-[#66acb6]" : "text-[#1E383C]"}
                    />
                  ))}
                </div>
                <a
                  href={activeBook.link}
                  className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#66acb6] uppercase transition-colors hover:text-[#4fe0d0]"
                >
                  Details <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category Label (floating in background) */}
        <div
          className={`absolute top-12 right-12 transition-opacity duration-700 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="pointer-events-none font-serif text-[10rem] leading-none text-white/5 select-none">
            {activeBook.category.charAt(0)}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .mask-linear-fade {
          mask-image: linear-gradient(to top, transparent, black);
          -webkit-mask-image: linear-gradient(to top, transparent, black);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default Bookery
