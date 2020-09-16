import { MyCollectionArtworkInsights_artwork } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { MyCollectionArtworkInsights_marketPriceInsights } from "__generated__/MyCollectionArtworkInsights_marketPriceInsights.graphql"
import { Divider } from "lib/Components/Bidding/Components/Divider"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Box, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { MyCollectionArtworkArtistArticlesFragmentContainer as ArtistArticles } from "./MyCollectionArtworkArtistArticles"
import { MyCollectionArtworkArtistAuctionResultsFragmentContainer as ArtistAuctionResults } from "./MyCollectionArtworkArtistAuctionResults"
import { MyCollectionArtworkArtistMarketFragmentContainer as ArtistMarket } from "./MyCollectionArtworkArtistMarket"
import { MyCollectionArtworkDemandIndexFragmentContainer as ArtworkDemandIndex } from "./MyCollectionArtworkDemandIndex"
import { MyCollectionArtworkPriceEstimateFragmentContainer as ArtworkPriceEstimate } from "./MyCollectionArtworkPriceEstimate"

interface MyCollectionArtworkInsightsProps {
  artwork: MyCollectionArtworkInsights_artwork
  marketPriceInsights: MyCollectionArtworkInsights_marketPriceInsights
}

// TODO: Add fancymodals for info icon clicks

export const MyCollectionArtworkInsights: React.FC<MyCollectionArtworkInsightsProps> = ({
  artwork,
  marketPriceInsights,
  ...rest
}) => {
  console.warn(artwork, rest)
  return (
    <>
      <ScreenMargin>
        <Text variant="title">Price and market insights</Text>
        <Text variant="small" color="black60">
          For this artist, category, and size combination
        </Text>
      </ScreenMargin>

      <Spacer mt={3} />

      <ArtworkDemandIndex marketPriceInsights={marketPriceInsights} />

      <ScreenMargin my={3}>
        <Divider />
      </ScreenMargin>

      <ArtworkPriceEstimate marketPriceInsights={marketPriceInsights} />

      <ScreenMargin mt={2} mb={3}>
        <Divider />
      </ScreenMargin>

      <ArtistMarket marketPriceInsights={marketPriceInsights} />

      <ScreenMargin mt={2} mb={3}>
        <Divider />
      </ScreenMargin>

      <ArtistAuctionResults artwork={artwork} />

      <Box my={3}>
        <Divider />
      </Box>

      <ArtistArticles artwork={artwork} />
    </>
  )
}

export const MyCollectionArtworkInsightsFragmentContainer = createFragmentContainer(MyCollectionArtworkInsights, {
  artwork: graphql`
    fragment MyCollectionArtworkInsights_artwork on Artwork {
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
