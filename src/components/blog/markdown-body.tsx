import { memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import CodeBlock from "@/components/blog/code-block"
import { instrumentSerif } from "@/lib/fonts"

const MarkdownBody = memo(function MarkdownBody({ content, isDark }: { content: string; isDark: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        h1: ({ children }) => (
          <h2
            className={`${instrumentSerif.className} my-8 scroll-mt-24 text-4xl leading-tight font-bold tracking-tight md:text-5xl ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {children}
          </h2>
        ),
        h2: ({ children }) => (
          <h2
            className={`${instrumentSerif.className} my-10 mt-16 scroll-mt-24 text-3xl leading-tight font-bold tracking-tight md:text-4xl ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            className={`${instrumentSerif.className} my-8 scroll-mt-24 text-2xl leading-tight font-semibold md:text-3xl ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4
            className={`${instrumentSerif.className} my-6 scroll-mt-24 text-xl font-semibold md:text-2xl ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {children}
          </h4>
        ),
        p: ({ children }) => (
          <p className="mb-8 text-lg leading-relaxed font-light antialiased md:text-xl">{children}</p>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className={`${instrumentSerif.className} my-10 border-l-4 pl-6 text-xl leading-relaxed italic ${
              isDark
                ? "border-[#66acb6] bg-neutral-900/50 text-neutral-300"
                : "border-[#0B5964] bg-neutral-50 text-neutral-700"
            }`}
          >
            {children}
          </blockquote>
        ),
        ul: ({ children }) => <ul className="my-6 ml-6 list-disc space-y-4 font-light">{children}</ul>,
        ol: ({ children }) => <ol className="my-6 ml-6 list-decimal space-y-4 font-light">{children}</ol>,
        li: ({ children }) => (
          <li
            className={`text-lg leading-relaxed font-light md:text-xl ${isDark ? "text-neutral-300 marker:text-[#66acb6]" : "text-neutral-700 marker:text-[#0B5964]"}`}
          >
            {children}
          </li>
        ),
        hr: () => <hr className={`my-16 border-2 ${isDark ? "border-neutral-800" : "border-neutral-200"}`} />,
        strong: ({ children }) => (
          <strong className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        img: ({ src, alt }) => (
          <img
            src={typeof src === "string" ? src : undefined}
            alt={alt || ""}
            loading="lazy"
            className={`mx-auto my-10 block h-auto max-w-full rounded-lg border ${
              isDark ? "border-neutral-800" : "border-neutral-200"
            }`}
          />
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className={`border-b-2 pb-0.5 font-medium transition-all duration-200 hover:pb-1 ${
              isDark
                ? "border-[#66acb6] text-[#66acb6] hover:border-white hover:text-white hover:shadow-[0_2px_8px_rgba(102,172,182,0.3)]"
                : "border-[#0B5964] text-[#0B5964] hover:border-neutral-900 hover:text-neutral-900 hover:shadow-[0_2px_8px_rgba(11,89,100,0.2)]"
            }`}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        ),
        pre: ({ children, node }) => (
          <CodeBlock node={node} isDark={isDark}>
            {children}
          </CodeBlock>
        ),
        code: ({ children, className }) => <code className={className}>{children}</code>,
        table: ({ children }) => (
          <div className="my-10 overflow-x-auto rounded-none border shadow-md">
            <table
              className={`w-full border-collapse text-left ${isDark ? "border-neutral-800" : "border-neutral-200"}`}
            >
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead
            className={`font-semibold ${
              isDark ? "bg-neutral-900 text-neutral-200" : "bg-neutral-100 text-neutral-900"
            }`}
          >
            {children}
          </thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr
            className={`border-b transition-all duration-200 ${
              isDark ? "border-neutral-800 hover:bg-neutral-900/50" : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th
            className={`border px-6 py-4 text-sm tracking-wider uppercase ${
              isDark ? "border-neutral-800" : "border-neutral-200"
            }`}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td
            className={`border px-6 py-4 text-sm ${
              isDark ? "border-neutral-800 text-neutral-300" : "border-neutral-200 text-neutral-700"
            }`}
          >
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
})

export default MarkdownBody
