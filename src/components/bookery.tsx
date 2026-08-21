"use client"
import React, { useState, useEffect } from "react"

import { ArrowRight } from "lucide-react"

import { books as library, bookCategories as categories, Book } from "../config"
import { instrumentSerif } from "@/lib/fonts"
import Reveal from "@/components/reveal"

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
    <section className="relative w-full overflow-hidden bg-ink px-4 py-24 text-paper">
      {/* --- Ambient mood lighting based on the active book cover --- */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br ${activeBook.color} via-ink to-ink-raised opacity-30 transition-colors duration-1000 ease-in-out`}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Header */}
        <Reveal>
          <header className="mb-8">
            <h2 className={`${instrumentSerif.className} text-4xl leading-none text-paper md:text-5xl`}>Bookery</h2>
            <p className="mt-4 max-w-md font-light text-paper-dim">
              I love reading. Here are some of my favorite books.
            </p>
          </header>
        </Reveal>

        {/* Category Filter */}
        <div className="font-ui mb-10 flex flex-wrap gap-x-5 gap-y-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`border-b pb-1 text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-300 ${
                selectedCategory === category
                  ? "border-brass text-brass"
                  : "border-transparent text-faint hover:text-paper"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured spread */}
        <div
          className={`flex flex-col gap-8 transition-all duration-300 ease-out sm:flex-row sm:items-center sm:gap-12 ${
            isTransitioning ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {/* Cover */}
          <div className="flex flex-shrink-0 justify-center sm:block">
            <div className="animate-float group relative aspect-[2/3] w-44 shadow-2xl md:w-52">
              <img
                src={activeBook.cover}
                alt={activeBook.title}
                className="h-full w-full object-cover shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)]"
              />
              {/* Glossy reflection */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Spine hint */}
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-black/40 to-transparent" />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <span className="font-ui text-[0.65rem] tracking-[0.3em] text-brass uppercase">{activeBook.category}</span>
            <h3 className={`${instrumentSerif.className} mt-2 text-3xl leading-tight text-paper md:text-4xl`}>
              {activeBook.title}
            </h3>
            <p className="mt-1 font-light tracking-wide text-paper-dim italic">{activeBook.author}</p>

            {activeBook.quote && (
              <div className="mt-6 border-l border-brass/50 pl-5">
                <p className="text-lg leading-relaxed font-light text-paper-dim italic">
                  &ldquo;{activeBook.quote}&rdquo;
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`${instrumentSerif.className} text-lg text-brass`}>{Math.floor(activeBook.rating)}</span>
                <span className="font-ui text-[0.65rem] tracking-[0.2em] text-faint uppercase">/ 5</span>
              </div>
              <a
                href={activeBook.link}
                className="font-ui flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.25em] text-brass uppercase transition-colors hover:text-paper"
              >
                Details <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Cover strip selector */}
        <div className="scrollbar-hide mt-12 flex gap-3 overflow-x-auto border-t border-hairline pt-8">
          {filteredLibrary.map(book => (
            <button
              key={book.id}
              onClick={() => handleBookChange(book)}
              aria-label={book.title}
              className={`relative aspect-[2/3] w-12 flex-shrink-0 overflow-hidden border transition-all duration-300 md:w-14 ${
                activeBook.id === book.id
                  ? "border-brass opacity-100"
                  : "border-hairline opacity-40 hover:opacity-90"
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
