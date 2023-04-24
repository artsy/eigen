export type ShareSheetItem = ShareSheetArtworkItem | ShareSheetSaleItem | ShareSheetArtistItem

export type ShareSheetArtworkItem = {
  type: "artwork"
  slug: string | null
  currentImageIndex?: number
  artists: ReadonlyArray<{
    readonly name: string | null
  } | null> | null
  internalID: string
  images: ReadonlyArray<
    | {
        readonly __typename: "Image"
        readonly url: string | null
      }
    | {
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        readonly __typename: "%other"
      }
  >
  title: string
  href: string | null
}

export type ShareSheetArtistItem = {
  type: "artist"
  internalID: string
  slug: string
  artistNames: string[]
  href: string
  currentImageUrl?: string
}

export type ShareSheetSaleItem = {
  type: "sale"
  slug: string
  internalID: string
}
