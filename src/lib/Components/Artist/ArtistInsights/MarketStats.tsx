import { MarketStats_priceInsights } from "__generated__/MarketStats_priceInsights.graphql"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { ContextModule, OwnerType, tappedInfoBubble, TappedInfoBubbleArgs } from "@artsy/cohesion"

interface MarketStatsProps {
  priceInsights: MarketStats_priceInsights
}

const MarketStats: React.FC<MarketStatsProps> = ({ priceInsights }) => {
  const tracking = useTracking()

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

  return (
    <>
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
      {priceInsights.edges?.map((e) => {
        return (
          <Text>
            {e?.node?.medium}: {e?.node?.annualValueSoldCents}
          </Text>
        )
      })}
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
}

export const MarketStatsFragmentContainer = createFragmentContainer(MarketStats, {
  priceInsights: graphql`
    fragment MarketStats_priceInsights on PriceInsightConnection {
      edges {
        node {
          medium
          annualValueSoldCents
        }
      }
    }
  `,
})

export const tracks = {
  tapMarketStatsInfo: (): TappedInfoBubbleArgs => ({
    contextModule: ContextModule.auctionResults,
    contextScreenOwnerType: OwnerType.artistInsights,
    subject: "artistMarketStatistics",
  }),
}
