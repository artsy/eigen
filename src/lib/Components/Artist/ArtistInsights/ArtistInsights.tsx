import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { AnimatedArtworkFilterButton } from "lib/Components/FilterModal"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Join, Separator, Text } from "palette"
import React, { useState } from "react"
import { Image, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity } from "react-native"
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

const FILTER_BUTTON_OFFSET = 100
export const ArtistInsights: React.FC<ArtistInsightsProps> = ({ artist }) => {
  const [isFilterButtonVisible, setIsFilterButtonVisible] = useState(false)

  // Show or hide floating filter button depending on the scroll position
  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.targetContentOffset.y > FILTER_BUTTON_OFFSET) {
      setIsFilterButtonVisible(true)
      return
    }
    setIsFilterButtonVisible(false)
  }

  const MarketStats = () => (
    <>
      {/* Market Stats Hint */}
      <Flex flexDirection="row" alignItems="center">
        <Text variant="title" mr={5}>
          Market stats
        </Text>
        <TouchableOpacity hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
        </Join>
      </StickyTabPageScrollView>
      <Flex position="absolute" width="100%" bottom={0}>
        <AnimatedArtworkFilterButton
          isVisible={isFilterButtonVisible}
          onPress={() => {
            // show filters modal
          }}
        />
      </Flex>
    </ArtworkFilterGlobalStateProvider>
  )
}

export const ArtistInsightsFragmentContainer = createFragmentContainer(ArtistInsights, {
  artist: graphql`
    fragment ArtistInsights_artist on Artist {
      name
      ...ArtistInsightsAuctionResults_artist
    }
  `,
})
