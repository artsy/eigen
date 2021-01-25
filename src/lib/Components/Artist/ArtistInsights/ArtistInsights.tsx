import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { CloseIcon, Flex, Join, Sans, Separator, Spacer, Text } from "palette"
import React, { useCallback, useState } from "react"
import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
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
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false)

  const openFilterModal = () => {
    setIsFilterModalVisible(true)
  }

  const closeFilterModal = () => {
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

  const InfoModal = () => (
    <FancyModal visible={isInfoModalVisible} onBackgroundPressed={() => setIsInfoModalVisible(false)}>
      <FancyModalHeader useXButton={true} onLeftButtonPress={() => setIsInfoModalVisible(false)}>
        Market Signals by Medium
      </FancyModalHeader>
      <ScrollView>
        <Flex m={2}>
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
            In this data set, please note that the sale price includes the hammer price and buyer’s premium, as well as
            any other additional fees (e.g., Artist’s Resale Rights).
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
        </Flex>
      </ScrollView>
    </FancyModal>
  )

  const MarketStats = () => (
    <>
      {/* Market Stats Hint */}
      <InfoModal />
      <Flex flexDirection="row" alignItems="center">
        <Text variant="title" mr={5}>
          Market stats
        </Text>
        <TouchableOpacity
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          onPress={() => setIsInfoModalVisible(!isInfoModalVisible)}
        >
          <Image source={require("@images/info.png")} />
        </TouchableOpacity>
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
      <StickyTabPageScrollView contentContainerStyle={{ paddingTop: 20 }} onScrollEndDrag={onScrollEndDrag}>
        <Join separator={<Separator my={2} ml={-2} width={useScreenDimensions().width} />}>
          <MarketStats />
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
