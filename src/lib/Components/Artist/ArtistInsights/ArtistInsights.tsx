import { OwnerType } from "@artsy/cohesion"
import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, ArtworkFilterNavigator } from "lib/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { Schema } from "lib/utils/track"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native"
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
  const flatListRef = useRef<{ getNode(): FlatList<any> } | null>(null)

  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const auctionResultsYCoordinate = useRef<number>(0)

  const openFilterModal = () => {
    tracking.trackEvent(tracks.openFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    tracking.trackEvent(tracks.closeFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(false)
  }

  const scrollToTop = useCallback(() => {
    flatListRef.current?.getNode().scrollToOffset({ animated: true, offset: auctionResultsYCoordinate.current })
  }, [auctionResultsYCoordinate])

  // Show or hide floating filter button depending on the scroll position
  const onScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y > FILTER_BUTTON_OFFSET) {
      setIsFilterButtonVisible(true)
      return
    }
    setIsFilterButtonVisible(false)
  }, [])

  return (
    <ArtworkFiltersStoreProvider>
      <StickyTabPageScrollView
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 60 }}
        onScrollEndDrag={onScrollEndDrag}
        innerRef={flatListRef}
      >
        <MarketStatsQueryRenderer artistInternalID={artist.internalID} environment={relay.environment} />
        <View
          onLayout={({
            nativeEvent: {
              layout: { y },
            },
          }) => {
            auctionResultsYCoordinate.current = y
          }}
        >
          <ArtistInsightsAuctionResultsPaginationContainer artist={artist} scrollToTop={scrollToTop} />
        </View>
      </StickyTabPageScrollView>
      <ArtworkFilterNavigator
        isFilterArtworksModalVisible={isFilterModalVisible}
        id={artist.internalID}
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
    </ArtworkFiltersStoreProvider>
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
      context_screen_owner_type: OwnerType.artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    }
  },
  closeFilter: (id: string, slug: string) => {
    return {
      action_name: "closeFilterWindow",
      context_screen_owner_type: OwnerType.artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    }
  },
}
