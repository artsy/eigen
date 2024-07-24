import { ActionType, Screen } from "@artsy/cohesion"

import * as Schema from "./schema"

interface CohesionAction {
  // TODO: This can be removed once cohesion provides a global `Action` type.
  action: string
}

type NativeIOSTrackingEventID =
  | {
      // identifier for native ios events for tracking
      screen_name: string
    }
  | {
      event_name: string
      UIApplicationState?: string
      url?: string
      message?: string
      label?: string
    }

export const isCohesionScreen = (info: CohesionAction | Screen): info is Screen =>
  info.action === ActionType.screen

interface LegacyNameAction {
  // TODO: This can be removed once we remove these uses. Currently there is one in `WorksForYou` and one in `ArtistRail`.
  name: string
}

export type InfoType =
  | Schema.PageView
  | Schema.Entity
  | CohesionAction
  | Screen
  | LegacyNameAction
  | NativeIOSTrackingEventID

export interface TrackingProvider {
  setup?: () => void
  identify?: (userId?: string, traits?: { [key: string]: any }) => void
  postEvent: (info: InfoType) => void
}

const providers: { [name: string]: TrackingProvider } = {}

export const _addTrackingProvider = (name: string, provider: TrackingProvider) => {
  provider.setup?.()
  providers[name] = provider
}

export const postEventToProviders = (info: any) => {
  Object.values(providers).forEach((provider) => {
    console.log("Posting event to provider", provider)
    provider.postEvent(info)
  })
}
