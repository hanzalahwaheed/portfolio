"use client"

import { useState, useRef, useEffect } from "react"
import type { BlogPost as Post } from "@/lib/blogs"
import Link from "@/components/app-link"
import { ArrowLeft, Loader2, Save, ImageIcon, Eye, X } from "lucide-react"
import { handleApiResponse } from "@/lib/api-client"

// --- Minimalist UI Components ---

const MinimalButton = ({
  children,
  className = "",
  variant = "primary",
  disabled,
  type = "button",
  form,
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "ghost" | "outline"
  disabled?: boolean
  type?: "button" | "submit"
  form?: string
  onClick?: () => void
}) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 h-9 px-4 py-2",
    ghost: "hover:bg-neutral-900 text-neutral-400 hover:text-white h-9 px-4 py-2",
    outline: "border border-neutral-800 hover:bg-neutral-900 text-neutral-300 h-9 px-4 py-2",
  }

  return (
    <button
      type={type}
      form={form}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const MinimalInput = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full border-b border-neutral-800 bg-transparent px-0 py-2 text-sm text-white transition-colors placeholder:text-neutral-600 focus:border-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const MinimalLabel = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => (
  <label
    className={`mb-1.5 block font-mono text-xs tracking-widest text-neutral-500 uppercase ${className}`}
    {...props}
  >
    {children}
  </label>
)

const Toggle = ({
  checked,
  onCheckedChange,
  name,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  name?: string
}) => (
  <>
    <input type="hidden" name={name} value={checked ? "on" : ""} />
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative h-5 w-9 rounded-full border transition-colors ${checked ? "border-white bg-white" : "border-neutral-700 bg-black"}`}
    >
      <span
        className={`block h-3 w-3 rounded-full bg-black shadow-sm transition-transform duration-100 will-change-transform ${checked ? "translate-x-4" : "translate-x-1"}`}
      />
    </button>
  </>
)

// Custom Auto-resizing Textarea
const AutoResizeTextarea = ({
  value,
  onChange,
  minRows = 1,
  className = "",
  placeholder,
  name,
  id,
  required,
  defaultValue,
}: {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  minRows?: number
  className?: string
  placeholder?: string
  name?: string
  id?: string
  required?: boolean
  defaultValue?: string
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      rows={minRows}
      className={className}
      placeholder={placeholder}
      name={name}
      id={id}
      required={required}
      defaultValue={defaultValue}
    />
  )
}

// --- Markdown Previewer ---
const SimpleMarkdown = ({ content }: { content: string }) => {
  if (!content) return <p className="font-instrument text-neutral-600 italic">Start typing to preview...</p>

  const lines = content.split("\n")
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        if (line.startsWith("### "))
          return (
            <h3 key={i} className="font-instrument mt-8 mb-4 text-xl font-medium text-white">
              {line.replace("### ", "")}
            </h3>
          )
        if (line.startsWith("## "))
          return (
            <h2 key={i} className="font-instrument mt-8 mb-4 text-2xl font-medium text-white">
              {line.replace("## ", "")}
            </h2>
          )
        if (line.startsWith("# "))
          return (
            <h1 key={i} className="font-instrument mt-8 mb-4 text-3xl font-medium text-white">
              {line.replace("# ", "")}
            </h1>
          )
        if (line.startsWith("#### "))
          return (
            <h4
              key={i}
              className="font-instrument mt-6 mb-2 inline-block border-b border-neutral-800 pb-2 text-lg text-neutral-300"
            >
              {line.replace("#### ", "")}
            </h4>
          )
        if (line.startsWith("> "))
          return (
            <blockquote key={i} className="font-instrument border-l border-white pl-4 text-neutral-400 italic">
              {line.replace("> ", "")}
            </blockquote>
          )
        if (line.startsWith("```"))
          return (
            <div
              key={i}
              className="my-4 rounded border border-neutral-800 bg-neutral-900 p-3 font-mono text-xs text-neutral-400"
            >
              Code Block
            </div>
          )
        if (line.trim() === "") return <br key={i} />
        return (
          <p key={i} className="leading-relaxed font-light text-neutral-300">
            {line}
          </p>
        )
      })}
    </div>
  )
}

