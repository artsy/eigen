import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React, { useCallback, useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"
import { ReactElement } from "simple-markdown"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"
import { MarketStatsQueryRenderer } from "./MarketStats"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist
  relay: RelayProp
}

export interface ViewableItems {
  viewableItems?: ViewToken[]
}

interface ViewToken {
  item?: ReactElement
  key?: string
  index?: number | null
  isViewable?: boolean
  section?: any
}

const FILTER_BUTTON_OFFSET = 50
export const ArtistInsights: React.FC<ArtistInsightsProps> = (props) => {
  const { artist, relay } = props

  const tracking = useTracking()
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)

  const openFilterModal = () => {
    tracking.trackEvent(tracks.openFilter(artist.id, artist.slug))
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    tracking.trackEvent(tracks.closeFilter(artist.id, artist.slug))
    setIsFilterModalVisible(false)
  }

  // Show or hide floating filter button depending on the scroll position
  const onScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.targetContentOffset.y > FILTER_BUTTON_OFFSET) {
      setIsFilterButtonVisible(true)
      return
    }
    setIsFilterButtonVisible(false)
  }, [])

  return (
    <ArtworkFilterGlobalStateProvider>
      <StickyTabPageScrollView
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 60 }}
        onScrollEndDrag={onScrollEndDrag}
      >
        <MarketStatsQueryRenderer artistInternalID={artist.internalID} environment={relay.environment} />
        <ArtistInsightsAuctionResultsPaginationContainer artist={artist} />
      </StickyTabPageScrollView>
      <FilterModalNavigator
        isFilterArtworksModalVisible={isFilterModalVisible}
        id={artist.id}
        slug={artist.slug}
        mode={FilterModalMode.AuctionResults}
        exitModal={closeFilterModal}
        closeModal={closeFilterModal}
        title="Filter auction results"
      />
      <AnimatedArtworkFilterButton
        isVisible={isFilterButtonVisible}
        onPress={openFilterModal}
        text="Filter auction results"
      />
    </ArtworkFilterGlobalStateProvider>
  )
}

export const ArtistInsightsFragmentContainer = createFragmentContainer(ArtistInsights, {
  artist: graphql`
    fragment ArtistInsights_artist on Artist {
      name
      id
      internalID
      slug
      ...ArtistInsightsAuctionResults_artist
    }
  `,
})

export const tracks = {
  openFilter: (id: string, slug: string) => {
    return {
      action_name: "filter",
      context_module: ContextModule.auctionResults,
      context_screen_owner_type: OwnerType.artistInsights,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: ActionType.commercialFilterParamsChanged,
    }
  },
  closeFilter: (id: string, slug: string) => {
    return {
      action_name: "closeFilterWindow",
      context_module: ContextModule.auctionResults,
      context_screen_owner_type: OwnerType.artistInsights,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: ActionType.commercialFilterParamsChanged,
    }
  },
}
