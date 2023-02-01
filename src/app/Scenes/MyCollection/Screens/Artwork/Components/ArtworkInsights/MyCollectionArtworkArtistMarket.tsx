import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { MyCollectionArtworkArtistMarket_artwork$key } from "__generated__/MyCollectionArtworkArtistMarket_artwork.graphql"
import { MyCollectionArtworkArtistMarket_artworkPriceInsights$key } from "__generated__/MyCollectionArtworkArtistMarket_artworkPriceInsights.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { formatSellThroughRate } from "app/utils/marketPriceInsightHelpers"
import { DecreaseIcon, Flex, IncreaseIcon, Spacer, Text, useSpace } from "palette"
import { ReactElement } from "react"
import { FlatList, View } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"

interface MyCollectionArtworkArtistMarketProps {
  artwork: MyCollectionArtworkArtistMarket_artwork$key
  marketPriceInsights: MyCollectionArtworkArtistMarket_artworkPriceInsights$key
}
interface MarketDataComponents {
  component: ReactElement
}
export const MyCollectionArtworkArtistMarket: React.FC<MyCollectionArtworkArtistMarketProps> = (
  props
) => {
  const { trackEvent } = useTracking()
  const space = useSpace()
  const screenDimensions = useScreenDimensions()
  const isIPad = screenDimensions.width > 700

  const artwork = useFragment(artworkFragment, props.artwork)

  const marketPriceInsights = useFragment(marketPriceInsightsFragment, props.marketPriceInsights)

  if (!artwork || !marketPriceInsights) {
    return null
  }

  const {
    annualLotsSold,
    annualValueSoldDisplayText,
    sellThroughRate,
    medianSaleOverEstimatePercentage,
    liquidityRankDisplayText,
  } = marketPriceInsights

  const SalePriceEstimatePerformance = ({ value }: { value: number }) => {
    const sign = value < 0 ? "down" : "up"
    const color = sign === "up" ? "green100" : "red100"
    const Arrow = sign === "up" ? IncreaseIcon : DecreaseIcon

    return (
      <Flex flexDirection="row" alignItems="center">
        <Arrow fill={color} width={15} height={15} />

        <Spacer mr={1} />

        <Text variant="lg-display" color={color}>
          {Math.abs(value)}%
        </Text>
      </Flex>
    )
  }

  const InsightColumn = ({ name, value }: { name: string; value: string }) => {
    return (
      <>
        <Flex flexDirection="column" justifyContent="flex-start">
          <Text variant="xs">{name}</Text>
          <Text variant="lg-display">{value}</Text>
        </Flex>
      </>
    )
  }

  const marketData: MarketDataComponents[] = []

  if (annualValueSoldDisplayText) {
    marketData.push({
      component: <InsightColumn name="Annual Value Sold" value={annualValueSoldDisplayText} />,
    })
  }
  if (annualLotsSold) {
    marketData.push({
      component: <InsightColumn name="Annual Lots Sold" value={annualLotsSold.toString()} />,
    })
  }

  if (sellThroughRate) {
    marketData.push({
      component: (
        <InsightColumn
          name="Sell-through Rate"
          value={`${formatSellThroughRate(sellThroughRate)}%`}
        />
      ),
    })
  }
  if (medianSaleOverEstimatePercentage) {
    marketData.push({
      component: (
        <Flex flexDirection="column" justifyContent="flex-start">
          <Text variant="xs">Price Over Estimate</Text>
          <SalePriceEstimatePerformance value={medianSaleOverEstimatePercentage} />
        </Flex>
      ),
    })
  }

  if (liquidityRankDisplayText) {
    marketData.push({
      component: <InsightColumn name="Liquidity" value={liquidityRankDisplayText} />,
    })
  }

  return (
    <Flex mb={4} justifyContent="space-between">
      <InfoButton
        title="Artist Market"
        subTitle="Based on the last 36 months of auction data"
        modalTitle="Artist Market Insights"
        modalContent={
          <>
            <Spacer my={0.5} />
            <Text>
              These statistics are based on the last 36 months of auction sale data from top
              commercial auction houses.
            </Text>
          </>
        }
        onPress={() => trackEvent(tracks.tappedInfoBubble(artwork.internalID, artwork.slug))}
      />

      <Spacer mb={2} mt={0.5} />

      <View
        style={{
          flex: isIPad ? 3 : 2, // the number of columns
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        <FlatList
          data={marketData}
          numColumns={isIPad ? 3 : 2}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                maxWidth: isIPad ? "33%" : "50%", // 100% devided by the number of rows
                alignItems: "stretch",
                paddingBottom: space("2"),
              }}
            >
              {item.component}
            </View>
          )}
          listKey="artwork-artist-marker"
        />
      </View>
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkArtistMarket_artwork on Artwork {
    internalID
    slug
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkArtistMarket_artworkPriceInsights on ArtworkPriceInsights {
    annualLotsSold
    annualValueSoldDisplayText
    sellThroughRate
    liquidityRankDisplayText
    medianSaleOverEstimatePercentage
  }
`

const tracks = {
  tappedInfoBubble: (internalID: string, slug: string): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.myCollectionArtwork,
    context_screen_owner_id: internalID,
    context_screen_owner_slug: slug,
    context_screen_owner_type: OwnerType.myCollectionArtwork,
    subject: "artistMarketStatistics",
  }),
}
