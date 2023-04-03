import EventEmitter from "events"
import { PAGE_SIZE } from "app/Components/constants"
import { useState } from "react"
import { RefreshControl } from "react-native"

export const RefreshEvents = new EventEmitter()
RefreshEvents.setMaxListeners(20)

export const FAVORITE_ARTWORKS_REFRESH_KEY = "refreshFavoriteArtworks"
export const MY_COLLECTION_REFRESH_KEY = "refreshMyCollection"
export const MY_COLLECTION_INSIGHTS_REFRESH_KEY = "refreshMyCollectionInsights"
export const HOME_SCREEN_REFRESH_KEY = "refreshHomeScreen"

export const refreshOnArtworkSave = () => {
  refreshFavoriteArtworks()
  refreshHomeScreen()
}

export const refreshOnArtistFollow = () => {
  refreshHomeScreen()
}

export const refreshHomeScreen = () => {
  RefreshEvents.emit(HOME_SCREEN_REFRESH_KEY)
}

export const refreshMyCollection = () => {
  RefreshEvents.emit(MY_COLLECTION_REFRESH_KEY)
}

export const refreshMyCollectionInsights = ({ collectionHasArtworksWithoutInsights = false }) => {
  RefreshEvents.emit(MY_COLLECTION_INSIGHTS_REFRESH_KEY, { collectionHasArtworksWithoutInsights })
}

export const refreshFavoriteArtworks = () => {
  RefreshEvents.emit(FAVORITE_ARTWORKS_REFRESH_KEY)
}

export const useRefreshControl = (refetch: any, pageSize: number = PAGE_SIZE) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    refetch(
      { count: pageSize },
      {
        fetchPolicy: "store-and-network",
        onComplete: () => {
          setIsRefreshing(false)
        },
      }
    )
  }

  return <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
}
