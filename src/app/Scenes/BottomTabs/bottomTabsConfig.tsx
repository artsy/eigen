import { OwnerType, TappedTabBarArgs } from "@artsy/cohesion"
import { BottomTabType } from "./BottomTabType"

export type BottomTabRoute = "/" | "/search" | "/inbox" | "/sell" | "/my-profile"
export const BottomTabRoutes = ["/", "/search", "/inbox", "/sell", "/my-profile"]

export const bottomTabsConfig: {
  [k in BottomTabType]: {
    route: BottomTabRoute
    analyticsDescription: TappedTabBarArgs["tab"]
  }
} = {
  home: {
    route: "/",
    analyticsDescription: OwnerType.home,
  },
  search: {
    route: "/search",
    analyticsDescription: OwnerType.search,
  },
  inbox: {
    route: "/inbox",
    analyticsDescription: OwnerType.inbox,
  },
  sell: {
    route: "/sell",
    analyticsDescription: OwnerType.sell,
  },
  profile: {
    route: "/my-profile",
    analyticsDescription: OwnerType.profile,
  },
}
