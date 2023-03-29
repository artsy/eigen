import { OwnerType } from "@artsy/cohesion"

// This file must match "ARTabType.m/h"
export const BottomTabOption = {
  home: OwnerType.home,
  search: OwnerType.search,
  inbox: OwnerType.inbox,
  sell: OwnerType.sell,
  profile: OwnerType.profile,
  profile2: "profile2",
} as const

export type BottomTabType = keyof typeof BottomTabOption
