import { Flex, Tabs, useTheme } from "@artsy/palette-mobile"
import { MyCollectionArtworkAbout_artwork$key } from "__generated__/MyCollectionArtworkAbout_artwork.graphql"
import { MyCollectionArtworkAbout_marketPriceInsights$key } from "__generated__/MyCollectionArtworkAbout_marketPriceInsights.graphql"
import { MyCollectionArtworkAbout_me$key } from "__generated__/MyCollectionArtworkAbout_me.graphql"
import { RequestForPriceEstimateBanner } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateBanner"
import { extractNodes } from "app/utils/extractNodes"
import { useFragment, graphql } from "react-relay"
import { MyCollectionArtworkAboutWork } from "./Components/ArtworkAbout/MyCollectionArtworkAboutWork"
import { MyCollectionArtworkArticles } from "./Components/ArtworkAbout/MyCollectionArtworkArticles"
import { MyCollectionWhySell } from "./Components/MyCollectionWhySell"

interface MyCollectionArtworkAboutProps {
  artwork: MyCollectionArtworkAbout_artwork$key
  marketPriceInsights: MyCollectionArtworkAbout_marketPriceInsights$key | null | undefined
  me: MyCollectionArtworkAbout_me$key | null | undefined
  renderWithoutScrollView?: boolean
}

export function MyCollectionArtworkAbout(props: MyCollectionArtworkAboutProps) {
  const { space } = useTheme()
  const artwork = useFragment(artworkFragment, props.artwork)
  const me = useFragment(meFragment, props.me)
  const marketPriceInsights = useFragment(marketPriceInsightsFragment, props.marketPriceInsights)

  const articles = extractNodes(artwork.artist?.articles)

  const isP1Artist = artwork.artist?.targetSupply?.isP1

  const Wrapper = props.renderWithoutScrollView ? Flex : Tabs.ScrollView
  return (
    <Wrapper style={!!props.renderWithoutScrollView && { paddingHorizontal: space(2) }}>
      <Flex mt={props.renderWithoutScrollView ? 1 : 2} mb={4}>
        <MyCollectionArtworkAboutWork artwork={artwork} marketPriceInsights={marketPriceInsights} />

        {!!isP1Artist && <MyCollectionWhySell artwork={artwork} contextModule="about" />}

        <RequestForPriceEstimateBanner
          me={me}
          artwork={artwork}
          marketPriceInsights={marketPriceInsights}
          contextModule="about"
        />

        <MyCollectionArtworkArticles
          artistSlug={artwork.artist?.slug}
          artistNames={artwork.artistNames}
          articles={articles}
          totalCount={artwork.artist?.articles?.totalCount}
        />
      </Flex>
    </Wrapper>
  )
}

const artworkFragment = graphql`
  fragment MyCollectionArtworkAbout_artwork on Artwork {
    ...MyCollectionArtworkAboutWork_artwork
    artistNames
    consignmentSubmission {
      displayText
    }
    artist {
      slug
      articles: articlesConnection(first: 10, sort: PUBLISHED_AT_DESC) {
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
    ...RequestForPriceEstimateBanner_artwork
  }
`

const marketPriceInsightsFragment = graphql`
  fragment MyCollectionArtworkAbout_marketPriceInsights on MarketPriceInsights {
    ...MyCollectionArtworkAboutWork_marketPriceInsights
    ...RequestForPriceEstimateBanner_marketPriceInsights
  }
`

const meFragment = graphql`
  fragment MyCollectionArtworkAbout_me on Me {
    ...RequestForPriceEstimateBanner_me
  }
`
