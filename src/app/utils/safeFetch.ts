import { captureMessage } from "@sentry/react-native"

interface SafeFetchProps<T> {
  url: RequestInfo
  sentryMessage?: string
  onComplete?: (data: T) => void
  onError?: () => void
}

/**
 * Asynchronously fetch data from a specified URL while handling errors.
 *
 * @param {SafeFetchProps} options - The options for the safeFetch function.
 * @param {string} options.url - The URL to fetch data from.
 * @param {string} [options.sentryMessage] - The message to capture in Sentry (optional).
 * @param {(data: T) => void} [options.onComplete] - A callback to execute on a successful fetch (optional).
 * @param {() => void} [options.onError] - A callback to execute when an error occurs during the fetch (optional).
 *
 * @returns {Promise<any>} A promise that resolves to the fetched data or rejects with an error.
 */

export const safeFetch = async <T>({
  url,
  sentryMessage,
  onComplete,
  onError,
}: SafeFetchProps<T>) => {
  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message ?? response.statusText)
    }

    onComplete?.(data)
    return data
  } catch (error) {
    onError?.()

    if (__DEV__) {
      console.error(error)
    } else {
      captureMessage(`${sentryMessage ?? "safeFetch error"} on ${url}: ${error}`, "error")
    }
  }
}
