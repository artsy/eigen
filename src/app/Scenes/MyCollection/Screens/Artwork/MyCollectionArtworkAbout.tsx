import { MyCollectionArtworkAbout_artwork$key } from "__generated__/MyCollectionArtworkAbout_artwork.graphql"
import { MyCollectionArtworkAbout_marketPriceInsights$key } from "__generated__/MyCollectionArtworkAbout_marketPriceInsights.graphql"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Spacer } from "palette/elements"
import React from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MyCollectionArtworkAboutWork } from "./Components/ArtworkAbout/MyCollectionArtworkAboutWork"
import { MyCollectionArtworkArticles } from "./Components/ArtworkAbout/MyCollectionArtworkArticles"
import { MyCollectionArtworkPurchaseDetails } from "./Components/ArtworkAbout/MyCollectionArtworkPurchaseDetails"
import { MyCollectionWhySell } from "./Components/MyCollectionWhySell"

interface MyCollectionArtworkAboutProps {
  artwork: MyCollectionArtworkAbout_artwork$key
  marketPriceInsights: MyCollectionArtworkAbout_marketPriceInsights$key | null
  renderWithoutScrollView?: boolean
}

export function MyCollectionArtworkAbout(props: MyCollectionArtworkAboutProps) {
  const artwork = useFragment<MyCollectionArtworkAbout_artwork$key>(artworkFragment, props.artwork)
  const marketPriceInsights = useFragment<MyCollectionArtworkAbout_marketPriceInsights$key>(
    marketPriceInsightsFragment,
    props.marketPriceInsights
  )

  const articles = extractNodes(artwork.artist?.articles)
  const Wrapper = props.renderWithoutScrollView ? Flex : StickyTabPageScrollView
  return (
    <Wrapper px={props.renderWithoutScrollView ? 20 : 0}>
      <Flex mt={props.renderWithoutScrollView ? 1 : 3} mb={3}>
        <MyCollectionArtworkAboutWork artwork={artwork} marketPriceInsights={marketPriceInsights} />

        <MyCollectionArtworkPurchaseDetails artwork={artwork} />

        <MyCollectionArtworkArticles
          artistSlug={artwork.artist?.slug}
          artistNames={artwork.artistNames}
          articles={articles}
          totalCount={artwork.artist?.articles?.totalCount}
        />
        <MyCollectionWhySell artwork={artwork} />
      </Flex>
    </Wrapper>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkAbout_artwork on Artwork {
    ...MyCollectionArtworkAboutWork_artwork
    ...MyCollectionArtworkPurchaseDetails_artwork
    artistNames
    consignmentSubmission {
      displayText
    }
    artist {
      slug
      articles: articlesConnection(first: 10, inEditorialFeed: true, sort: PUBLISHED_AT_DESC) {
        totalCount
        edges {
          node {
            ...MyCollectionArtworkArticles_article
          }
        }
      }
      targetSupply {
        isP1
      }
    }
    ...MyCollectionWhySell_artwork
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkAbout_marketPriceInsights on MarketPriceInsights {
    ...MyCollectionArtworkAboutWork_marketPriceInsights
  }
`
