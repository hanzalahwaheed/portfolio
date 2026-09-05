import { useEffect, useRef, useState, type ReactNode } from "react"
import type { Element, ElementContent } from "hast"
import { Check, Copy } from "lucide-react"

function textContent(node: Element | ElementContent): string {
  if (node.type === "text") return node.value
  if (node.type === "element") return node.children.map(textContent).join("")
  return ""
}

export default function CodeBlock({
  children,
  node,
  isDark,
}: {
  children: ReactNode
  node?: Element
  isDark: boolean
}) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const code = node?.children.find((child): child is Element => child.type === "element" && child.tagName === "code")
  const language = code?.properties.className?.toString().match(/language-([^ ,]+)/)?.[1] ?? "plaintext"

  useEffect(() => () => clearTimeout(timeout.current), [])

  const copy = async () => {
    if (!node) return
    try {
      await navigator.clipboard.writeText(textContent(node).replace(/\n$/, ""))
      clearTimeout(timeout.current)
      setCopied(true)
      timeout.current = setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  return (
    <div className="not-prose my-10">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="font-mono text-xs tracking-wider text-neutral-500 uppercase">{language}</span>
        <button
          onClick={copy}
          className="hover:text-brass text-xs font-medium tracking-wider text-neutral-500 uppercase transition-colors"
          aria-label={copied ? "Code copied" : "Copy code"}
        >
          <span className="flex items-center gap-1.5" aria-live="polite">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
      <div className={`overflow-x-auto p-5 ${isDark ? "bg-white/[0.04]" : "bg-neutral-900/[0.04]"}`}>
        <pre className={`font-mono text-sm leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
          {children}
        </pre>
      </div>
    </div>
  )
}
