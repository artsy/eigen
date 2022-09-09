import { ScreenOwnerType } from "@artsy/cohesion"

export interface PhotoEntity {
  path: string
  width: number
  height: number
  fromLibrary?: boolean
}

export interface FocusCoords {
  x: number
  y: number
}

export interface ReverseImageOwner {
  id: string
  slug: string
  type: ScreenOwnerType
}

// tslint:disable-next-line:interface-over-type-literal
export type ReverseImageNavigationStack = {
  Camera: {
    owner: ReverseImageOwner
  }
  MultipleResults: {
    photoPath: string
    artworkIDs: string[]
    owner: ReverseImageOwner
  }
  ArtworkNotFound: {
    photoPath: string
  }
  Preview: {
    photo: PhotoEntity
    owner: ReverseImageOwner
  }
}
