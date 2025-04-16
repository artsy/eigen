import { OwnerType, TappedTabBarArgs } from "@artsy/cohesion"
import { BottomTabType } from "./BottomTabType"

export type BottomTabRoute = "/" | "/search" | "/inbox" | "/favorites" | "/my-profile"
export const BottomTabRoutes = ["/", "/search", "/inbox", "/favorites", "/my-profile"]

export const bottomTabsConfig: {
  [k in BottomTabType]: {
    route: BottomTabRoute
    analyticsDescription: TappedTabBarArgs["tab"]
    name: string
    visualClues?: string[]
  }
} = {
  home: {
    route: "/",
    analyticsDescription: OwnerType.home,
    name: "For you",
  },
  search: {
    route: "/search",
    analyticsDescription: OwnerType.search,
    name: "Search",
  },
  inbox: {
    route: "/inbox",
    analyticsDescription: OwnerType.inbox,
    name: "Inbox",
  },
  favorites: {
    route: "/favorites",
    analyticsDescription: OwnerType.favorites,
    name: "Favorites",
  },
  profile: {
    route: "/my-profile",
    analyticsDescription: OwnerType.profile,
    name: "Profile",
  },
}
