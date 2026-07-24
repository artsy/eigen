import { execFileSync } from "child_process"

/**
 * Artsy's Apple App Site Association file declares which artsy.net paths are
 * deliberately EXCLUDED from universal links (the `NOT ...` entries). A URL
 * matching one of these will never open the app via a universal link — it opens
 * in the browser. That makes it an authoritative, self-updating source of
 * "intentionally not deep-linked" paths, complementing the manual allowlist.
 *
 * Served at https://www.artsy.net/.well-known/apple-app-site-association by a
 * Cloudflare Worker; the NOT list is maintained in constants.ts in
 * https://github.com/artsy/artsy-eigen-web-association
 */
const DEFAULT_AASA_URL = "https://www.artsy.net/.well-known/apple-app-site-association"
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

export interface AASAExclusions {
  /** Raw `NOT` patterns, e.g. "/login", "/news/*", "/identity-verification*". */
  patterns: string[]
  /** True when a concrete pathname is excluded from universal links. */
  matches: (pathname: string) => boolean
}

export function fetchAASAExclusions(url = DEFAULT_AASA_URL): AASAExclusions {
  const raw = execFileSync("curl", ["-sfL", "-A", BROWSER_UA, url], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  })
  const json = JSON.parse(raw)
  const details: any[] = json?.applinks?.details ?? []

  const notPaths = new Set<string>()
  for (const detail of details) {
    // Legacy "paths" format: ["NOT /login", "NOT /news/*", "*"]
    for (const p of detail.paths ?? []) {
      if (typeof p === "string" && p.startsWith("NOT ")) notPaths.add(p.slice(4).trim())
    }
    // Modern "components" format: [{ "/": "/login", exclude: true }]
    for (const c of detail.components ?? []) {
      if (c && typeof c["/"] === "string" && c.exclude === true) notPaths.add(c["/"])
    }
  }

  const patterns = [...notPaths].filter((p) => p && p !== "/#")
  const matchers = patterns.map(toMatcher)

  return {
    patterns: patterns.sort(),
    matches: (pathname: string) => matchers.some((m) => m(pathname)),
  }
}

/** Convert an AASA path pattern into a predicate over a concrete pathname. */
function toMatcher(pattern: string): (path: string) => boolean {
  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -2) // "/news/*" -> under "/news/"
    return (p) => p === base || p.startsWith(base + "/")
  }
  if (pattern.endsWith("*")) {
    const base = pattern.slice(0, -1) // "/gender-equality*" -> prefix "/gender-equality"
    return (p) => p.startsWith(base)
  }
  if (pattern.includes("*")) {
    const re = new RegExp("^" + pattern.split("*").map(escapeRegExp).join(".*") + "$")
    return (p) => re.test(p)
  }
  return (p) => p === pattern // exact
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
