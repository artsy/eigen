import { parse } from "url"
import { AppModule } from "app/AppRegistry"
import { ArtsyWebViewConfig } from "app/Components/ArtsyWebView"
import { __unsafe_mainModalStackRef } from "app/NativeModules/ARScreenPresenterModule"
import { getDomainMap } from "app/routes"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { RouteMatcher } from "app/system/navigation/RouteMatcher"
import { parse as parseQueryString } from "query-string"
import { GraphQLTaggedNode } from "relay-runtime"

export function matchRoute(
  url: string
):
  | { type: "match"; module: AppModule; query?: GraphQLTaggedNode; params: object }
  | { type: "external_url"; url: string } {
  if (isProtocolEncoded(url)) {
    // if entire url is encoded, decode!
    // else user will land on VanityUrlEntity for url that otherwise would have been valid
    url = decodeUrl(url)
  }
  let parsed = parse(url)
  if (parsed.host && isEncoded(url)) {
    // likely from a deeplinked universal link as we do not pass urls with host in app
    // special characters in paths passed as props in app must be intentional
    parsed = parse(decodeUrl(url))
  }
  const pathParts = parsed.pathname?.split(/\/+/).filter(Boolean) ?? []
  const queryParams: object = parsed.query
    ? parseQueryString(parsed.query, { arrayFormat: "index" })
    : {}

  const domain = (parsed.host || parse(unsafe__getEnvironment().webURL).host) ?? "artsy.net"
  const routes = getDomainMap()[domain as any]

  if (!routes) {
    // Unrecognized domain, let's send the user to Safari or whatever
    return {
      type: "external_url",
      url,
    }
  }

  for (const route of routes) {
    const result = route.match(pathParts)
    if (result) {
      return {
        type: "match",
        module: route.module,
        params: { ...queryParams, ...result },
      }
    }
  }

  // This shouldn't ever happen.
  console.error("Unhandled route", url)
  return {
    type: "match",
    module: "ReactWebView",
    params: { url },
  }
}

export const addRoute = (route: string, module: AppModule, paramsMapper?: (val: any) => object) => {
  return new RouteMatcher(route, module, paramsMapper)
}

export function addWebViewRoute(url: string, config?: ArtsyWebViewConfig) {
  return addRoute(
    url,
    config?.alwaysPresentModally ? "ModalWebView" : "ReactWebView",
    (params) => ({
      url: replaceParams(url, params),
      ...config,
    })
  )
}

export function replaceParams(url: string, params: any) {
  url = url.replace(/\*$/, params["*"])
  let match = url.match(/:(\w+)/)
  while (match) {
    const key = match[1]
    if (!(key in params)) {
      console.error("[replaceParams]: something is very wrong", key, params)
      return url
    }
    url = url.replace(":" + key, params[key])
    match = url.match(/:(\w+)/)
  }
  return url
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

type ModuleMap = {
  [key in AppModule]: {
    route: string
    params: string[]
  }
}

export function getModuleMap(): ModuleMap {
  const domainMap = getDomainMap()
  const artsyDotNetRoutes = domainMap["artsy.net"]

  const moduleMap = {} as ModuleMap

  if (artsyDotNetRoutes) {
    artsyDotNetRoutes.forEach((moduleDescriptor) => {
      if (
        // Some routes have the same module name, so we need to check if it's already in the map
        // before adding it
        !moduleMap[moduleDescriptor["module"]] &&
        moduleDescriptor["module"] !== "ModalWebView" &&
        moduleDescriptor["module"] !== "ReactWebView"
      ) {
        moduleMap[moduleDescriptor["module"]] = {
          route: moduleDescriptor["route"],
          params: moduleDescriptor["parts"]
            .filter((part) => part.type === "variable")
            .map((part) => (part as any).name),
        }
      }
    })
  }

  return moduleMap
}

// Helper method that returns the current URL
export const getCurrentURL = () => {
  const moduleMap = getModuleMap()
  const moduleDescriptor = __unsafe_mainModalStackRef.current?.getCurrentRoute()?.params as any

  const { webURL } = unsafe__getEnvironment()

  const currentModuleName = moduleDescriptor?.moduleName as AppModule | undefined
  if (!currentModuleName) {
    return
  }

  const currentModuleProps = moduleDescriptor.props

  const currentModule = moduleMap[currentModuleName]

  let { route: path } = currentModule

  if (currentModuleProps) {
    Object.entries(currentModuleProps).map(([key, value]) => {
      path = path.replace(`:${key}`, value as string)
    })
  }

  return encodeURI(`${webURL}${path}`)
}
