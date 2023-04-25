import { ShareSheet_ArtistQuery$data } from "__generated__/ShareSheet_ArtistQuery.graphql"
import { ShareSheet_ArtworkQuery$data } from "__generated__/ShareSheet_ArtworkQuery.graphql"
import { ShareSheet_SaleQuery$data } from "__generated__/ShareSheet_SaleQuery.graphql"

export type ShareSheetItem = ShareSheetArtworkItem | ShareSheetSaleItem | ShareSheetArtistItem

export type ShareSheetArtworkItem = {
  type: "artwork"
  slug: string
  currentImageIndex?: number
}

export type ShareSheetArtistItem = {
  type: "artist"
  slug: string
}

export type ShareSheetSaleItem = {
  type: "sale"
  slug: string
}

export type ShareableType = "artwork" | "artist" | "sale"

export type ShareSheetItemData =
  | ShareSheet_SaleQuery$data
  | ShareSheet_ArtworkQuery$data
  | ShareSheet_ArtistQuery$data
