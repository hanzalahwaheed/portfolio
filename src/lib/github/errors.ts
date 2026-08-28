/**
 * GitHub API Errors
 */

export class GitHubRateLimitError extends Error {
  readonly resetAt?: Date

  constructor(message: string, resetAt?: Date) {
    super(message)
    this.name = "GitHubRateLimitError"
    this.resetAt = resetAt
  }
}

export function toRateLimitError(response: Response): GitHubRateLimitError | null {
  const isRateLimitStatus = response.status === 403 || response.status === 429
  const remaining = response.headers.get("x-ratelimit-remaining")

  if (!isRateLimitStatus || remaining !== "0") {
    return null
  }

  const reset = response.headers.get("x-ratelimit-reset")
  const resetAt = reset ? new Date(Number(reset) * 1000) : undefined
  const suffix = resetAt ? ` Quota resets at ${resetAt.toISOString()}.` : ""

  return new GitHubRateLimitError(`GitHub API rate limit exceeded.${suffix}`, resetAt)
}
