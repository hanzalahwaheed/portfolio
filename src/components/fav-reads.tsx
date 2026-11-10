"use client"

import React, { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import Reveal from "@/components/reveal"
import { reads, readTopics, type Read, type ReadTopic } from "@/config"
import { instrumentSerif } from "@/lib/fonts"

type Filter = "all" | ReadTopic

const filters: Filter[] = ["all", ...readTopics.filter(topic => reads.some(read => read.topic === topic))]

const ReadRow = ({ read }: { read: Read }) => {
  const body = (
    <div className="flex items-center gap-5 px-2 py-6 md:gap-6">
      <div className="min-w-0 flex-1">
        <h3
          className={`${instrumentSerif.className} text-paper group-hover:text-brass text-2xl leading-tight transition-colors duration-300 md:text-3xl`}
        >
          {read.title}
        </h3>
        <p className="text-paper-dim mt-1 font-light italic">{read.author}</p>

        {read.note && <p className="text-faint mt-2 font-light">{read.note}</p>}
      </div>

      {read.link && (
        <ArrowUpRight
          size={22}
          className="text-faint group-hover:text-brass flex-shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </div>
  )

  const rowClassName = "group border-hairline relative block border-t"

  return read.link ? (
    <a
      href={read.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${rowClassName} hover:bg-paper/[0.02] transition-colors`}
    >
      {body}
    </a>
  ) : (
    <div className={rowClassName}>{body}</div>
  )
}

const FavReads = () => {
  const [selected, setSelected] = useState<Filter>("all")

  const visibleReads = selected === "all" ? reads : reads.filter(read => read.topic === selected)

  return (
    <section className="bg-ink text-paper w-full px-4 py-24">
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <header className="mb-8">
            <h2 className={`${instrumentSerif.className} text-paper text-4xl leading-none md:text-5xl`}>Fav Reads</h2>
            <p className="text-paper-dim mt-4 max-w-md font-light">
              Books, essays and blogs that changed how I think, or that I just loved reading.
            </p>
          </header>
        </Reveal>

        {filters.length > 2 && (
          <div className="font-ui mb-8 flex flex-wrap gap-x-5 gap-y-2">
            {filters.map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelected(filter)}
                aria-pressed={selected === filter}
                className={`border-b pb-1 text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-300 ${
                  selected === filter ? "border-brass text-brass" : "text-faint hover:text-paper border-transparent"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        <div className="border-hairline border-b">
          {visibleReads.map(read => (
            <ReadRow key={`${read.kind}-${read.title}`} read={read} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FavReads
