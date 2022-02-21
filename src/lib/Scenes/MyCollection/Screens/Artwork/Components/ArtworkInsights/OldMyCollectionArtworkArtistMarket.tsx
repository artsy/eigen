import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { OldMyCollectionArtworkArtistMarket_artwork } from "__generated__/OldMyCollectionArtworkArtistMarket_artwork.graphql"
import { OldMyCollectionArtworkArtistMarket_marketPriceInsights } from "__generated__/OldMyCollectionArtworkArtistMarket_marketPriceInsights.graphql"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { formatCentsToDollars } from "lib/Scenes/MyCollection/utils/formatCentsToDollars"
import { Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { Field } from "../OldField"

interface OldMyCollectionArtworkArtistMarketProps {
  artwork: OldMyCollectionArtworkArtistMarket_artwork
  marketPriceInsights: OldMyCollectionArtworkArtistMarket_marketPriceInsights
}

const OldMyCollectionArtworkArtistMarket: React.FC<OldMyCollectionArtworkArtistMarketProps> = ({
  artwork,
  marketPriceInsights,
}) => {
  const { trackEvent } = useTracking()
  if (!artwork || !marketPriceInsights) {
    return null
  }

  const {
    annualLotsSold,
    annualValueSoldCents,
    sellThroughRate,
    medianSaleToEstimateRatio,
    liquidityRank: _liquidityRate,
    demandTrend: _demandTrend,
  } = marketPriceInsights

  const getFormattedDemandTrend = () => {
    const demandTrend = _demandTrend!

    switch (true) {
      case demandTrend < -9:
        return "Trending down"
      case -9 < demandTrend && demandTrend < -6:
        return "Flat"
      case demandTrend > 7:
        return "Trending up"
    }
  }

  const getFormattedLiquidityRank = () => {
    const liquidityRank = _liquidityRate!

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
  }

  const formattedAnnualValueSold = formatCentsToDollars(Number(annualValueSoldCents))
  const formattedDemandTrend = getFormattedDemandTrend() as string
  const formatLiquidityRank = getFormattedLiquidityRank() as string

  return (
    <ScreenMargin>
      <InfoButton
        title="Artist Market Statistics"
        subTitle="Based on the last 36 months of auction data"
        modalTitle="Artist Market Insights"
        modalContent={
          <>
            <Spacer my={1} />
            <Text>
              These statistics are based on the last 36 months of auction sale data from top
              commercial auction houses.
            </Text>
          </>
        }
        onPress={() => trackEvent(tracks.tappedInfoBubble(artwork.internalID, artwork.slug))}
      />

      <Spacer my={0.5} />

      <Field label="Avg. Annual Value Sold" value={formattedAnnualValueSold} />
      <Field label="Avg. Annual Lots Sold" value={`${annualLotsSold}`} />
      <Field label="Sell-through Rate" value={`${sellThroughRate}%`} />
      <Field label="Median Sale Price to Estimate" value={`${medianSaleToEstimateRatio}x`} />
      <Field label="Liquidity" value={formatLiquidityRank} />
      <Field label="1-Year Trend" value={formattedDemandTrend} />
    </ScreenMargin>
  )
}

export const OldMyCollectionArtworkArtistMarketFragmentContainer = createFragmentContainer(
  OldMyCollectionArtworkArtistMarket,
  {
    artwork: graphql`
      fragment OldMyCollectionArtworkArtistMarket_artwork on Artwork {
        internalID
        slug
      }
    `,
    marketPriceInsights: graphql`
      fragment OldMyCollectionArtworkArtistMarket_marketPriceInsights on MarketPriceInsights {
        annualLotsSold
        annualValueSoldCents
        sellThroughRate
        medianSaleToEstimateRatio
        liquidityRank
        demandTrend
      }
    `,
  }
)

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
