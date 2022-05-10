import EventEmitter from "events"

export const RefreshEvents = new EventEmitter()

export const FAVORITE_ARTWORKS_REFRESH_KEY = "refreshFavoriteArtworks"
export const MY_COLLECTION_REFRESH_KEY = "refreshMyCollection"

export const refreshMyCollection = () => {
  RefreshEvents.emit(MY_COLLECTION_REFRESH_KEY)
}

export const refreshFavoriteArtworks = () => {
  RefreshEvents.emit(FAVORITE_ARTWORKS_REFRESH_KEY)
}
