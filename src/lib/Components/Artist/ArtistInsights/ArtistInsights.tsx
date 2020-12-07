import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { Flex, Join, Separator, Text } from "palette"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist
}

export const ArtistInsights: React.FC<ArtistInsightsProps> = ({ artist }) => {
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
    <StickyTabPageScrollView contentContainerStyle={{ paddingTop: 20 }}>
      <Join separator={<Separator my={2} />}>
        <MarketStats />
        <ArtistInsightsAuctionResultsPaginationContainer artist={artist} />
      </Join>
    </StickyTabPageScrollView>
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
