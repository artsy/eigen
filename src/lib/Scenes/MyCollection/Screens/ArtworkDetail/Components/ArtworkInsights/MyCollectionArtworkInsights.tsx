import { MyCollectionArtworkInsights_artwork } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { MyCollectionArtworkInsights_marketPriceInsights } from "__generated__/MyCollectionArtworkInsights_marketPriceInsights.graphql"
import { Divider } from "lib/Components/Bidding/Components/Divider"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Separator, Spacer, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { InfoModal } from "./InfoModal"
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
              For this artist, category, and size combination
            </Text>
          </ScreenMargin>
          <Spacer mt={3} />
          <MyCollectionArtworkDemandIndexFragmentContainer marketPriceInsights={marketPriceInsights} />
          <ScreenMargin my={3}>
            <Divider />
          </ScreenMargin>
          <MyCollectionArtworkPriceEstimateFragmentContainer
            artwork={artwork}
            marketPriceInsights={marketPriceInsights}
          />
          <ScreenMargin mt={2} mb={3}>
            <Divider />
          </ScreenMargin>
          <MyCollectionArtworkArtistMarketFragmentContainer marketPriceInsights={marketPriceInsights} />
          <ScreenMargin mt={2} mb={3}>
            <Divider />
          </ScreenMargin>
        </>
      )}

      <MyCollectionArtworkArtistAuctionResultsFragmentContainer artwork={artwork} />
      <MyCollectionArtworkArtistArticlesFragmentContainer artwork={artwork} />
      <InfoModal />
    </>
  )
}

export const MyCollectionArtworkInsightsFragmentContainer = createFragmentContainer(MyCollectionArtworkInsights, {
  artwork: graphql`
    fragment MyCollectionArtworkInsights_artwork on Artwork {
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
