import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { MarketStatsQuery } from "__generated__/MarketStatsQuery.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { formatLargeNumber } from "app/utils/formatLargeNumber"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { DecreaseIcon, Flex, IncreaseIcon, Join, Separator, Spacer, Text } from "palette"
import { Select } from "palette/elements/Select"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { MarketStats_priceInsightsConnection } from "../../../../__generated__/MarketStats_priceInsightsConnection.graphql"
import { extractNodes } from "../../../utils/extractNodes"

interface MarketStatsProps {
  priceInsightsConnection: MarketStats_priceInsightsConnection
}

const MarketStats: React.FC<MarketStatsProps> = ({ priceInsightsConnection }) => {
  const tracking = useTracking()

  const priceInsights = extractNodes(priceInsightsConnection)

  if (priceInsights.length === 0) {
    return null
  }

  const [selectedPriceInsight, setSelectedPriceInsight] = useState(priceInsights[0])

  const mediumOptions = useRef<Array<{ value: string; label: string }>>(
    priceInsights
      .filter((pI) => pI.medium)
      .map((priceInsight) => ({
        value: priceInsight.medium as string,
        label: priceInsight.medium as string,
      }))
  )

  const renderInfoModal = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Spacer my={1} />
      <Text>
        The following data points provide an overview of an artist’s auction market for a specific
        medium (e.g., photography, painting) over the past 36 months.
      </Text>
      <Spacer mb={2} />
      <Text>
        These market signals bring together data from top auction houses around the world, including
        Christie’s, Sotheby’s, Phillips and Bonhams.
      </Text>
      <Spacer mb={2} />
      <Text>
        In this data set, please note that the sale price includes the hammer price and buyer’s
        premium, as well as any other additional fees (e.g., Artist’s Resale Rights). The data set
        only includes works valued over $1,000.
      </Text>
      <Spacer mb={2} />
      <Text fontWeight="bold">Average yearly lots sold</Text>
      <Spacer mb={1} />
      <Text>The average number of lots sold per year at auction over the past 36 months.</Text>
      <Spacer mb={2} />
      <Text fontWeight="bold">Sell-through rate</Text>
      <Spacer mb={1} />
      <Text>The percentage of lots in auctions that sold over the past 36 months.</Text>
      <Spacer mb={2} />
      <Text fontWeight="bold">Average sale price</Text>
      <Spacer mb={1} />
      <Text>The average sale price of lots sold at auction over the past 36 months.</Text>
      <Spacer mb={2} />
      <Text fontWeight="bold">Sale price over estimate</Text>
      <Spacer mb={1} />
      <Text>
        The average percentage difference of the sale price over the mid-estimate (the midpoint of
        the low and high estimates set by the auction house before the auction takes place) for lots
        sold at auction over the past 36 months.
      </Text>
      <Spacer mb={100} />
    </ScrollView>
  )

  const averageValueSold =
    (selectedPriceInsight.annualValueSoldCents as number) /
    100 /
    (selectedPriceInsight.annualLotsSold || 1)
  const formattedAverageValueSold = formatLargeNumber(averageValueSold)

  let deltaIcon: React.ReactNode
  const actualMedianSaleOverEstimatePercentage =
    selectedPriceInsight?.medianSaleOverEstimatePercentage || 0
  if (actualMedianSaleOverEstimatePercentage < 0) {
    deltaIcon = <DecreaseIcon />
  } else if (actualMedianSaleOverEstimatePercentage > 0) {
    deltaIcon = <IncreaseIcon />
  }
  const formattedMedianSaleOverEstimatePercentage = Math.abs(actualMedianSaleOverEstimatePercentage)

  const sellThroughRatePercentage = (selectedPriceInsight.sellThroughRate as number) * 100
  // show up to 2 decimal places
  const formattedSellThroughRate = Math.round(sellThroughRatePercentage * 100) / 100

  return (
    <>
      <Flex flexDirection="row" alignItems="center">
        <InfoButton
          titleElement={
            <Text variant="md" mr={0.5}>
              Market Signals
            </Text>
          }
          trackEvent={() => {
            tracking.trackEvent(tracks.tapMarketStatsInfo())
          }}
          modalTitle="Market Signals"
          modalContent={renderInfoModal()}
        />
      </Flex>
      <Text variant="xs" color="black60" my={0.5}>
        Averages over last 36 months
      </Text>
      <Select
        value={selectedPriceInsight.medium}
        options={mediumOptions.current}
        title="Select medium"
        showTitleLabel={false}
        onSelectValue={(selectedMedium) => {
          const priceInsight = priceInsights.find((p) => p.medium === selectedMedium)
          if (priceInsight) {
            setSelectedPriceInsight(priceInsight)
          }
        }}
      />
      {/* Market Stats Values */}
      <Flex flexDirection="row" flexWrap="wrap" mt={15}>
        <Flex width="50%">
          <Text variant="lg" testID="annualLotsSold">
            {selectedPriceInsight.annualLotsSold}
          </Text>
          <Text variant="sm">Yearly lots sold</Text>
        </Flex>
        <Flex width="50%">
          <Text variant="lg">{formattedSellThroughRate}%</Text>
          <Text variant="sm">Sell-through rate</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="lg">${formattedAverageValueSold}</Text>
          <Text variant="sm">Sale price</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Flex width="50%" flexDirection="row" alignItems="center">
            <Join separator={<Spacer mr={0.5} />}>
              {deltaIcon}
              <Text variant="lg">{formattedMedianSaleOverEstimatePercentage}%</Text>
            </Join>
          </Flex>
          <Text variant="sm">Sale price over estimate</Text>
        </Flex>
      </Flex>
      <Separator my={2} ml={-2} width={useScreenDimensions().width} />
    </>
  )
}

