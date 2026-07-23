import { parse } from "url"
// Import eigen's REAL matcher so this tool can't drift from production behavior.
// RouteMatcher's only import is an erased type (AppModule), so tsx/esbuild loads
// it in isolation without pulling in the React Native module graph.
import { EigenRoute } from "./parseEigenRoutes"
import { RouteMatcher } from "../../src/app/system/navigation/utils/RouteMatcher"

/** Module names that mean "not handled natively — opens a webview / vanity resolver". */
const NON_NATIVE_MODULES = new Set(["ReactWebView", "ModalWebView", "VanityURLEntity"])

export interface CompiledEigenRoutes {
  matchers: { matcher: RouteMatcher; name: string; path: string }[]
  warnings: string[]
}

export function compileEigenRoutes(routes: EigenRoute[]): CompiledEigenRoutes {
  const matchers: CompiledEigenRoutes["matchers"] = []
  const warnings: string[] = []

  for (const r of routes) {
    try {
      matchers.push({
        matcher: new RouteMatcher(r.path, r.name as any),
        name: r.name,
        path: r.path,
      })
    } catch (e) {
      warnings.push(
        `Skipped un-compilable eigen route "${r.path}" (${r.name}): ${(e as Error).message}`
      )
    }
  }

  return { matchers, warnings }
}

export interface MatchResult {
  /** The eigen module the URL resolves to (or the fallback). */
  module: string
  /** The eigen route path template that matched, if any. */
  matchedPath: string | null
  /** True when eigen handles this natively; false when it falls to a webview/vanity. */
  isNative: boolean
}

/**
 * Faithfully replicates matchRoute.ts's first-match-wins loop against the
 * artsy.net route table. If nothing matches, eigen falls back to a webview
 * (matchRoute.ts:35-36).
 */
export function classifyURL(url: string, compiled: CompiledEigenRoutes): MatchResult {
  const pathname = parse(url).pathname ?? "/"
  const pathParts = pathname.split(/\/+/).filter(Boolean)

  for (const { matcher, name, path } of compiled.matchers) {
    if (matcher.match(pathParts, {})) {
      return { module: name, matchedPath: path, isNative: !NON_NATIVE_MODULES.has(name) }
    }
  }

  return { module: "ReactWebView", matchedPath: null, isNative: false }
}
