import { OwnerType } from "@artsy/cohesion"
import { ArtistInsights_artist$data } from "__generated__/ArtistInsights_artist.graphql"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import { FilterArray } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { Schema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useEffect, useState } from "react"
import { LayoutChangeEvent } from "react-native"
import { useCurrentTabScrollY, useFocusedTab } from "react-native-collapsible-tab-view"
import { runOnJS, useAnimatedReaction } from "react-native-reanimated"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist$data
  initialFilters?: FilterArray
}

const FILTER_BUTTON_OFFSET = 100

export const ArtistInsights: React.FC<ArtistInsightsProps> = (props) => {
  const { artist, initialFilters } = props
  const tracking = useTracking()

  const scrollY = useCurrentTabScrollY()

  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [auctionResultsYCoordinate, setauctionResultsYCoordinate] = useState<number | null>(null)

  const openFilterModal = () => {
    tracking.trackEvent(tracks.openFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
    tracking.trackEvent(tracks.closeFilter(artist.internalID, artist.slug))
    setIsFilterModalVisible(false)
  }

  useAnimatedReaction(
    () => scrollY.value,
    (scrollY) => {
      if (auctionResultsYCoordinate === null) {
        return
      }
      if (scrollY > auctionResultsYCoordinate + FILTER_BUTTON_OFFSET) {
        runOnJS(setIsFilterButtonVisible)(true)
      } else {
        runOnJS(setIsFilterButtonVisible)(false)
      }
    },
    [auctionResultsYCoordinate]
  )

  const focusedTab = useFocusedTab()

  useEffect(() => {
    if (focusedTab === "Insights") {
      tracking.trackEvent(tracks.screen(artist.internalID, artist.slug))
    }
  }, [focusedTab])

  return (
    <ArtworkFiltersStoreProvider>
      <ArtistInsightsAuctionResultsPaginationContainer
        artist={artist}
        initialFilters={initialFilters}
        onLayout={({ nativeEvent }: LayoutChangeEvent) => {
          if (auctionResultsYCoordinate === null) {
            setauctionResultsYCoordinate(nativeEvent.layout.height)
          }
        }}
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
      ...ArtistInsightsAuctionResults_artist
      name
      id
      internalID
      slug
      statuses {
        auctionLots
      }
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
  screen: (id: string, slug: string) =>
    screen({
      context_screen_owner_type: OwnerType.artistAuctionResults,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
    }),
}
