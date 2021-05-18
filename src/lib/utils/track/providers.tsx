import { ActionType, Screen } from "@artsy/cohesion"

import * as Schema from "./schema"

interface CohesionAction {
  // TODO: This can be removed once cohesion provides a global `Action` type.
  action: string
}
export const isCohesionScreen = (info: CohesionAction | Screen): info is Screen => info.action === ActionType.screen

interface LegacyNameAction {
  // TODO: This can be removed once we remove these uses. Currently there is one in `WorksForYou` and one in `ArtistRail`.
  name: string
}

type InfoType = Schema.PageView | Schema.Entity | CohesionAction | Screen | LegacyNameAction

export interface TrackingProvider {
  setup?: () => void
  identify?: (userId: string | null, traits?: { [key: string]: any }) => void
  postEvent: (info: InfoType) => void
}

const providers: { [name: string]: TrackingProvider } = {}

export const _addTrackingProvider = (name: string, provider: TrackingProvider) => {
  provider.setup?.()
  providers[name] = provider
}

export const postEventToProviders = (info: any) => {
  Object.values(providers).forEach((provider) => {
    provider.postEvent(info)
  })
}
