// This file must match "ARTabType.m/h"
export const BottomTabOption = {
  home: "home",
  search: "search",
  inbox: "inbox",
  sell: "sell",
  profile: "profile",
} as const

export type BottomTabType = keyof typeof BottomTabOption
