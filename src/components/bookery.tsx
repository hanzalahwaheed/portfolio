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
    <section className="relative w-full overflow-hidden bg-[#061113] px-4 py-24 font-sans text-white selection:bg-white/20 selection:text-white">
      {/* --- Ambient mood lighting based on the active book cover --- */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br ${activeBook.color} via-[#061113] to-[#0D1B21] opacity-40 transition-colors duration-1000 ease-in-out`}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <h2
            className={`bg-gradient-to-b from-white to-white/60 bg-clip-text ${instrumentSerif.className} pb-1 text-4xl tracking-tight text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-5xl`}
          >
            Bookery
          </h2>
          <p className="mt-3 max-w-md text-sm text-neutral-400">I love reading. Here are some of my favorite books.</p>
        </header>

        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-3.5 py-1 text-[0.7rem] font-medium tracking-wider uppercase transition-all duration-300 ${
                selectedCategory === category
                  ? "border-[#66acb6] bg-[#66acb6]/20 text-[#66acb6]"
                  : "border-[#1E383C] bg-transparent text-neutral-500 hover:border-[#66acb6]/50 hover:text-neutral-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured spread */}
        <div
          className={`flex flex-col gap-8 transition-all duration-300 ease-out sm:flex-row sm:items-center sm:gap-10 ${
            isTransitioning ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {/* Cover */}
          <div className="flex flex-shrink-0 justify-center sm:block">
            <div className="animate-float group relative aspect-[2/3] w-44 rounded-sm shadow-2xl md:w-52">
              <img
                src={activeBook.cover}
                alt={activeBook.title}
                className="h-full w-full rounded-sm border border-white/10 object-cover shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]"
              />
              {/* Glossy reflection */}
              <div className="pointer-events-none absolute inset-0 rounded-sm bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Spine hint */}
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <span className="text-[0.7rem] tracking-[0.2em] text-[#66acb6] uppercase">{activeBook.category}</span>
            <h3 className={`${instrumentSerif.className} mt-2 text-3xl leading-tight text-white md:text-4xl`}>
              {activeBook.title}
            </h3>
            <p className="mt-1 text-sm tracking-wide text-neutral-400">{activeBook.author}</p>

            <div className="mt-5 border-l-2 border-[#1E383C] pl-4">
              <Quote size={16} className="mb-2 text-[#66acb6]" />
              <p className="font-serif text-base leading-relaxed text-neutral-200 italic">&ldquo;{activeBook.quote}&rdquo;</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
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

        {/* Cover strip selector */}
        <div className="scrollbar-hide mt-12 flex gap-3 overflow-x-auto border-t border-[#1E383C]/50 pt-8">
          {filteredLibrary.map(book => (
            <button
              key={book.id}
              onClick={() => handleBookChange(book)}
              aria-label={book.title}
              className={`relative aspect-[2/3] w-12 flex-shrink-0 overflow-hidden rounded-sm border transition-all duration-300 md:w-14 ${
                activeBook.id === book.id
                  ? "border-[#66acb6] opacity-100 ring-2 ring-[#66acb6]/40"
                  : "border-white/10 opacity-50 hover:opacity-90"
              }`}
            >
              <img src={book.cover} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

export default Bookery
