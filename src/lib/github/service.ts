import { GitHubSearchIssueItem, GitHubSearchResponse, Contribution } from "./types"
import { transformToContribution } from "./transformers"
import { handleApiResponse } from "../api-client"
import { toRateLimitError } from "./errors"

/**
 * GitHub Service
 * A reusable service class for interacting with the GitHub API
 */
export class GitHubService {
  private readonly baseUrl = "https://api.github.com"
  private readonly userAgent = "Portfolio-App"

  async getLatestContributions(username: string, limit: number = 10): Promise<Contribution[]> {
    const mergedPrQuery = `author:${username} is:public is:pr is:merged -user:${username}`
    const issueQuery = `author:${username} is:public is:issue -user:${username}`

    const [mergedPrs, issues] = await Promise.all([
      this.searchIssues(mergedPrQuery, limit),
      this.searchIssues(issueQuery, limit),
    ])

    const contributionsByUrl = new Map<string, GitHubSearchIssueItem>()

    for (const item of [...mergedPrs, ...issues]) {
      contributionsByUrl.set(item.html_url, item)
    }

    return [...contributionsByUrl.values()]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
      .map(transformToContribution)
  }

  private async searchIssues(query: string, limit: number): Promise<GitHubSearchIssueItem[]> {
    const url = `${this.baseUrl}/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=${limit}`

    const token = process.env.GITHUB_TOKEN

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": this.userAgent,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    const rateLimitError = toRateLimitError(response)
    if (rateLimitError) {
      throw rateLimitError
    }

    const data = await handleApiResponse<GitHubSearchResponse>(response)
    return data.items
  }
}

// Export a singleton instance for convenience
export const githubService = new GitHubService()
