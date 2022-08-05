export interface PhotoEntity {
  path: string
  width: number
  height: number
}

export interface FocusCoords {
  x: number
  y: number
}

// tslint:disable-next-line:interface-over-type-literal
export type ReverseImageNavigationStack = {
  Camera: undefined
  MultipleResults: {
    artworkIDs: string[]
  }
  ArtworkNotFound: {
    photoPath: string
  }
  Artwork: {
    artworkId: string
  }
  Preview: {
    photo: PhotoEntity
  }
}
