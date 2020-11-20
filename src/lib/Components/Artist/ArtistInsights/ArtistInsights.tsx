import { ArtistInsights_marketPriceInsights } from "__generated__/ArtistInsights_marketPriceInsights.graphql"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { Flex, Join, Separator, Text } from "palette"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  marketPriceInsights: ArtistInsights_marketPriceInsights
}
const ArtistInsights: React.FC<Props> = ({ marketPriceInsights }) => {
  const MarketStats = () => (
    <>
      {/* Market Stats Hint */}
      <Flex flexDirection="row" alignItems="center">
        <Text variant="title" mr={5}>
          Market Stats
        </Text>
        <TouchableOpacity hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Image source={require("@images/info.png")} />
        </TouchableOpacity>
      </Flex>
      <Text variant="caption" color="black60">
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
      <Join separator={<Separator my={2} />}>{!!marketPriceInsights && <MarketStats />}</Join>
    </StickyTabPageScrollView>
  )
}

export const ArtistInsightsFragmentContainer = createFragmentContainer(ArtistInsights, {
  marketPriceInsights: graphql`
    fragment ArtistInsights_marketPriceInsights on MarketPriceInsights {
      annualLotsSold
      annualValueSoldCents
      artistId
      artistName
      artsyQInventory
      createdAt
      demandRank
      demandTrend
      highRangeCents
      largeHighRangeCents
      largeLowRangeCents
      largeMidRangeCents
      liquidityRank
      lowRangeCents
      medianSaleToEstimateRatio
      medium
      mediumHighRangeCents
      mediumLowRangeCents
      mediumMidRangeCents
      midRangeCents
      sellThroughRate
      smallHighRangeCents
      smallLowRangeCents
      smallMidRangeCents
      updatedAt
    }
  `,
})
