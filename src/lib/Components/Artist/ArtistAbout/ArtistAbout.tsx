import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import RelatedArtists from "../../RelatedArtists/RelatedArtists"
import Articles from "../Articles"
import Biography from "../Biography"

import { ArtistAbout_artist } from "__generated__/ArtistAbout_artist.graphql"
import { navigate } from "lib/navigation/navigate"
import { getCurrentEmissionState } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { CaretButton } from "../../Buttons/CaretButton"
import { Stack } from "../../Stack"
import { StickyTabPageScrollView } from "../../StickyTabPage/StickyTabPageScrollView"
import { ArtistConsignButtonFragmentContainer as ArtistConsignButton } from "../ArtistConsignButton"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"

interface Props {
  artist: ArtistAbout_artist
}

const ArtistAbout: React.FC<Props> = ({ artist }) => {
  const articles = extractNodes(artist.articles)
  const relatedArtists = extractNodes(artist.related?.artists)

  return (
    <StickyTabPageScrollView>
      <Stack spacing={3} my={2}>
        {!!artist.has_metadata && <Biography artist={artist as any} />}
        {!!artist.is_display_auction_link && (
          <CaretButton
            text="Auction results"
            onPress={() => navigate(`/artist/${this.props.artist.slug}/auction-results`)}
          />
        )}
        <ArtistConsignButton artist={artist} />
        {!!getCurrentEmissionState().options.AROptionsNewInsightsPage && (
          <ArtistAboutShowsFragmentContainer artist={artist} />
        )}
        {!!articles.length && <Articles articles={articles} />}
        {!!relatedArtists.length && <RelatedArtists artists={relatedArtists} />}
      </Stack>
    </StickyTabPageScrollView>
  )
}

export default createFragmentContainer(ArtistAbout, {
  artist: graphql`
    fragment ArtistAbout_artist on Artist {
      has_metadata: hasMetadata
      is_display_auction_link: isDisplayAuctionLink
      slug
      ...Biography_artist
      ...ArtistConsignButton_artist
      ...ArtistAboutShows_artist
      related {
        artists: artistsConnection(first: 16) {
          edges {
            node {
              ...RelatedArtists_artists
            }
          }
        }
      }
      articles: articlesConnection(first: 10) {
        edges {
          node {
            ...Articles_articles
          }
        }
      }
    }
  `,
})
