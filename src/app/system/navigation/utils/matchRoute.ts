import { parse } from "url"
import { AppModule } from "app/Navigation/routes"
import { getDomainMap } from "app/Navigation/utils/getDomainMap"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { parse as parseQueryString } from "query-string"
import { GraphQLTaggedNode } from "react-relay"

export function matchRoute(
  url: string
):
  | { type: "match"; module: AppModule; query?: GraphQLTaggedNode; params: object }
  | { type: "external_url"; url: string } {
  url = decodeProtocolURL(url)

  const parsed = parseURL(url)

  const { pathParts, queryParams } = getParsedURLParts(parsed)

  const domain = (parsed.host || parse(unsafe__getEnvironment().webURL).host) ?? "artsy.net"
  const routes = getDomainMap()[domain as any]

  if (!routes) {
    // Unrecognized domain, let's send the user to Safari or whatever
    return { type: "external_url", url }
  }

  for (const route of routes) {
    const result = route.match(pathParts, queryParams)
    if (result) {
      return { type: "match", module: route.module, params: { ...queryParams, ...result } }
    }
  }

  // This shouldn't ever happen.
  console.error("Unhandled route", url)
  return { type: "match", module: "ReactWebView", params: { url } }
}

function isProtocolEncoded(url: string): boolean {
  const regex = new RegExp("^(http%|https%|%)")
  return regex.test(url)
}

function isEncoded(url: string): boolean {
  return url !== decodeURIComponent(url)
}

function decodeUrl(url: string): string {
  let maxDepth = 10
  // allows to exit the loop in cases of weird custom encoding
  // or for some reason url is encoded more than 10 times
  while (isEncoded(url) && maxDepth > 0) {
    url = decodeURIComponent(url)
    maxDepth--
  }
  return url
}

function decodeProtocolURL(maybeEncodedURL: string): string {
  let url = maybeEncodedURL
  if (isProtocolEncoded(maybeEncodedURL)) {
    // if entire url is encoded, decode!
    // else user will land on VanityUrlEntity for url that otherwise would have been valid
    url = decodeUrl(maybeEncodedURL)
  }

  return url
}

function parseURL(url: string) {
  let parsed = parse(url)
  if (parsed.host && isEncoded(url)) {
    // likely from a deeplinked universal link as we do not pass urls with host in app
    // special characters in paths passed as props in app must be intentional
    parsed = parse(decodeUrl(url))
  }

  return parsed
}

function getParsedURLParts(parsed: ReturnType<typeof parseURL>) {
  const pathParts = parsed.pathname?.split(/\/+/).filter(Boolean) ?? []
  const queryParams: object = parsed.query
    ? parseQueryString(parsed.query, { arrayFormat: "index" })
    : {}

  const hashFragment = parsed.hash?.replace(/^#/, "") || undefined

  return {
    pathParts,
    queryParams: hashFragment ? { ...queryParams, hashFragment } : queryParams,
  }
}
