import { parse } from "url"
import { liveDotArtsyDotNet, artsyDotNet } from "app/Navigation/routes"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { RouteMatcher } from "app/system/navigation/utils/RouteMatcher"

export function getDomainMap(): Record<string, RouteMatcher[] | null> {
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
