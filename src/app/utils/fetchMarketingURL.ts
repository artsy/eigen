import { captureMessage } from "@sentry/react-native"
import { isMarketingURL } from "app/utils/isMarketingURL"

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

/**
 * Whether `resolved` is an artsy.net page that the marketing link `url` redirected to. Marketing
 * hosts don't count, so a redirect that ends on another tracking link can't loop.
 */
const isArtsyRedirectTarget = (url: string, resolved: string) => {
  return (
    resolved !== url &&
    /^https:\/\/([a-z0-9-]+\.)*artsy\.net(\/|\?|#|$)/i.test(resolved) &&
    !isMarketingURL(resolved)
  )
}

/**
 * Logged when a marketing link's destination page refused the request and the app used the
 * redirect instead. The e2e runner (scripts/utils/run_agent_device_suite) looks for this marker in
 * the device log, to report whether a deeplink flow hit Cloudflare's challenge, so keep it in sync.
 */
export const MARKETING_LINK_FALLBACK_MARKER = "[marketing-link-fallback]"

const reportRedirectFallback = (url: string, status: number, cfMitigated: string | null) => {
  const message = `${MARKETING_LINK_FALLBACK_MARKER} destination answered ${status}${
    cfMitigated ? ` (cf-mitigated: ${cfMitigated})` : ""
  }, opening the redirect target instead`

  if (__DEV__) {
    console.warn(message)
    return
  }

  // Release bundles strip every console call but console.error (see babel.config.js), and this one
  // is what reaches the device log for the e2e runner
  console.error(message)
  captureMessage(
    "[handleDeepLink] Marketing link destination refused the request, used the redirect",
    {
      level: "info",
      tags: { cf_mitigated: cfMitigated ?? "none", status: String(status) },
      extra: { url },
    }
  )
}

export const fetchMarketingURL = async (url: string) => {
  try {
    const response = await fetch(url)

    // The redirect worked even when the page it led to refused us: Cloudflare's bot challenge on
    // www.artsy.net answers this kind of request with a 403. We only need the destination URL, and
    // the app loads that screen through Metaphysics, not from that page.
    if (!response.ok && response.url && isArtsyRedirectTarget(url, response.url)) {
      reportRedirectFallback(url, response.status, response.headers?.get("cf-mitigated") ?? null)
      return response.url
    }

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
