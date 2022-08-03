export interface PhotoEntity {
  path: string
  width: number
  height: number
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
}
