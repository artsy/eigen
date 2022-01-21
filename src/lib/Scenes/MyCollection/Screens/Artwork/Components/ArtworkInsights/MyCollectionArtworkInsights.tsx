import { MyCollectionArtworkInsights_artwork } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { MyCollectionArtworkInsights_marketPriceInsights } from "__generated__/MyCollectionArtworkInsights_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { capitalize } from "lodash"
import { Separator, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { pluralizeMedium } from "../../../../utils/pluralizeArtworkMedium"
import { MyCollectionArtworkArtistArticlesFragmentContainer } from "./MyCollectionArtworkArtistArticles"
import { MyCollectionArtworkArtistAuctionResultsFragmentContainer } from "./MyCollectionArtworkArtistAuctionResults"
import { MyCollectionArtworkArtistMarketFragmentContainer } from "./MyCollectionArtworkArtistMarket"
import { MyCollectionArtworkDemandIndexFragmentContainer } from "./MyCollectionArtworkDemandIndex"

interface MyCollectionArtworkInsightsProps {
  artwork: MyCollectionArtworkInsights_artwork
  marketPriceInsights: MyCollectionArtworkInsights_marketPriceInsights
}

export const MyCollectionArtworkInsights: React.FC<MyCollectionArtworkInsightsProps> = ({
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
          <MyCollectionArtworkDemandIndexFragmentContainer
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />
          <ScreenMargin mt={2} mb={3}>
            <Separator />
          </ScreenMargin>
          <MyCollectionArtworkArtistMarketFragmentContainer
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />
        </>
      )}

      <MyCollectionArtworkArtistAuctionResultsFragmentContainer artwork={artwork} />
      <MyCollectionArtworkArtistArticlesFragmentContainer artwork={artwork} />
    </>
  )
}

export const MyCollectionArtworkInsightsFragmentContainer = createFragmentContainer(
  MyCollectionArtworkInsights,
  {
    artwork: graphql`
      fragment MyCollectionArtworkInsights_artwork on Artwork {
        sizeBucket
        medium
        artist {
          name
        }
        ...MyCollectionArtworkArtistAuctionResults_artwork
        ...MyCollectionArtworkArtistArticles_artwork
        ...MyCollectionArtworkArtistMarket_artwork
        ...MyCollectionArtworkDemandIndex_artwork
      }
    `,
    marketPriceInsights: graphql`
      fragment MyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
        ...MyCollectionArtworkDemandIndex_marketPriceInsights
        ...MyCollectionArtworkArtistMarket_marketPriceInsights
      }
    `,
  }
)
