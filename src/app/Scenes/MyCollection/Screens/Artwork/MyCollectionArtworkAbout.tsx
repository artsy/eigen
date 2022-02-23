import { MyCollectionArtworkAbout_artwork$key } from "__generated__/MyCollectionArtworkAbout_artwork.graphql"
import { MyCollectionArtworkAbout_marketPriceInsights$key } from "__generated__/MyCollectionArtworkAbout_marketPriceInsights.graphql"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex } from "palette/elements"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MyCollectionArtworkAboutWork } from "./Components/ArtworkAbout/MyCollectionArtworkAboutWork"
import { MyCollectionArtworkArticles } from "./Components/ArtworkAbout/MyCollectionArtworkArticles"
import { MyCollectionArtworkPurchaseDetails } from "./Components/ArtworkAbout/MyCollectionArtworkPurchaseDetails"

interface MyCollectionArtworkAboutProps {
  artwork: MyCollectionArtworkAbout_artwork$key
  marketPriceInsights: MyCollectionArtworkAbout_marketPriceInsights$key | null
}

export const MyCollectionArtworkAbout: React.FC<MyCollectionArtworkAboutProps> = (props) => {
  const artwork = useFragment<MyCollectionArtworkAbout_artwork$key>(artworkFragment, props.artwork)
  const marketPriceInsights = useFragment<MyCollectionArtworkAbout_marketPriceInsights$key>(
    marketPriceInsightsFragment,
    props.marketPriceInsights
  )
  const articles = extractNodes(artwork.artist?.articles)

  return (
    <StickyTabPageScrollView>
      <Flex my={3}>
        <MyCollectionArtworkAboutWork artwork={artwork} marketPriceInsights={marketPriceInsights} />

        <MyCollectionArtworkPurchaseDetails artwork={artwork} />

        {!!articles.length && (
          <MyCollectionArtworkArticles artistNames={artwork.artistNames} articles={articles} />
        )}
      </Flex>
    </StickyTabPageScrollView>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkAbout_artwork on Artwork {
    ...MyCollectionArtworkAboutWork_artwork
    ...MyCollectionArtworkPurchaseDetails_artwork
    artistNames
    artist {
      articles: articlesConnection(first: 1, inEditorialFeed: true) {
        edges {
          node {
            ...MyCollectionArtworkArticles_article
          }
        }
      }
    }
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkAbout_marketPriceInsights on MarketPriceInsights {
    ...MyCollectionArtworkAboutWork_marketPriceInsights
  }
`
