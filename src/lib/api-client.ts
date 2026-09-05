/**
 * API Client Utility
 * Provides consistent error handling and response parsing for fetch requests
 */

/**
 * Handles API response parsing and error extraction
 * @param response - The fetch Response object
 * @returns Parsed JSON data
 * @throws Error with a user-friendly message extracted from the response
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`
    try {
      const errorData = await response.json()
      // Try multiple common error field names
      if (errorData && typeof errorData === "object") {
        for (const key of ["error", "message", "detail"] as const) {
          if (key in errorData) {
            const value: unknown = (errorData as Record<string, unknown>)[key]
            if (typeof value === "string" && value) {
              errorMessage = value
              break
            }
          }
        }
      }
    } catch {
      // If JSON parsing fails, use status text as fallback
      errorMessage = response.statusText || errorMessage
    }
    throw new Error(errorMessage)
  }

  return response.json()
}
