import { MyCollectionArtworkInsights_artwork } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { MyCollectionArtworkInsights_marketPriceInsights } from "__generated__/MyCollectionArtworkInsights_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Separator, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { MyCollectionArtworkArtistArticlesFragmentContainer } from "./MyCollectionArtworkArtistArticles"
import { MyCollectionArtworkArtistAuctionResultsFragmentContainer } from "./MyCollectionArtworkArtistAuctionResults"
import { MyCollectionArtworkArtistMarketFragmentContainer } from "./MyCollectionArtworkArtistMarket"
import { MyCollectionArtworkDemandIndexFragmentContainer } from "./MyCollectionArtworkDemandIndex"
import { MyCollectionArtworkPriceEstimateFragmentContainer } from "./MyCollectionArtworkPriceEstimate"

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
            <Text variant="title">Price and market insights</Text>
            <Text variant="small" color="black60">
              For {artwork.artist?.name || "Unknown Artist"}, {artwork.medium}, size {artwork.sizeBucket}
            </Text>
          </ScreenMargin>
          <Spacer mt={3} />
          <MyCollectionArtworkDemandIndexFragmentContainer marketPriceInsights={marketPriceInsights} />
          <ScreenMargin my={3}>
            <Separator />
          </ScreenMargin>
          <MyCollectionArtworkPriceEstimateFragmentContainer
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />
          <ScreenMargin mt={2} mb={3}>
            <Separator />
          </ScreenMargin>
          <MyCollectionArtworkArtistMarketFragmentContainer marketPriceInsights={marketPriceInsights} />
          <ScreenMargin mt={2} mb={3}>
            <Separator />
          </ScreenMargin>
        </>
      )}

      <MyCollectionArtworkArtistAuctionResultsFragmentContainer artwork={artwork} />
      <MyCollectionArtworkArtistArticlesFragmentContainer artwork={artwork} />
    </>
  )
}

export const MyCollectionArtworkInsightsFragmentContainer = createFragmentContainer(MyCollectionArtworkInsights, {
  artwork: graphql`
    fragment MyCollectionArtworkInsights_artwork on Artwork {
      sizeBucket
      medium
      artist {
        name
      }
      ...MyCollectionArtworkPriceEstimate_artwork
      ...MyCollectionArtworkArtistAuctionResults_artwork
      ...MyCollectionArtworkArtistArticles_artwork
    }
  `,
  marketPriceInsights: graphql`
    fragment MyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
      ...MyCollectionArtworkDemandIndex_marketPriceInsights
      ...MyCollectionArtworkPriceEstimate_marketPriceInsights
      ...MyCollectionArtworkArtistMarket_marketPriceInsights
    }
  `,
})
