import { OwnerType } from "@artsy/cohesion"
import { ArtistInsightsQuery } from "__generated__/ArtistInsightsQuery.graphql"
import { ArtistInsights_artist$key } from "__generated__/ArtistInsights_artist.graphql"
import { ARTIST_HEADER_HEIGHT } from "app/Components/Artist/ArtistHeader"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useOnTabFocusedEffect } from "app/Components/StickyTabPage/StickyTabPage"
import { StickTabPagePlaceholder } from "app/Components/StickyTabPage/StickyTabPagePlaceholder"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { SCROLL_UP_TO_SHOW_THRESHOLD } from "app/utils/hideBackButtonOnScroll"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"
import { MarketStatsQueryRenderer } from "./MarketStats"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist$key
  tabIndex: number
  initialFilters?: FilterArray
}

const FILTER_BUTTON_OFFSET = 50

export const ArtistInsights: React.FC<ArtistInsightsProps> = (props) => {
  const { tabIndex, initialFilters } = props
  const artist = useFragment(artistInsightsFragment, props.artist)

  const tracking = useTracking()
  const flatListRef = useRef<{ getNode(): FlatList<any> } | null>(null)

  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const auctionResultsYCoordinate = useRef<number>(0)
  const contentYScrollOffset = useRef<number>(0)

  const openFilterModal = () => {
    tracking.trackEvent(tracks.openFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    tracking.trackEvent(tracks.closeFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(false)
  }

  const scrollToTop = useCallback(() => {
    let auctionResultYOffset = auctionResultsYCoordinate.current

    // if we scroll up less than SCROLL_UP_TO_SHOW_THRESHOLD the header won't expand and we need another offset
    if (contentYScrollOffset.current - 2 * auctionResultYOffset <= SCROLL_UP_TO_SHOW_THRESHOLD) {
      auctionResultYOffset += ARTIST_HEADER_HEIGHT
    }
  }, [auctionResultsYCoordinate, contentYScrollOffset])

  // Show or hide floating filter button depending on the scroll position
  const onScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    contentYScrollOffset.current = event.nativeEvent.contentOffset.y

    if (event.nativeEvent.contentOffset.y > FILTER_BUTTON_OFFSET) {
      setIsFilterButtonVisible(true)
      return
    }
    setIsFilterButtonVisible(false)
  }, [])

  // Track screen event when artist insights tab is focused
  useOnTabFocusedEffect(() => {
    tracking.trackEvent(tracks.screen(artist.internalID, artist.slug))
  }, tabIndex)

  return (
    <ArtworkFiltersStoreProvider>
      <StickyTabPageScrollView
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 60 }}
        onScrollEndDrag={onScrollEndDrag}
        innerRef={flatListRef}
      >
        <MarketStatsQueryRenderer artistInternalID={artist.internalID} />
        <View
          onLayout={({
            nativeEvent: {
              layout: { y },
            },
          }) => {
            auctionResultsYCoordinate.current = y
          }}
        >
          <ArtistInsightsAuctionResultsPaginationContainer
            artist={artist}
            scrollToTop={scrollToTop}
            initialFilters={initialFilters}
          />
        </View>
      </StickyTabPageScrollView>
      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
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

const artistInsightsFragment = graphql`
  fragment ArtistInsights_artist on Artist {
    name
    id
    internalID
    slug
    ...ArtistInsightsAuctionResults_artist
  }
`

const artistInsightsQuery = graphql`
  query ArtistInsightsQuery($artistID: String!) {
    artist(id: $artistID) {
      ...ArtistInsights_artist
    }
  }
`

export const ArtistInsightsQueryRenderer: React.FC<{
  artistID: string
  initialFilters?: FilterArray
  tabIndex: number
}> = withSuspense(({ artistID, initialFilters, tabIndex }) => {
  const data = useLazyLoadQuery<ArtistInsightsQuery>(artistInsightsQuery, { artistID })

  if (!data.artist) {
    return null
  }

  return <ArtistInsights tabIndex={tabIndex} artist={data.artist} initialFilters={initialFilters} />
}, StickTabPagePlaceholder)

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
  screen: (id: string, slug: string) =>
    screen({
      context_screen_owner_type: OwnerType.artistAuctionResults,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
    }),
}