export const MarketStatsFragmentContainer = createFragmentContainer(MarketStats, {
  priceInsightsConnection: graphql`
    fragment MarketStats_priceInsightsConnection on PriceInsightConnection {
      edges {
        node {
          medium
          annualLotsSold
          annualValueSoldCents
          sellThroughRate
          medianSaleOverEstimatePercentage
        }
      }
    }
  `,
})

export const MarketStatsQueryRenderer: React.FC<{
  artistInternalID: string
  environment: RelayModernEnvironment
}> = ({ artistInternalID, environment }) => {
  return (
    <QueryRenderer<MarketStatsQuery>
      environment={environment}
      variables={{ artistInternalID }}
      query={graphql`
        query MarketStatsQuery($artistInternalID: ID!) {
          priceInsightsConnection: priceInsights(
            artistId: $artistInternalID
            sort: ANNUAL_VALUE_SOLD_CENTS_DESC
          ) {
            ...MarketStats_priceInsightsConnection
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MarketStatsFragmentContainer,
        renderPlaceholder: LoadingSkeleton,
        renderFallback: () => null,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <Flex flexDirection="row" alignItems="center">
        <Text variant="md" mr={0.5}>
          Market Signals
        </Text>
      </Flex>
      <Text variant="xs" color="black60" my={0.5}>
        Last 36 months
      </Text>
      <Spacer mb={0.5} />
      <PlaceholderBox width="100%" height={40} />
      <Flex flexDirection="row" flexWrap="wrap" mt={15}>
        <Flex width="50%">
          <Spacer mb={0.3} />
          <PlaceholderText width={30} height={25} />
          <Text variant="sm">Yearly lots sold</Text>
        </Flex>
        <Flex width="50%">
          <Spacer mb={0.3} />
          <PlaceholderText width={60} height={25} />
          <Text variant="sm">Sell-through rate</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Spacer mb={0.3} />
          <PlaceholderText width={50} height={25} />
          <Text variant="sm">Average sale price</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Spacer mb={0.3} />
          <PlaceholderText width={70} height={25} />
          <Text variant="sm">Sale price over estimate</Text>
        </Flex>
      </Flex>
    </>
  )
}

const tracks = {
  tapMarketStatsInfo: (): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.auctionResults,
    context_screen_owner_type: OwnerType.artistAuctionResults,
    subject: "artistMarketStatistics",
  }),
}
