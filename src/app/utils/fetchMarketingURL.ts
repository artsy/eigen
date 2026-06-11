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

/**
 * Recover the resolved destination URL from a landing page's HTML.
 *
 * On Android (RN 0.83), `Response.url` returns the original pre-redirect URL instead of the
 * final one (a regression in RN's prebuilt NetworkingModule, commit 3cf6bff2 — and not fixable
 * via a node_modules patch since RN Android ships as a prebuilt AAR). The redirect IS followed,
 * so the response body is the destination page; we read its canonical / og:url meta tag to get
 * the resolved URL. Note: these tags usually omit query params (e.g. utm_*), which is fine for
 * routing since `matchRoute` keys off the path.
 */
const extractResolvedURLFromBody = (html: string): string | null => {
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)
  if (canonical?.[1]) {
    return canonical[1]
  }

  const ogURL =
    html.match(/<meta[^>]+property=["']og:url["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:url["']/i)
  if (ogURL?.[1]) {
    return ogURL[1]
  }

  return null
}

export const fetchMarketingURL = async (url: string) => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorMessage = `HTTP error! status: ${response.status}`
      captureFetchError(errorMessage, url, response.status)
      return null
    }

    let resolved = response.url

    // Android fallback: when `response.url` didn't pick up the redirect, recover the
    // destination from the landing page body (see extractResolvedURLFromBody).
    if (!resolved || resolved === url) {
      const fromBody = extractResolvedURLFromBody(await response.text())
      if (fromBody) {
        resolved = fromBody
      }
    }

    return resolved
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    captureFetchError(errorMessage, url)
    return null
  }
}
