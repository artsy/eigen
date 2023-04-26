import { ScreenOwnerType } from "@artsy/cohesion"
import { Schema } from "app/utils/track"
import lodash from "lodash"

export interface ArtworkActionTrackingProps {
  contextModule?: string
  contextScreenOwnerType?: ScreenOwnerType
  contextScreenOwnerId?: string
  contextScreenOwnerSlug?: string
  contextScreen?: string
  contextScreenQuery?: string
}

export const tracks = {
  saveOrUnsaveArtwork: (saved: boolean, params: any = {}) =>
    lodash.omitBy(
      {
        action_name: saved ? Schema.ActionNames.ArtworkSave : Schema.ActionNames.ArtworkUnsave,
        action_type: Schema.ActionTypes.Success,
        ...params,
      },
      lodash.isNil
    ),
}
