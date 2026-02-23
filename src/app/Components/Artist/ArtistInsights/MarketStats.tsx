import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { ArrowDownIcon, ArrowUpIcon } from "@artsy/icons/native"
import { Flex, Join, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { MarketStatsQuery } from "__generated__/MarketStatsQuery.graphql"
import { MarketStats_priceInsightsConnection$data } from "__generated__/MarketStats_priceInsightsConnection.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { Select } from "app/Components/Select"
import { extractNodes } from "app/utils/extractNodes"
import { formatLargeNumber } from "app/utils/formatLargeNumber"
import { useScreenDimensions } from "app/utils/hooks"
import { formatSellThroughRate } from "app/utils/marketPriceInsightHelpers"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { useRef, useState } from "react"
import { createFragmentContainer, Environment, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"

interface MarketStatsProps {
  priceInsightsConnection: MarketStats_priceInsightsConnection$data
}

const MarketStats: React.FC<MarketStatsProps> = ({ priceInsightsConnection }) => {
  const tracking = useTracking()

  const priceInsights = extractNodes(priceInsightsConnection)

  const [selectedPriceInsight, setSelectedPriceInsight] = useState(priceInsights[0])
  const { width: screenWidth } = useScreenDimensions()

  const mediumOptions = useRef<Array<{ value: string; label: string }>>(
    priceInsights
      .filter((pI) => pI.medium)
      .map((priceInsight) => ({
        value: priceInsight.medium as string,
        label: priceInsight.medium as string,
      }))
  )

  if (priceInsights.length === 0) {
    return null
  }

  const averageValueSold =
    (selectedPriceInsight.annualValueSoldCents as number) /
    100 /
    (selectedPriceInsight.annualLotsSold || 1)
  const formattedAverageValueSold = formatLargeNumber(averageValueSold)

  let deltaIcon: React.ReactNode
  const actualMedianSaleOverEstimatePercentage =
    selectedPriceInsight?.medianSaleOverEstimatePercentage || 0
  if (actualMedianSaleOverEstimatePercentage < 0) {
    deltaIcon = <ArrowDownIcon />
  } else if (actualMedianSaleOverEstimatePercentage > 0) {
    deltaIcon = <ArrowUpIcon />
  }
  const formattedMedianSaleOverEstimatePercentage = Math.abs(actualMedianSaleOverEstimatePercentage)

  return (
    <>
      <Flex flexDirection="row" alignItems="center">
        <InfoButton
          titleElement={
            <Text variant="sm-display" mr={0.5}>
              Market Signals
            </Text>
          }
          trackEvent={() => {
            tracking.trackEvent(tracks.tapMarketStatsInfo())
          }}
          modalTitle="Market Signals"
          modalContent={<InfoModalContent />}
          isPresentedModally
        />
      </Flex>
      <Text variant="xs" color="mono60" my={0.5}>
        Averages over last 36 months
      </Text>
      <Select
        value={selectedPriceInsight.medium}
        options={mediumOptions.current}
        testID="select-medium"
        onSelectValue={(selectedMedium) => {
          const priceInsight = priceInsights.find((p) => p.medium === selectedMedium)
          if (priceInsight) {
            setSelectedPriceInsight(priceInsight)
          }
        }}
      />
      {/* Market Stats Values */}
      <Flex flexDirection="row" flexWrap="wrap" mt="15px">
        <Flex width="50%">
          <Text variant="lg-display" testID="annualLotsSold">
            {selectedPriceInsight.annualLotsSold}
          </Text>
          <Text variant="sm">Yearly lots sold</Text>
        </Flex>
        <Flex width="50%">
          <Text variant="lg-display">
            {formatSellThroughRate(selectedPriceInsight.sellThroughRate)}%
          </Text>
          <Text variant="sm">Sell-through rate</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="lg-display">${formattedAverageValueSold}</Text>
          <Text variant="sm">Sale price</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Flex width="50%" flexDirection="row" alignItems="center">
            <Join separator={<Spacer x={0.5} />}>
              {deltaIcon}
              <Text variant="lg-display">{formattedMedianSaleOverEstimatePercentage}%</Text>
            </Join>
          </Flex>
          <Text variant="sm">Sale price over estimate</Text>
        </Flex>
      </Flex>
      <Separator my={2} ml={-2} width={screenWidth} />
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
  environment: Environment
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
        <Text variant="sm-display" mr={0.5}>
          Market Signals
        </Text>
      </Flex>
      <Text variant="xs" color="mono60" my={0.5}>
        Last 36 months
      </Text>
      <Spacer y={0.5} />
      <PlaceholderBox width="100%" height={40} />
      <Flex flexDirection="row" flexWrap="wrap" mt="15px">
        <Flex width="50%">
          <Spacer y={0.5} />
          <PlaceholderText width={30} height={25} />
          <Text variant="sm">Yearly lots sold</Text>
        </Flex>
        <Flex width="50%">
          <Spacer y={0.5} />
          <PlaceholderText width={60} height={25} />
          <Text variant="sm">Sell-through rate</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Spacer y={0.5} />
          <PlaceholderText width={50} height={25} />
          <Text variant="sm">Average sale price</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Spacer y={0.5} />
          <PlaceholderText width={70} height={25} />
          <Text variant="sm">Sale price over estimate</Text>
        </Flex>
      </Flex>
    </>
  )
}

const InfoModalContent: React.FC = () => (
  <>
    <Spacer y={1} />
    <Text>
      The following data points provide an overview of an artist’s auction market for a specific
      medium (e.g., photography, painting) over the past 36 months.
    </Text>
    <Spacer y={2} />
    <Text>
      These market signals bring together data from top auction houses around the world, including
      Christie’s, Sotheby’s, Phillips and Bonhams.
    </Text>
    <Spacer y={2} />
    <Text>
      In this data set, please note that the sale price includes the hammer price and buyer’s
      premium, as well as any other additional fees (e.g., Artist’s Resale Rights). The data set
      only includes works valued over $1,000.
    </Text>
    <Spacer y={2} />
    <Text fontWeight="bold">Average yearly lots sold</Text>
    <Spacer y={1} />
    <Text>The average number of lots sold per year at auction over the past 36 months.</Text>
    <Spacer y={2} />
    <Text fontWeight="bold">Sell-through rate</Text>
    <Spacer y={1} />
    <Text>The percentage of lots in auctions that sold over the past 36 months.</Text>
    <Spacer y={2} />
    <Text fontWeight="bold">Average sale price</Text>
    <Spacer y={1} />
    <Text>The average sale price of lots sold at auction over the past 36 months.</Text>
    <Spacer y={2} />
    <Text fontWeight="bold">Sale price over estimate</Text>
    <Spacer y={1} />
    <Text>
      The average percentage difference of the sale price over the mid-estimate (the midpoint of the
      low and high estimates set by the auction house before the auction takes place) for lots sold
      at auction over the past 36 months.
    </Text>
  </>
)

const tracks = {
  tapMarketStatsInfo: (): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.auctionResults,
    context_screen_owner_type: OwnerType.artistAuctionResults,
    subject: "artistMarketStatistics",
  }),
}
