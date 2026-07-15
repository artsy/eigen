// Thin wrapper around the Notion REST API.
// Requires a NOTION_RELEASE_LOOKOUT_TOKEN (an internal integration secret) with the template
// page and its parent shared to the integration.
const NOTION_VERSION = "2026-03-11"
const MAX_RETRIES = 4
// Abort a single request that stalls, so a hung connection can't wedge the job.
const REQUEST_TIMEOUT_MS = 30_000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// fetch with a hard per-request timeout, so a stalled connection aborts (and is
// then retried) instead of hanging the job. Uses AbortController + setTimeout
// for broad runtime support (AbortSignal.timeout isn't in our TS lib types).
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<Response> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export const notion = async <T = unknown>(path: string, options?: RequestInit): Promise<T> => {
  for (let attempt = 0; ; attempt++) {
    let res: Response
    try {
      res = await fetchWithTimeout(`https://api.notion.com/v1${path}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${process.env.NOTION_RELEASE_LOOKOUT_TOKEN ?? ""}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
          ...options?.headers,
        },
      })
    } catch (error) {
      // A timeout (AbortSignal) or network error throws here. Treat it as
      // transient and retry with backoff, same as a 5xx.
      if (attempt < MAX_RETRIES) {
        const delay = 2 ** attempt * 500
        console.warn(
          `Notion request failed (${error}); retrying in ${delay}ms (attempt ${
            attempt + 1
          }/${MAX_RETRIES})`
        )
        await sleep(delay)
        continue
      }
      throw error
    }
    if (res.ok) return res.json() as Promise<T>

    // Retry rate limits (429) and transient server errors (5xx) with backoff.
    const retryable = res.status === 429 || res.status >= 500
    if (retryable && attempt < MAX_RETRIES) {
      const retryAfter = Number(res.headers.get("Retry-After"))
      const delay = retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 500
      console.warn(
        `Notion API ${res.status}; retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`
      )
      await sleep(delay)
      continue
    }

    const body = await res.text()
    throw new Error(`Notion API error ${res.status}: ${body}`)
  }
}

// Extracts the 32-char page ID from a Notion URL (or returns the input if it is
// already an ID). URLs look like:
//   https://www.notion.so/artsy/Some-Title-<32hexchars>?pvs=4
// The ID is always the trailing token, so we anchor to the end of the path —
// otherwise hex-like letters in the title slug (e.g. the "A" in "QA") shift the
// match and yield the wrong ID.
export const extractPageId = (urlOrId: string): string => {
  const cleaned = urlOrId
    .split(/[?#]/)[0] // drop query/hash
    .replace(/\/+$/, "") // drop trailing slashes
    .replace(/-/g, "") // drop hyphens (title separators + UUID dashes)
  const match = cleaned.match(/[0-9a-f]{32}$/i)
  if (!match) throw new Error(`Could not find a Notion page ID in: ${urlOrId}`)
  const id = match[0]
  // Re-hyphenate into the canonical UUID form the API expects.
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(
    20
  )}`
}
