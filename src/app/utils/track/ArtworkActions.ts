import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Schema } from "app/utils/track"
import { isNil, omitBy, pick } from "lodash"

class ArtworkActionTracking {
  constructor(
    readonly contextModule?: ContextModule,
    readonly contextScreenOwnerType?: ScreenOwnerType,
    readonly contextScreenOwnerId?: string,
    readonly contextScreenOwnerSlug?: string,
    readonly contextScreen?: string,
    readonly contextScreenQuery?: string
  ) {}
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ArtworkActionTrackingProps extends ArtworkActionTracking {}

// given an object obj that contains some keys of ArtworkActionTrackingProps, extract only the key/value
// of ArtworkActionTrackingProps partial
export const extractArtworkActionTrackingProps = (obj: {} & ArtworkActionTrackingProps) => {
  return pick(obj, Object.keys(new ArtworkActionTracking()))
}

export const tracks = {
  saveOrUnsaveArtwork: (saved: boolean, params?: object) =>
    omitBy(
      {
        action: Schema.ActionTypes.Success,
        action_name: saved ? Schema.ActionNames.ArtworkSave : Schema.ActionNames.ArtworkUnsave,
        action_type: Schema.ActionTypes.Success,
        ...params,
      },
      isNil
    ),
}
