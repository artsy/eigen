import { captureMessage } from "@sentry/react-native"

const captureFetchError = (errorMessage: string, url: string, status?: number) => {
  if (__DEV__) {
    console.warn(
      `[handleDeepLink] Error fetching marketing url redirect on: ${url} failed with error: ${errorMessage}`
    )
  } else {
    captureMessage(`[handleDeepLink] Error fetching marketing url redirect`, {
      level: "error",
      extra: {
        error: errorMessage,
        url,
        status,
      },
    })
  }
}

export const fetchMarketingURL = async (url: string) => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`
      captureFetchError(errorMessage, url, response.status)
      return null
    }
    return response.url
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    captureFetchError(errorMessage, url)
    return null
  }
}
