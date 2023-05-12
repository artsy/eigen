import EventEmitter from "events"
import { PAGE_SIZE } from "app/Components/constants"
import { useState } from "react"
import { RefreshControl } from "react-native"

export const RefreshEvents = new EventEmitter()
RefreshEvents.setMaxListeners(20)

// TODO: Rename to FAVORITE_ARTWORK_LISTS_REFRESH_KEY when `AREnableArtworkLists` is released
export const FAVORITE_ARTWORKS_REFRESH_KEY = "refreshFavoriteArtworks"
export const MY_COLLECTION_REFRESH_KEY = "refreshMyCollection"
export const MY_COLLECTION_INSIGHTS_REFRESH_KEY = "refreshMyCollectionInsights"

export const refreshOnArtworkSave = () => {
  refreshFavoriteArtworks()
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

interface RefreshArgs extends Record<string, any> {
  pageSize?: number
}

export const useRefreshControl = (refetch: any, args?: RefreshArgs) => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    refetch(
      {
        ...args,
        count: args?.pageSize ?? PAGE_SIZE,
      },
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
