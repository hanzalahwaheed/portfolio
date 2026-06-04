export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

// Turn markdown (an excerpt or full post body) into a clean meta-description:
// strip markdown syntax, collapse whitespace, and truncate on a word boundary.
export function toMetaDescription(source: string, maxLength = 160): string {
  const plainText = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (plainText.length <= maxLength) return plainText

  const truncated = plainText.slice(0, maxLength - 1)
  const lastSpace = truncated.lastIndexOf(" ")
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : truncated.length).trim()}…`
}
