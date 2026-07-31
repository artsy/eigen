import { parse } from "url"
import { RouteMatcher } from "../../src/app/system/navigation/utils/RouteMatcher"
import type { EigenRoute } from "./parseEigenRoutes"

/** Module names that mean "not handled natively — opens a webview / vanity resolver". */
export const NON_NATIVE_MODULES = new Set(["ReactWebView", "ModalWebView", "VanityURLEntity"])

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
  module: string
  matchedPath: string | null
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
