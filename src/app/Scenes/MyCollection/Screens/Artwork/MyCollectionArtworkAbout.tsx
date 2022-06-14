import { MyCollectionArtworkAbout_artwork$key } from "__generated__/MyCollectionArtworkAbout_artwork.graphql"
import { MyCollectionArtworkAbout_marketPriceInsights$key } from "__generated__/MyCollectionArtworkAbout_marketPriceInsights.graphql"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, useTheme } from "palette"
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
  const { space } = useTheme()
  const artwork = useFragment(artworkFragment, props.artwork)
  const marketPriceInsights = useFragment(marketPriceInsightsFragment, props.marketPriceInsights)

  const articles = extractNodes(artwork.artist?.articles)
  const Wrapper = props.renderWithoutScrollView ? Flex : StickyTabPageScrollView
  return (
    <Wrapper style={{ paddingHorizontal: space(2) }}>
      <Flex mt={props.renderWithoutScrollView ? 1 : 2} mb={3}>
        <MyCollectionArtworkAboutWork artwork={artwork} marketPriceInsights={marketPriceInsights} />

        <MyCollectionArtworkPurchaseDetails artwork={artwork} />

        <MyCollectionArtworkArticles
          artistSlug={artwork.artist?.slug}
          artistNames={artwork.artistNames}
          articles={articles}
          totalCount={artwork.artist?.articles?.totalCount}
        />
        <MyCollectionWhySell artwork={artwork} contextModule="about" />
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