// --- Main Editor Component ---

interface EditorProps {
  post?: Post
  action: (formData: FormData) => Promise<void>
}

export function Editor({ post, action }: EditorProps) {
  const [isPending, setIsPending] = useState(false)
  const [content, setContent] = useState(post?.content || "")
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [published, setPublished] = useState(post?.published || false)
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImage || "")
  const [readTime, setReadTime] = useState(post?.readTime || "")
  const [isUploading, setIsUploading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    const formData = new FormData(event.currentTarget)
    try {
      await action(formData)
    } catch (error) {
      console.error(error)
      setIsPending(false)
    }
  }

  return (
    <div className="font-instrument min-h-screen bg-black text-neutral-200 selection:bg-neutral-800 selection:text-white">
      {/* Top Bar */}
      <nav className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-neutral-900 bg-black/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-neutral-500 transition-colors hover:text-white">
            <ArrowLeft size={16} />
          </Link>
          <span className="font-instrument text-sm font-medium text-neutral-400">{title || "Untitled Post"}</span>
          <span className="text-sm text-neutral-800">/</span>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${published ? "border-neutral-600 text-neutral-300" : "border-neutral-800 text-neutral-600"}`}
          >
            {published ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="mr-4 flex items-center gap-3">
            <MinimalLabel className="!mb-0 cursor-pointer !text-[10px]" onClick={() => setPublished(!published)}>
              {published ? "Public" : "Private"}
            </MinimalLabel>
            <Toggle checked={published} onCheckedChange={setPublished} />
          </div>
          <MinimalButton type="submit" form="editor-form" disabled={isPending}>
            {isPending ? <Loader2 size={14} className="mr-2 animate-spin" /> : <Save size={14} className="mr-2" />}
            Save Changes
          </MinimalButton>
        </div>
      </nav>

      <form id="editor-form" onSubmit={handleSubmit}>
        {/* Hidden input for published state */}
        <input type="hidden" name="published" value={published ? "on" : ""} />

        <main className="flex h-screen flex-col overflow-hidden pt-14 md:flex-row">
          {/* Left Pane: Editor Inputs */}
          <div className="flex h-full w-full flex-col overflow-y-auto border-r border-neutral-900 bg-black md:w-1/2">
            <div className="mx-auto w-full max-w-2xl space-y-10 p-8 pb-32 md:p-12">
              {/* Meta Fields */}
              <div className="space-y-8">
                <div>
                  <MinimalLabel>Title</MinimalLabel>
                  <MinimalInput
                    name="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="font-instrument text-2xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <MinimalLabel>Slug</MinimalLabel>
                    <MinimalInput
                      name="slug"
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                      placeholder="post-url-slug"
                      className="font-mono text-neutral-400"
                      required
                    />
                  </div>
                  <div>
                    <MinimalLabel>Read Time</MinimalLabel>
                    <MinimalInput
                      name="readTime"
                      value={readTime}
                      onChange={e => setReadTime(e.target.value)}
                      placeholder="e.g. 5 min (auto if blank)"
                      className="font-mono text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <MinimalLabel>Excerpt</MinimalLabel>
                  <AutoResizeTextarea
                    name="excerpt"
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    minRows={2}
                    className="w-full resize-none border-b border-neutral-800 bg-transparent py-2 text-sm leading-relaxed text-neutral-300 placeholder:text-neutral-700 focus:border-white focus:outline-none"
                    placeholder="A brief summary for search engines and social cards..."
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="pt-4">
                <MinimalLabel>Cover Image</MinimalLabel>
                <input type="hidden" name="coverImage" value={coverImageUrl} />

                {coverImageUrl ? (
                  <div className="space-y-2">
                    <div className="group relative mt-2">
                      <img
                        src={coverImageUrl}
                        alt="Cover"
                        className="h-48 w-full rounded-sm border border-neutral-800 object-cover opacity-80 transition-opacity group-hover:opacity-100"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl("")}
                        className="absolute top-2 right-2 rounded-sm bg-black/80 p-1.5 text-white transition-colors hover:bg-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <label className="group relative flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-neutral-800 p-2 text-neutral-500 transition-colors hover:border-neutral-700 hover:bg-neutral-900/30 hover:text-neutral-400">
                      {isUploading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <ImageIcon size={14} className="opacity-50 transition-opacity group-hover:opacity-100" />
                      )}
                      <span className="text-xs tracking-widest uppercase">
                        {isUploading ? "Uploading..." : "Change Image"}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        className="hidden"
                        disabled={isUploading}
                        onChange={async e => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          setIsUploading(true)
                          try {
                            const formData = new FormData()
                            formData.append("file", file)

                            const response = await fetch("/api/upload", {
                              method: "POST",
                              body: formData,
                            })

                            const data = await handleApiResponse<{ url: string }>(response)
                            setCoverImageUrl(data.url)
                          } catch (error) {
                            console.error("Upload error:", error)
                            alert(error instanceof Error ? error.message : "Upload failed")
                          } finally {
                            setIsUploading(false)
                            e.target.value = ""
                          }
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="group relative mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-neutral-800 p-8 text-neutral-500 transition-colors hover:border-neutral-700 hover:bg-neutral-900/30 hover:text-neutral-400">
                    {isUploading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <ImageIcon size={20} className="opacity-50 transition-opacity group-hover:opacity-100" />
                    )}
                    <span className="text-xs tracking-widest uppercase">
                      {isUploading ? "Uploading..." : "Upload Cover"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      className="hidden"
                      disabled={isUploading}
                      onChange={async e => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        setIsUploading(true)
                        try {
                          const formData = new FormData()
                          formData.append("file", file)

                          const response = await fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                          })

                          const data = await handleApiResponse<{ url: string }>(response)
                          setCoverImageUrl(data.url)
                        } catch (error) {
                          console.error("Upload error:", error)
                          alert(error instanceof Error ? error.message : "Upload failed")
                        } finally {
                          setIsUploading(false)
                          e.target.value = ""
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Markdown Editor */}
              <div className="pt-8">
                <MinimalLabel className="mb-4">Content</MinimalLabel>
                <AutoResizeTextarea
                  name="content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  minRows={15}
                  className="w-full resize-none bg-transparent font-mono text-lg leading-relaxed text-neutral-300 placeholder:text-neutral-800 focus:outline-none"
                  placeholder="Write your story here..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Pane: Live Preview */}
          <div className="hidden h-full w-1/2 flex-col overflow-y-auto border-l border-neutral-900/50 bg-[#050505] md:flex">
            <div className="sticky top-0 z-10 flex h-10 items-center gap-2 border-b border-neutral-900 bg-[#050505]/95 px-6 backdrop-blur-sm">
              <Eye size={12} className="text-neutral-500" />
              <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">Live Preview</span>
            </div>

            <div className="mx-auto w-full max-w-2xl p-12">
              {/* Mimic the Blog Reader Header */}
              <div className="mb-12 text-center md:text-left">
                <h1 className="font-instrument mb-4 text-4xl text-white">{title || "Untitled"}</h1>
                <p className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
                  {new Date().toLocaleDateString()} — 5 min read
                </p>
              </div>

              {coverImageUrl && (
                <div className="mb-10 opacity-90 grayscale">
                  <img src={coverImageUrl} className="w-full rounded-sm" alt="Cover preview" />
                </div>
              )}

              <article className="prose prose-invert prose-p:text-neutral-300 prose-headings:font-instrument prose-headings:text-white max-w-none">
                <SimpleMarkdown content={content} />
              </article>
            </div>
          </div>
        </main>
      </form>
    </div>
  )
}
