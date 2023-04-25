export type ShareSheetItem = ShareSheetArtworkItem | ShareSheetSaleItem | ShareSheetArtistItem

export type ShareSheetArtworkItem = {
  type: "artwork"
  slug: string
  currentImageIndex?: number
  artists?: ReadonlyArray<{
    readonly name: string | null
  } | null> | null
  internalID: string
  images: ReadonlyArray<{
    readonly __typename: "Image"
    readonly url: string | null
  }>
  title: string
  href: string
}

export type ShareSheetArtistItem = {
  type: "artist"
  title: string
  internalID: string
  slug: string
  artists?: ReadonlyArray<{
    readonly name: string | null
  } | null> | null
  href: string
  currentImageUrl?: string
}

export type ShareSheetSaleItem = {
  type: "sale"
  slug: string
  internalID: string
  href: string
  title: string
  artists: ReadonlyArray<{
    readonly name: string | null
  } | null> | null
}
