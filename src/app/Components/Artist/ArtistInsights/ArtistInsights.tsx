import { OwnerType } from "@artsy/cohesion"
import { Flex, Spinner, Tabs, useSpace } from "@artsy/palette-mobile"
import { ArtistInsightsQuery } from "__generated__/ArtistInsightsQuery.graphql"
import { ArtistInsights_artist$key } from "__generated__/ArtistInsights_artist.graphql"
import { ARTIST_HEADER_HEIGHT } from "app/Components/Artist/ArtistHeader"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { LoadFailureView, LoadFailureViewProps } from "app/Components/LoadFailureView"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useFocusedTab } from "react-native-collapsible-tab-view"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"
import { MarketStatsQueryRenderer } from "./MarketStats"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist$key
  initialFilters?: FilterArray
}

const SCROLL_UP_TO_SHOW_THRESHOLD = 500

export const ArtistInsights: React.FC<ArtistInsightsProps> = ({
  artist: artistProp,
  initialFilters,
}) => {
  const artist = useFragment(artistInsightsFragment, artistProp)
  const space = useSpace()
  const tracking = useTracking()

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

  const components = useMemo(
    () => [
      {
        Component: () => (
          <MarketStatsQueryRenderer
            artistInternalID={artist.internalID}
            environment={getRelayEnvironment()}
          />
        ),
      },
      {
        Component: () => (
          <ArtistInsightsAuctionResultsPaginationContainer
            artist={artist}
            scrollToTop={scrollToTop}
            initialFilters={initialFilters}
            openFilterModal={openFilterModal}
          />
        ),
      },
    ],
    [artist, scrollToTop, initialFilters, auctionResultsYCoordinate.current]
  )

  const focusedTab = useFocusedTab()

  useEffect(() => {
    if (focusedTab === "Insights") {
      tracking.trackEvent(tracks.screen(artist.internalID, artist.slug))
    }
  }, [focusedTab])

  return (
    <ArtworkFiltersStoreProvider>
      <Tabs.FlatList
        style={{
          marginTop: space(2),
          paddingBottom: space(4),
        }}
        data={components}
        keyExtractor={(_, index) => `ArtistInsight-FlatList-element-${index}`}
        renderItem={({ item: { Component } }) => <Component />}
        scrollEventThrottle={16}
      />

      <ArtworkFilterNavigator
        visible={isFilterModalVisible}
        id={artist.internalID}
        slug={artist.slug}
        mode={FilterModalMode.AuctionResults}
        exitModal={closeFilterModal}
        closeModal={closeFilterModal}
        title="Filter auction results"
      />
    </ArtworkFiltersStoreProvider>
  )
}

const artistInsightsFragment = graphql`
  fragment ArtistInsights_artist on Artist {
    ...ArtistInsightsAuctionResults_artist
    name
    id
    internalID
    slug
    statuses {
      auctionLots
    }
  }
`

export const artistInsightsQuery = graphql`
  query ArtistInsightsQuery($artistID: String!) {
    artist(id: $artistID) {
      ...ArtistInsights_artist
    }
  }
`

interface ArtistInsightsQueryRendererProps {
  artistID: string
  initialFilters?: FilterArray
}

export const ArtistInsightsQueryRenderer = withSuspense<ArtistInsightsQueryRendererProps>({
  Component: ({ artistID, initialFilters }) => {
    const data = useLazyLoadQuery<ArtistInsightsQuery>(artistInsightsQuery, { artistID })

    if (!data.artist) {
      return null
    }

    return <ArtistInsights artist={data.artist} initialFilters={initialFilters} />
  },
  LoadingFallback: () => <ArtistInsightsPlaceholder />,
  ErrorFallback: (fallbackProps) => <ArtistInsightsError {...fallbackProps} />,
})

const ArtistInsightsPlaceholder: React.FC = () => {
  const space = useSpace()

  return (
    <Tabs.ScrollView
      contentContainerStyle={{ marginHorizontal: space(2), marginTop: space(2) }}
      scrollEnabled={false}
    >
      <Flex alignItems="center">
        <Spinner />
      </Flex>
    </Tabs.ScrollView>
  )
}

const ArtistInsightsError: React.FC<LoadFailureViewProps> = (fallbackProps) => {
  const space = useSpace()

  return (
    <Tabs.ScrollView contentContainerStyle={{ paddingHorizontal: 0, paddingTop: space(2) }}>
      <LoadFailureView
        onRetry={fallbackProps.onRetry}
        useSafeArea={false}
        flex={undefined}
        error={fallbackProps.error}
        showBackButton={false}
        trackErrorBoundary={false}
      />
    </Tabs.ScrollView>
  )
}

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
