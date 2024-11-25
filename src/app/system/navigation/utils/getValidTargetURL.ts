import { captureMessage } from "@sentry/react-native"

/**
 * This helper function is used to convert the href to a valid screen name that can be navigated to.
 * This is required because the href can be a non trivial marketing url that needs additional handling.
 * @param url
 * @returns targetURL
 */
export const getValidTargetURL = async (url: string) => {
  let targetURL = url

  targetURL = url.replace("artsy://", "")

  // marketing url requires redirect
  if (targetURL.startsWith("https://click.artsy.net")) {
    let response
    try {
      response = await fetch(targetURL)
    } catch (error) {
      if (__DEV__) {
        console.warn(error)
      } else {
        captureMessage(
          `[navigate] Error fetching marketing url redirect on: ${targetURL} failed with error: ${error}`,
          "error"
        )
      }
    }

    if (response?.url) {
      targetURL = response.url
    }
  }

  return targetURL
}
