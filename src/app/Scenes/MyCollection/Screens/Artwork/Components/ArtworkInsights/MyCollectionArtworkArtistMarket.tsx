import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { MyCollectionArtworkArtistMarket_artwork$key } from "__generated__/MyCollectionArtworkArtistMarket_artwork.graphql"
import { MyCollectionArtworkArtistMarket_marketPriceInsights$key } from "__generated__/MyCollectionArtworkArtistMarket_marketPriceInsights.graphql"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { formatCentsToDollars } from "app/Scenes/MyCollection/utils/formatCentsToDollars"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { Field } from "../Field"

interface MyCollectionArtworkArtistMarketProps {
  artwork: MyCollectionArtworkArtistMarket_artwork$key
  marketPriceInsights: MyCollectionArtworkArtistMarket_marketPriceInsights$key
}

export const MyCollectionArtworkArtistMarket: React.FC<MyCollectionArtworkArtistMarketProps> = (
  props
) => {
  const { trackEvent } = useTracking()

  const artwork = useFragment(artworkFragment, props.artwork)

  const marketPriceInsights = useFragment(marketPriceInsightsFragment, props.marketPriceInsights)

  if (!artwork || !marketPriceInsights) {
    return null
  }

  const {
    annualLotsSold,
    annualValueSoldCents,
    sellThroughRate,
    medianSaleToEstimateRatio,
    liquidityRank,
    demandTrend,
  } = marketPriceInsights

  const formattedAnnualValueSold = formatCentsToDollars(Number(annualValueSoldCents))
  const formattedDemandTrend = getFormattedDemandTrend(demandTrend)
  const formatLiquidityRank = getFormattedLiquidityRank(liquidityRank)

  return (
    <Flex mb={6}>
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

      <Field label="Annual Value Sold" value={formattedAnnualValueSold} />
      <Field label="Annual Lots Sold" value={`${annualLotsSold}`} />
      <Field label="Sell-through Rate" value={`${sellThroughRate}%`} />
      <Field label="Sale Price to Estimate" value={`${medianSaleToEstimateRatio}x`} />
      <Field label="Liquidity" value={formatLiquidityRank} />
      <Field label="One-Year Trend" value={formattedDemandTrend} />
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
  fragment MyCollectionArtworkArtistMarket_marketPriceInsights on MarketPriceInsights {
    annualLotsSold
    annualValueSoldCents
    sellThroughRate
    medianSaleToEstimateRatio
    liquidityRank
    demandTrend
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

const getFormattedDemandTrend = (demandTrend: number | null) => {
  if (demandTrend === null) {
    return ""
  }

  switch (true) {
    case demandTrend < -9:
      return "Trending down"
    case -9 < demandTrend && demandTrend < -6:
      return "Flat"
    case demandTrend > 7:
      return "Trending up"
  }

  return ""
}

const getFormattedLiquidityRank = (liquidityRank: number | null) => {
  if (liquidityRank === null) {
    return ""
  }

  switch (true) {
    case liquidityRank < 0.25:
      return "Low"
    case liquidityRank >= 0.25 && liquidityRank < 0.7:
      return "Medium"
    case liquidityRank >= 0.7 && liquidityRank < 0.85:
      return "High"
    case liquidityRank >= 0.85:
      return "Very High"
  }

  return ""
}
