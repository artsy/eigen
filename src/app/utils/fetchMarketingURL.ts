import { captureMessage } from "@sentry/react-native"

export const fetchMarketingURL = async (url: string) => {
  try {
    const response = await fetch(url)
    return response.url
  } catch (error) {
    if (__DEV__) {
      console.warn(
        `[handleDeepLink] Error fetching marketing url redirect on: ${url} failed with error: ${error}`
      )
    } else {
      captureMessage(
        `[handleDeepLink] Error fetching marketing url redirect on: ${url} failed with error: ${error}`,
        "error"
      )
    }
    return null
  }
}
