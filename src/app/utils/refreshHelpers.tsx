import { PAGE_SIZE } from "app/Components/constants"
import EventEmitter from "events"
import { useEffect, useState } from "react"
import { RefreshControl } from "react-native"

export const RefreshEvents = new EventEmitter()
RefreshEvents.setMaxListeners(20)

export const FAVORITE_ARTWORKS_REFRESH_KEY = "refreshFavoriteArtworks"
export const MY_COLLECTION_REFRESH_KEY = "refreshMyCollection"
export const MY_COLLECTION_INSIGHTS_REFRESH_KEY = "refreshMyCollectionInsights"
export const SAVED_ALERT_REFRESH_KEY = "refreshSavedAlerts"
export const SELL_SCREEN_REFRESH_KEY = "refreshSellScreen"
export const REFRESH_CREDIT_CARDS_LIST_KEY = "refreshCreditCardsList"

export const refreshSavedAlerts = () => {
  RefreshEvents.emit(SAVED_ALERT_REFRESH_KEY)
}

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

export const refreshSellScreen = () => {
  RefreshEvents.emit(SELL_SCREEN_REFRESH_KEY)
}

export const refreshCreditCardsList = () => {
  RefreshEvents.emit(REFRESH_CREDIT_CARDS_LIST_KEY)
}

interface RefreshArgs extends Record<string, any> {
  pageSize?: number
}

/**
 * This function returns a fetch key that is incremented when a specific event is emitted.
 * It can be used to trigger a refetch of data in a component when the event occurs.
 * @param eventKey - The key of the event to listen to.
 * @param onRefresh - An optional callback function to be called when the event is emitted.
 * @returns The current fetch key.
 */
export const useRefreshFetchKey = (eventKey: string, onRefresh?: () => void) => {
  const [fetchKey, setFetchKey] = useState(0)

  const refetch = () => {
    onRefresh?.()
    setFetchKey((prev) => prev + 1)
  }

  useEffect(() => {
    RefreshEvents.addListener(eventKey, refetch)
    return () => {
      RefreshEvents.removeListener(eventKey, refetch)
    }
  }, [])

  return fetchKey
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
