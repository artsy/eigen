import { ActionType, ContextModule, OwnerType, tappedInfoBubble, TappedInfoBubbleArgs } from "@artsy/cohesion"
import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Join, Separator, Spacer, Text } from "palette"
import React, { useCallback, useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ReactElement } from "simple-markdown"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist
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
export const ArtistInsights: React.FC<ArtistInsightsProps> = ({ artist }) => {
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

  const renderInfoModal = () => (
    <ScrollView>
      <Text>
        The following data points provide an overview of an artist’s auction market for a specific medium (e.g.,
        photography, painting) over the past 36 months.
      </Text>
      <Spacer mb={2} />
      <Text>
        These market signals bring together data from top auction houses around the world, including Christie’s,
        Sotheby’s, Phillips, Bonhams, and Heritage.
      </Text>
      <Spacer mb={2} />
      <Text>
        In this data set, please note that the sale price includes the hammer price and buyer’s premium, as well as any
        other additional fees (e.g., Artist’s Resale Rights).
      </Text>
      <Spacer mb={2} />
      <Text fontWeight={"bold"}>Yearly lots sold</Text>
      <Spacer mb={1} />
      <Text>The average number of lots sold per year at auction over the past 36 months.</Text>
      <Spacer mb={2} />
      <Text fontWeight={"bold"}>Sell-through rate</Text>
      <Spacer mb={1} />
      <Text>The percentage of lots in auctions that sold over the past 36 months.</Text>
      <Spacer mb={2} />
      <Text fontWeight={"bold"}>Average sale price</Text>
      <Spacer mb={1} />
      <Text>The average sale price of lots sold at auction over the past 36 months.</Text>
      <Spacer mb={2} />
      <Text fontWeight={"bold"}>Sale price over estimate</Text>
      <Spacer mb={1} />
      <Text lineHeight={50}>
        The average percentage difference of the sale price over the mid-estimate (the midpoint of the low and high
        estimates set by the auction house before the auction takes place) for lots sold at auction over the past 36
        months.
      </Text>
      <Spacer mb={2} />
    </ScrollView>
  )

  const renderMarketStats = () => (
    <>
      {/* Market Stats Hint */}
      <Flex flexDirection="row" alignItems="center">
        <InfoButton
          titleElement={
            <Text variant="title" mr={0.5}>
              Market Signals by Medium
            </Text>
          }
          trackEvent={() => {
            tracking.trackEvent(tappedInfoBubble(tracks.tapMarketStatsInfo()))
          }}
          modalTitle={"Market Signals by Medium"}
          modalContent={renderInfoModal()}
        />
      </Flex>
      <Text variant="small" color="black60">
        Last 12 months
      </Text>
      {/* Market Stats Values */}
      <Flex flexDirection="row" flexWrap="wrap" mt={15}>
        <Flex width="50%">
          <Text variant="text">Average sale price</Text>
          <Text variant="largeTitle">$168k</Text>
        </Flex>
        <Flex width="50%">
          <Text variant="text">Total lots sold</Text>
          <Text variant="largeTitle">61</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="text">Realized / estimate</Text>
          <Text variant="largeTitle">2.12x</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="text">Sell-through rate</Text>
          <Text variant="largeTitle">90%</Text>
        </Flex>
      </Flex>
    </>
  )

  return (
    <ArtworkFilterGlobalStateProvider>
      <StickyTabPageScrollView contentContainerStyle={{ paddingVertical: 20 }} onScrollEndDrag={onScrollEndDrag}>
        <Join separator={<Separator my={2} ml={-2} width={useScreenDimensions().width} />}>
          {renderMarketStats()}
          <ArtistInsightsAuctionResultsPaginationContainer artist={artist} />
          <FilterModalNavigator
            isFilterArtworksModalVisible={isFilterModalVisible}
            id={artist.id}
            slug={artist.slug}
            mode={FilterModalMode.AuctionResults}
            exitModal={closeFilterModal}
            closeModal={closeFilterModal}
            title="Filter auction results"
          />
        </Join>
      </StickyTabPageScrollView>

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

  tapMarketStatsInfo: (): TappedInfoBubbleArgs => ({
    contextModule: ContextModule.auctionResults,
    contextScreenOwnerType: OwnerType.artistInsights,
    subject: "artistMarketStatistics",
  }),
}
