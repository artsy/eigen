import { parse } from "url"
import { artsyDotNetRoutes, liveDotArtsyRoutes } from "app/Navigation/routes"
import { addRoute } from "app/Navigation/utils/addRoute"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { RouteMatcher } from "app/system/navigation/utils/RouteMatcher"
import { compact } from "lodash"

// The RouteMatcher arrays are a pure function of the static route tables in
// routes.tsx, so we build them once and reuse them. Previously they were rebuilt
// (a `new RouteMatcher` per route, each running a regex validation) on every
// `getDomainMap()` call — i.e. on every `matchRoute`/`navigate`/prefetch — which
// dwarfed the actual match. Only the webURL-host key below is environment
// dependent, so the cheap wrapper object is still rebuilt per call to stay
// correct across environment switches.
let cachedLiveDotArtsy: RouteMatcher[] | undefined
let cachedArtsyDotNet: RouteMatcher[] | undefined

export function getDomainMap(): Record<string, RouteMatcher[] | null> {
  if (!cachedLiveDotArtsy) {
    cachedLiveDotArtsy = compact(
      liveDotArtsyRoutes.map(({ path, injectParams, ...screenDescriptor }) =>
        addRoute(path, screenDescriptor, injectParams)
      )
    )
  }

  if (!cachedArtsyDotNet) {
    cachedArtsyDotNet = compact(
      artsyDotNetRoutes.map(({ path, injectParams, ...screenDescriptor }) =>
        addRoute(path, screenDescriptor, injectParams)
      )
    )
  }

  const routesForDomain = {
    "live.artsy.net": cachedLiveDotArtsy,
    "live-staging.artsy.net": cachedLiveDotArtsy,
    "staging.artsy.net": cachedArtsyDotNet,
    "artsy.net": cachedArtsyDotNet,
    "www.artsy.net": cachedArtsyDotNet,
    [parse(unsafe__getEnvironment().webURL).host ?? "artsy.net"]: cachedArtsyDotNet,
  }

  return routesForDomain
}
