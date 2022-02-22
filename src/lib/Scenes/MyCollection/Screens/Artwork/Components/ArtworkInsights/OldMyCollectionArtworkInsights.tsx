import { OldMyCollectionArtworkInsights_artwork } from "__generated__/OldMyCollectionArtworkInsights_artwork.graphql"
import { OldMyCollectionArtworkInsights_marketPriceInsights } from "__generated__/OldMyCollectionArtworkInsights_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { capitalize } from "lodash"
import { Separator, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { pluralizeMedium } from "../../../../utils/pluralizeArtworkMedium"
import { MyCollectionArtworkArtistArticlesFragmentContainer } from "./MyCollectionArtworkArtistArticles"
import { OldMyCollectionArtworkArtistAuctionResultsFragmentContainer } from "./OldMyCollectionArtworkArtistAuctionResults"
import { OldMyCollectionArtworkArtistMarketFragmentContainer } from "./OldMyCollectionArtworkArtistMarket"
import { OldMyCollectionArtworkDemandIndexFragmentContainer } from "./OldMyCollectionArtworkDemandIndex"

interface OldMyCollectionArtworkInsightsProps {
  artwork: OldMyCollectionArtworkInsights_artwork
  marketPriceInsights: OldMyCollectionArtworkInsights_marketPriceInsights
}

export const OldMyCollectionArtworkInsights: React.FC<OldMyCollectionArtworkInsightsProps> = ({
  artwork,
  marketPriceInsights,
}) => {
  const showMarketPriceInsights = Boolean(marketPriceInsights)
  return (
    <>
      {showMarketPriceInsights && (
        <>
          <Separator />
          <Spacer my={1} />

          <ScreenMargin>
            <Text variant="md">Market Insights</Text>
            <Text variant="xs" color="black60">
              {capitalize(artwork.sizeBucket!)} {pluralizeMedium(artwork.medium!)} by{" "}
              {artwork.artist?.name || "Unknown Artist"}
            </Text>
          </ScreenMargin>
          <Spacer mt={3} />
          <OldMyCollectionArtworkDemandIndexFragmentContainer
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />

          <ScreenMargin>
            <Spacer my={1} />
            <Separator />
            <Spacer my={2} />
          </ScreenMargin>

          <OldMyCollectionArtworkArtistMarketFragmentContainer
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />
        </>
      )}
      <ScreenMargin mt={2} mb={3}>
        <Spacer my={1} />
        <Separator />
        <Spacer my={2} />
        <OldMyCollectionArtworkArtistAuctionResultsFragmentContainer artwork={artwork} />
      </ScreenMargin>

      <MyCollectionArtworkArtistArticlesFragmentContainer artwork={artwork} />
    </>
  )
}

export const OldMyCollectionArtworkInsightsFragmentContainer = createFragmentContainer(
  OldMyCollectionArtworkInsights,
  {
    artwork: graphql`
      fragment OldMyCollectionArtworkInsights_artwork on Artwork {
        sizeBucket
        medium
        artist {
          name
        }
        ...OldMyCollectionArtworkArtistAuctionResults_artwork
        ...MyCollectionArtworkArtistArticles_artwork
        ...OldMyCollectionArtworkArtistMarket_artwork
        ...OldMyCollectionArtworkDemandIndex_artwork
      }
    `,
    marketPriceInsights: graphql`
      fragment OldMyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
        ...OldMyCollectionArtworkDemandIndex_marketPriceInsights
        ...OldMyCollectionArtworkArtistMarket_marketPriceInsights
      }
    `,
  }
)
