import { OwnerType, TappedTabBarArgs } from "@artsy/cohesion"
import { BottomTabType } from "./BottomTabType"
export const bottomTabsConfig: {
  [k in BottomTabType]: {
    route: string
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
    route: "/sales",
    analyticsDescription: OwnerType.sell,
  },
  profile: {
    route: "/my-profile",
    analyticsDescription: OwnerType.profile,
  },
}
