import { ArtistInsights_artist } from "__generated__/ArtistInsights_artist.graphql"
import { ArtistInsightsQuery, ArtistInsightsQueryResponse } from "__generated__/ArtistInsightsQuery.graphql"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { formatCentsToDollars } from "lib/Scenes/MyCollection/utils/formatCentsToDollars"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Join, Separator, Text } from "palette"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ArtistInsightsAuctionResultsPaginationContainer } from "./ArtistInsightsAuctionResults"

interface ArtistInsightsProps {
  artist: ArtistInsights_artist
}

export const ArtistInsights: React.FC<ArtistInsightsProps> = ({ artist }) => {
  return (
    <StickyTabPageScrollView contentContainerStyle={{ paddingTop: 20 }}>
      <Join separator={<Separator my={2} ml={-2} width={useScreenDimensions().width} />}>
        <ArtistMarketStatsQueryRenderer artistInternalID={artist.internalID} medium={"photography"} />
        <ArtistInsightsAuctionResultsPaginationContainer artist={artist} />
      </Join>
    </StickyTabPageScrollView>
  )
}

interface ArtistMarketStatsProps {
  marketPriceInsights: ArtistInsightsQueryResponse["marketPriceInsights"]
}

const ArtistMarketStats: React.FC<ArtistMarketStatsProps> = ({ marketPriceInsights }) => (
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
        {/* TODO:
          - Make sure `annualValueSoldCents` is an average value and not a total, update in My Collection if neccessary
          - Make copy consistent across my collection insights + here, make sure accurate, avg vs yearly, time period
          - Should we display demand index and similar here as well?
          - Move formatCentsToDollars to a general utility / not under my collection
        */}
        <Text variant="largeTitle">{formatCentsToDollars(Number(marketPriceInsights?.annualValueSoldCents))}</Text>
      </Flex>
      <Flex width="50%">
        <Text variant="text">Total lots sold</Text>
        <Text variant="largeTitle">{marketPriceInsights?.annualLotsSold}</Text>
      </Flex>
      <Flex width="50%" mt={2}>
        <Text variant="text">Realized / estimate</Text>
        <Text variant="largeTitle">{marketPriceInsights?.medianSaleToEstimateRatio + "x"}</Text>
      </Flex>
      <Flex width="50%" mt={2}>
        <Text variant="text">Sell-through rate</Text>
        <Text variant="largeTitle">{marketPriceInsights?.sellThroughRate + "%"}</Text>
      </Flex>
    </Flex>
  </>
)

// TODO:
// - Use `priceInsights` query and allow selecting medium
// - Fallback for when price insights don't display, maybe just null
export const ArtistMarketStatsQueryRenderer: React.FC<{ artistInternalID: string; medium: string }> = ({
  artistInternalID,
  medium,
}) => (
  <QueryRenderer<ArtistInsightsQuery>
    environment={defaultEnvironment}
    query={graphql`
      query ArtistInsightsQuery($artistInternalID: ID!, $medium: String!) {
        marketPriceInsights: marketPriceInsights(artistId: $artistInternalID, medium: $medium) {
          annualLotsSold
          annualValueSoldCents
          medianSaleToEstimateRatio
          sellThroughRate
        }
      }
    `}
    variables={{
      artistInternalID,
      medium,
    }}
    render={({ props }) => {
      if (props?.marketPriceInsights) {
        return <ArtistMarketStats marketPriceInsights={props?.marketPriceInsights} />
      } else {
        return <Text>It didn't work</Text>
      }
    }}
  />
)

export const ArtistInsightsFragmentContainer = createFragmentContainer(ArtistInsights, {
  artist: graphql`
    fragment ArtistInsights_artist on Artist {
      name
      internalID
      ...ArtistInsightsAuctionResults_artist
    }
  `,
})
