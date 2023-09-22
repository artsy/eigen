import { ContextModule } from "@artsy/cohesion"
import { SearchEntity } from "__generated__/EntitySearchResultsQuery.graphql"
import { Schema } from "app/utils/track"
import { PillType, TappedSearchResultData } from "./types"

export const SEARCH_THROTTLE_INTERVAL = 500

export const TOP_PILL: PillType = {
  displayName: "Top",
  key: "top",
}

export const ARTWORKS_PILL: PillType = {
  displayName: "Artworks",
  key: "artwork",
}

export const ARTIST_PILL: PillType = {
  displayName: "Artist",
  key: "artist",
}

export const ARTICLE_PILL: PillType = {
  displayName: "Article",
  key: "article",
}

export const AUCTION_PILL: PillType = {
  displayName: "Auction",
  key: "sale",
}

export const ARTIST_SERIES_PILL: PillType = {
  displayName: "Artist Series",
  key: "artist_series",
}

export const COLLECTION_PILL: PillType = {
  displayName: "Collection",
  key: "marketing_collection",
}

export const FAIR_PILL: PillType = {
  displayName: "Fair",
  key: "fair",
}

export const SHOW_PILL: PillType = {
  displayName: "Show",
  key: "partner_show",
}

export const GALLERY_PILL: PillType = {
  displayName: "Gallery",
  key: "PartnerGallery",
}

export const SEARCH_PILLS: PillType[] = [
  TOP_PILL,
  ARTWORKS_PILL,
  ARTIST_PILL,
  GALLERY_PILL,
  ARTICLE_PILL,
  AUCTION_PILL,
  ARTIST_SERIES_PILL,
  COLLECTION_PILL,
  FAIR_PILL,
  SHOW_PILL,
]

export const SEARCH_PILLS_WITH_AN_ARTICLE: PillType[] = [
  ARTIST_PILL,
  ARTIST_SERIES_PILL,
  ARTICLE_PILL,
  AUCTION_PILL,
]

interface SearchEntityMap {
  [key: string]: SearchEntity
}

export const SEARCH_PILL_KEY_TO_SEARCH_ENTITY: SearchEntityMap = {
  artwork: "ARTWORK",
  artist: "ARTIST",
  article: "ARTICLE",
  sale: "SALE",
  artist_series: "ARTIST_SERIES",
  marketing_collection: "COLLECTION",
  fair: "FAIR",
  partner_show: "SHOW",
  PartnerGallery: "GALLERY",
}

export const objectTabByContextModule: Partial<Record<ContextModule, string>> = {
  [ContextModule.auctionTab]: "Auction Results",
  [ContextModule.artistsTab]: "Artworks",
}

export const tracks = {
  tappedSearchResult: (data: TappedSearchResultData) => ({
    context_screen_owner_type: Schema.OwnerEntityTypes.Search,
    context_screen: Schema.PageNames.Search,
    query: data.query,
    position: data.position,
    selected_object_type: data.type,
    selected_object_slug: data.slug,
    context_module: data.contextModule,
    action: Schema.ActionNames.SelectedResultFromSearchScreen,
  }),
}
