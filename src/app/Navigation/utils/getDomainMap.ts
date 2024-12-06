import { parse } from "url"
import { artsyDotNetRoutes, liveDotArtsyRoutes } from "app/Navigation/routes"
import { addRoute } from "app/Navigation/utils/addRoute"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { RouteMatcher } from "app/system/navigation/utils/RouteMatcher"
import { compact } from "lodash"

export function getDomainMap(): Record<string, RouteMatcher[] | null> {
  const liveDotArtsyDotNet: RouteMatcher[] = compact(
    liveDotArtsyRoutes.map(({ path, injectParams, ...screenDescriptor }) =>
      addRoute(path, screenDescriptor, injectParams)
    )
  )

  const artsyDotNet = compact(
    artsyDotNetRoutes.map(({ path, injectParams, ...screenDescriptor }) =>
      addRoute(path, screenDescriptor, injectParams)
    )
  )

  const routesForDomain = {
    "live.artsy.net": liveDotArtsyDotNet,
    "live-staging.artsy.net": liveDotArtsyDotNet,
    "staging.artsy.net": artsyDotNet,
    "artsy.net": artsyDotNet,
    "www.artsy.net": artsyDotNet,
    [parse(unsafe__getEnvironment().webURL).host ?? "artsy.net"]: artsyDotNet,
  }

  return routesForDomain
}
