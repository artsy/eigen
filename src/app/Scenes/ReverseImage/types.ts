import { SearchImageHeaderButtonOwner } from "app/Components/SearchImageHeaderButton"

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

// tslint:disable-next-line:interface-over-type-literal
export type ReverseImageNavigationStack = {
  Camera: {
    owner: SearchImageHeaderButtonOwner
  }
  MultipleResults: {
    photoPath: string
    artworkIDs: string[]
    owner: SearchImageHeaderButtonOwner
  }
  ArtworkNotFound: {
    photoPath: string
  }
  Preview: {
    photo: PhotoEntity
    owner: SearchImageHeaderButtonOwner
  }
}
