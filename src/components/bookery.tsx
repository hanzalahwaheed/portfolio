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
    <section className="bg-ink text-paper relative w-full overflow-hidden px-4 py-24">
      {/* --- Ambient mood lighting based on the active book cover --- */}
      <div
        className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br ${activeBook.color} via-ink to-ink-raised opacity-30 transition-colors duration-1000 ease-in-out`}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Header */}
        <Reveal>
          <header className="mb-8">
            <h2 className={`${instrumentSerif.className} text-paper text-4xl leading-none md:text-5xl`}>Bookery</h2>
            <p className="text-paper-dim mt-4 max-w-md font-light">
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
                  : "text-faint hover:text-paper border-transparent"
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
                loading="lazy"
                decoding="async"
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
            <span className="font-ui text-brass text-[0.65rem] tracking-[0.3em] uppercase">{activeBook.category}</span>
            <h3 className={`${instrumentSerif.className} text-paper mt-2 text-3xl leading-tight md:text-4xl`}>
              {activeBook.title}
            </h3>
            <p className="text-paper-dim mt-1 font-light tracking-wide italic">{activeBook.author}</p>

            {activeBook.quote && (
              <div className="border-brass/50 mt-6 border-l pl-5">
                <p className="text-paper-dim text-lg leading-relaxed font-light italic">
                  &ldquo;{activeBook.quote}&rdquo;
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`${instrumentSerif.className} text-brass text-lg`}>
                  {Math.floor(activeBook.rating)}
                </span>
                <span className="font-ui text-faint text-[0.65rem] tracking-[0.2em] uppercase">/ 5</span>
              </div>
              <a
                href={activeBook.link}
                className="font-ui text-brass hover:text-paper flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.25em] uppercase transition-colors"
              >
                Details <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Cover strip selector */}
        <div className="scrollbar-hide border-hairline mt-12 flex gap-3 overflow-x-auto border-t pt-8">
          {filteredLibrary.map(book => (
            <button
              key={book.id}
              onClick={() => handleBookChange(book)}
              aria-label={book.title}
              className={`relative aspect-[2/3] w-12 flex-shrink-0 overflow-hidden border transition-all duration-300 md:w-14 ${
                activeBook.id === book.id ? "border-brass opacity-100" : "border-hairline opacity-40 hover:opacity-90"
              }`}
            >
              <img loading="lazy" decoding="async" src={book.cover} alt="" className="h-full w-full object-cover" />
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
