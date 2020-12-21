import { TappedTabBarArgs } from "@artsy/cohesion"
import { BottomTabType } from "./BottomTabType"
export const bottomTabsConfig: {
  [k in BottomTabType]: {
    route: string
    analyticsDescription: TappedTabBarArgs["tab"]
  }
} = {
  home: {
    route: "/",
    analyticsDescription: "home",
  },
  search: {
    route: "/search",
    analyticsDescription: "search",
  },
  inbox: {
    route: "/inbox",
    analyticsDescription: "inbox",
  },
  sell: {
    route: "/sales",
    analyticsDescription: "sell",
  },
  profile: {
    route: "/my-profile",
    analyticsDescription: "profile",
  },
}
