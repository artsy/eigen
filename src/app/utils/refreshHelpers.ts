import EventEmitter from "events"

export const RefreshEvents = new EventEmitter()
RefreshEvents.setMaxListeners(20)

export const FAVORITE_ARTWORKS_REFRESH_KEY = "refreshFavoriteArtworks"
export const MY_COLLECTION_REFRESH_KEY = "refreshMyCollection"
export const MY_COLLECTION_INSIGHTS_REFRESH_KEY = "refreshMyCollectionInsights"

export const refreshMyCollection = () => {
  RefreshEvents.emit(MY_COLLECTION_REFRESH_KEY)
}

export const refreshMyCollectionInsights = ({ collectionHasArtworksWithoutInsights = false }) => {
  RefreshEvents.emit(MY_COLLECTION_INSIGHTS_REFRESH_KEY, { collectionHasArtworksWithoutInsights })
}

export const refreshFavoriteArtworks = () => {
  RefreshEvents.emit(FAVORITE_ARTWORKS_REFRESH_KEY)
}
