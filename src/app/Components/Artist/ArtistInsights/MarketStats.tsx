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
import { defineMessages, useIntl } from "react-intl"
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
  const intl = useIntl()

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
      <Text>{intl.formatMessage(intlMessages.text1)}</Text>
      <Spacer mb={2} />
      <Text>{intl.formatMessage(intlMessages.text2)}</Text>
      <Spacer mb={2} />
      <Text>{intl.formatMessage(intlMessages.text3)}</Text>
      <Spacer mb={2} />
      <Text fontWeight="bold">{intl.formatMessage(intlMessages.text4)}</Text>
      <Spacer mb={1} />
      <Text>{intl.formatMessage(intlMessages.text5)}</Text>
      <Spacer mb={2} />
      <Text fontWeight="bold">{intl.formatMessage(intlMessages.text6)}</Text>
      <Spacer mb={1} />
      <Text>{intl.formatMessage(intlMessages.text7)}</Text>
      <Spacer mb={2} />
      <Text fontWeight="bold">{intl.formatMessage(intlMessages.text8)}</Text>
      <Spacer mb={1} />
      <Text>{intl.formatMessage(intlMessages.text9)}</Text>
      <Spacer mb={2} />
      <Text fontWeight="bold">{intl.formatMessage(intlMessages.text10)}</Text>
      <Spacer mb={1} />
      <Text>{intl.formatMessage(intlMessages.text11)}</Text>
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
              {intl.formatMessage(intlMessages.infoButtonTitle)}
            </Text>
          }
          trackEvent={() => {
            tracking.trackEvent(tracks.tapMarketStatsInfo())
          }}
          modalTitle={intl.formatMessage(intlMessages.infoButtonTitle)}
          modalContent={renderInfoModal()}
        />
      </Flex>
      <Text variant="xs" color="black60" my={0.5}>
        {intl.formatMessage(intlMessages.averageText)}
      </Text>
      <Select
        value={selectedPriceInsight.medium}
        options={mediumOptions.current}
        title={intl.formatMessage(intlMessages.selectTitle)}
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
          <Text variant="sm">{intl.formatMessage(intlMessages.annualLotsSold)}</Text>
        </Flex>
        <Flex width="50%">
          <Text variant="lg">{formattedSellThroughRate}%</Text>
          <Text variant="sm">{intl.formatMessage(intlMessages.sellthroughRate)}</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Text variant="lg">${formattedAverageValueSold}</Text>
          <Text variant="sm">{intl.formatMessage(intlMessages.salePrice)}</Text>
        </Flex>
        <Flex width="50%" mt={2}>
          <Flex width="50%" flexDirection="row" alignItems="center">
            <Join separator={<Spacer mr={0.5} />}>
              {deltaIcon}
              <Text variant="lg">{formattedMedianSaleOverEstimatePercentage}%</Text>
            </Join>
          </Flex>
          <Text variant="sm">{intl.formatMessage(intlMessages.salePriceOverEstimate)}</Text>
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

const intlMessages = defineMessages({
  text1: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text1",
    defaultMessage:
      "The following data points provide an overview of an artist’s auction market for a specific (e.g., photography, painting) over the past 36 months..",
  },
  text2: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text2",
    defaultMessage:
      "These market signals bring together data from top auction houses around the world, including Christie’s, Sotheby’s, Phillips and Bonhams.",
  },
  text3: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text3",
    defaultMessage:
      "In this data set, please note that the sale price includes the hammer price and buyer’s premium, as well as any other additional fees (e.g., Artist’s Resale Rights). The data set only includes works valued over $1,000.",
  },
  text4: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text4",
    defaultMessage: "Average yearly lots sold",
  },
  text5: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text5",
    defaultMessage: "The average number of lots sold per year at auction over the past 36 months.",
  },
  text6: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text6",
    defaultMessage: "Sell-through rate",
  },
  text7: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text7",
    defaultMessage: "The percentage of lots in auctions that sold over the past 36 months.",
  },
  text8: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text8",
    defaultMessage: "Average sale price",
  },
  text9: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text9",
    defaultMessage: "The average sale price of lots sold at auction over the past 36 months.",
  },
  text10: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text10",
    defaultMessage: "Sale price over estimate",
  },
  text11: {
    id: "component.artist.artistinsights.marketstats.renderinfomodal.text11",
    defaultMessage:
      "The average percentage difference of the sale price over the mid-estimate (the midpoint of the low and high estimates set by the auction house before the auction takes place) for lots sold at auction over the past 36 months.",
  },
  infoButtonTitle: {
    id: "component.artist.artistinsights.marketstats.infobutton.title",
    defaultMessage: "Market Signals",
  },
  averageText: {
    id: "component.artist.artistinsights.marketstats.averagetext",
    defaultMessage: "Averages over last 36 months",
  },
  selectTitle: {
    id: "component.artist.artistinsights.marketstats.select.title",
    defaultMessage: "Select medium",
  },
  annualLotsSold: {
    id: "component.artist.artistinsights.marketstats.annuallotssold",
    defaultMessage: "Yearly lots sold",
  },
  sellthroughRate: {
    id: "component.artist.artistinsights.marketstats.sellthroughrate",
    defaultMessage: "Sell-through rate",
  },
  salePrice: {
    id: "component.artist.artistinsights.marketstats.saleprice",
    defaultMessage: "Sale price",
  },
  salePriceOverEstimate: {
    id: "component.artist.artistinsights.marketstats.salepriceoverestimate",
    defaultMessage: "Sale price over estimate",
  },
})
