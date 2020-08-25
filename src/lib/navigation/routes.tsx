import { parse as parseQueryString } from "query-string"
import { parse } from "url"
import { RouteMatcher } from "./RouteMatcher"

export function matchRoute(url: string) {
  const parsed = parse(url)
  const pathParts = parsed.pathname?.split(/\/+/).filter(Boolean) ?? []
  const queryParams: object = parsed.query ? parseQueryString(parsed.query) : {}

  for (const route of routes) {
    const result = route.match(pathParts)
    if (result) {
      return {
        module: route.module,
        params: { ...queryParams, ...result },
      }
    }
  }

  return null
}

const routes: RouteMatcher[] = [
  new RouteMatcher("/", "Home"),
  new RouteMatcher("/artist/:slug", "Artist"),
  new RouteMatcher("/artwork/:slug", "Artwork"),
]
