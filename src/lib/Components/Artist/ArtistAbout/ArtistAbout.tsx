import { ArtistAbout_artist } from "__generated__/ArtistAbout_artist.graphql"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import RelatedArtists from "../../RelatedArtists/RelatedArtists"
import { Stack } from "../../Stack"
import { StickyTabPageScrollView } from "../../StickyTabPage/StickyTabPageScrollView"
import Articles from "../Articles"
import { ArtistConsignButtonFragmentContainer as ArtistConsignButton } from "../ArtistConsignButton"
import Biography from "../Biography"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"

interface Props {
  artist: ArtistAbout_artist
}

export const ArtistAbout: React.FC<Props> = ({ artist }) => {
  const articles = extractNodes(artist.articles)
  const relatedArtists = extractNodes(artist.related?.artists)

  return (
    <StickyTabPageScrollView>
      <Stack spacing={3} my={2}>
        {!!artist.hasMetadata && <Biography artist={artist as any} />}
        <ArtistConsignButton artist={artist} />
        {!!useFeatureFlag("AROptionsNewArtistInsightsPage") && <ArtistAboutShowsFragmentContainer artist={artist} />}
        {!!articles.length && <Articles articles={articles} />}
        {!!relatedArtists.length && <RelatedArtists artists={relatedArtists} />}
      </Stack>
    </StickyTabPageScrollView>
  )
}

export const ArtistAboutContainer = createFragmentContainer(ArtistAbout, {
  artist: graphql`
    fragment ArtistAbout_artist on Artist {
      hasMetadata
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
      articles: articlesConnection(first: 10, inEditorialFeed: true) {
        edges {
          node {
            ...Articles_articles
          }
        }
      }
    }
  `,
})
