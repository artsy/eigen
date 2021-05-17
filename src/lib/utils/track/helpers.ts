import { ActionType, Screen } from "@artsy/cohesion"

export const screen = (info: Omit<Screen, "action">): Screen => ({
  action: ActionType.screen,
  ...info,
})
