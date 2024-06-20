export type ShareSheetItem =
  | ShareSheetArtworkItem
  | ShareSheetSaleItem
  | ShareSheetArtistItem
  | ShareSheetDefaultItem

export type ShareSheetArtworkItem = {
  type: "artwork"
  slug: string
  currentImageIndex?: number
  artists?:
    | ReadonlyArray<
        | {
            readonly name: string | null | undefined
          }
        | null
        | undefined
      >
    | null
    | undefined
  internalID: string
  images: ReadonlyArray<{
    readonly __typename: "Image"
    readonly imageURL: string | null | undefined
  }>
  title: string
  href: string
}

export type ShareSheetArtistItem = {
  type: "artist"
  title: string
  internalID: string
  slug: string
  artists?:
    | ReadonlyArray<
        | {
            readonly name: string | null | undefined
          }
        | null
        | undefined
      >
    | null
    | undefined
  href: string
  currentImageUrl?: string
}

export type ShareSheetSaleItem = {
  type: "sale"
  slug: string
  internalID: string
  href: string
  title: string
  artists:
    | ReadonlyArray<
        | {
            readonly name: string | null | undefined
          }
        | null
        | undefined
      >
    | null
    | undefined
}

export type ShareSheetDefaultItem = {
  type: "default"
  slug: string
  internalID: string
  href: string
  title: string
  artists?:
    | ReadonlyArray<
        | {
            readonly name: string | null | undefined
          }
        | null
        | undefined
      >
    | null
    | undefined
}
