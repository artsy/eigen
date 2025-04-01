import { OwnerType } from "@artsy/cohesion"

// This file must match "ARTabType.m/h"
export const BottomTabOption = {
  home: OwnerType.home,
  search: OwnerType.search,
  inbox: OwnerType.inbox,
  favorites: OwnerType.favorites,
  profile: OwnerType.profile,
} as const

export type BottomTabType = keyof typeof BottomTabOption
