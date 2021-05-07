import { ActionType } from "@artsy/cohesion"

import * as Schema from "./schema"

interface CohesionAction {
  // TODO: This can be removed once cohesion provides a global `Action` type.
  action: string
}
interface CohesionScreen {
  // TODO: This can be removed once cohesion provides a global `Action` type.
  action: ActionType.screen
  context_screen: string
}
export const isCohesionScreen = (info: CohesionAction | CohesionScreen): info is CohesionScreen =>
  info.action === ActionType.screen

interface LegacyNameAction {
  // TODO: This can be removed once we remove these uses. Currently there is one in `WorksForYou` and one in `ArtistRail`.
  name: string
}

type InfoType = Schema.PageView | Schema.Entity | CohesionAction | CohesionScreen | LegacyNameAction

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

    if (__DEV__) {
      console.log("[Event tracked]", JSON.stringify(info, null, 2))
    }
  })
}
