import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedMyCollectionInsightsMedianAuctionPriceChartCareerHighlight,
  TappedMyCollectionInsightsMedianAuctionPriceChartCategory,
  TappedMyCollectionInsightsMedianAuctionPriceChartTimeframe,
} from "@artsy/cohesion"
import { useEffect } from "react"
import { useTracking } from "react-tracking"
import { useMedianSalePriceChartDataContext } from "../providers/MedianSalePriceChartDataContext"

interface MedianSalePriceChartTrackingProps {
  artistID: string
}
export const MedianSalePriceChartTracking: React.FC<MedianSalePriceChartTrackingProps> = ({
  artistID,
}) => {
  const tracking = useTracking()

  const dataContext = useMedianSalePriceChartDataContext()
  if (!dataContext) {
    return null
  }

  const { selectedDuration, selectedCategory, selectedXAxisHighlight } = dataContext

  useEffect(() => {
    tracking.trackEvent(tracks.category(artistID, selectedCategory))
  }, [selectedCategory])

  useEffect(() => {
    tracking.trackEvent(tracks.duration(artistID, selectedDuration))
  }, [selectedDuration])

  useEffect(() => {
    if (selectedXAxisHighlight) {
      tracking.trackEvent(
        tracks.highlight({
          artistID,
          selectedCategory,
          selectedDuration,
          year: selectedXAxisHighlight,
        })
      )
    }
  }, [selectedXAxisHighlight])

  return null
}

const tracks = {
  category: (
    artistID: string,
    selectedCategory: string
  ): TappedMyCollectionInsightsMedianAuctionPriceChartCategory => {
    return {
      action: ActionType.tappedMyCollectionInsightsMedianAuctionPriceChartCategory,
      context_module: ContextModule.myCollectionInsightsMedianAuctionPriceChart,
      context_screen: OwnerType.myCollectionInsightsMedianAuctionPrice,
      context_screen_owner_type: OwnerType.myCollectionInsightsMedianAuctionPrice,
      context_screen_owner_id: artistID,
      artist_id: artistID,
      selected_category: selectedCategory,
    }
  },

  duration: (
    artistID: string,
    selectedDuration: string
  ): TappedMyCollectionInsightsMedianAuctionPriceChartTimeframe => {
    return {
      action: ActionType.tappedMyCollectionInsightsMedianAuctionPriceChartTimeframe,
      context_module: ContextModule.myCollectionInsightsMedianAuctionPriceChart,
      context_screen: OwnerType.myCollectionInsightsMedianAuctionPrice,
      context_screen_owner_type: OwnerType.myCollectionInsightsMedianAuctionPrice,
      context_screen_owner_id: artistID,
      artist_id: artistID,
      selected_timeframe: selectedDuration,
    }
  },

  highlight: (options: {
    artistID: string
    selectedDuration: string
    selectedCategory: string
    year: number
  }): TappedMyCollectionInsightsMedianAuctionPriceChartCareerHighlight => {
    const { artistID, selectedCategory, selectedDuration, year } = options
    return {
      action: ActionType.tappedMyCollectionInsightsMedianAuctionPriceChartCareerHighlight,
      context_module: ContextModule.myCollectionInsightsMedianAuctionPriceChart,
      context_screen: OwnerType.myCollectionInsightsMedianAuctionPrice,
      context_screen_owner_type: OwnerType.myCollectionInsightsMedianAuctionPrice,
      context_screen_owner_id: artistID,
      artist_id: artistID,
      selected_category: selectedCategory,
      selected_timeframe: selectedDuration,
      year,
    }
  },
}
