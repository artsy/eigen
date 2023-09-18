import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Join, Spacer, Tabs } from "@artsy/palette-mobile"
import { ArtistAbout_artist$data } from "__generated__/ArtistAbout_artist.graphql"
import { Articles } from "app/Components/Artist/Articles/Articles"
import { ArtistAboutEmpty } from "app/Components/Artist/ArtistAbout/ArtistAboutEmpty"
import { ArtistAboutRelatedGenes } from "app/Components/Artist/ArtistAbout/ArtistAboutRelatedGenes"
import { Biography } from "app/Components/Artist/Biography"
import { RelatedArtistsRail } from "app/Components/Artist/RelatedArtistsRail"
import { ArtistSeriesMoreSeriesFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { extractNodes } from "app/utils/extractNodes"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"
import { ArtistCareerHighlights } from "./ArtistCareerHighlights"

interface Props {
  artist: ArtistAbout_artist$data
}

export const ArtistAbout: React.FC<Props> = ({ artist }) => {
  const articles = extractNodes(artist.articlesConnection)
  const relatedArtists = extractNodes(artist.related?.artistsConnection)
  const relatedGenes = extractNodes(artist.related?.genes)

  const isDisplayable =
    artist.hasMetadata || !!articles.length || !!relatedArtists.length || !!relatedGenes.length

  const hasInsights = artist.hasArtistInsights.length > 0
  const hasArtistSeries = artist.hasArtistSeriesConnection?.totalCount ?? 0 > 0
  const hasShows = artist.hasArtistShows?.totalCount ?? 0 > 0
  const hasBiography = !!artist.hasBiographyBlurb?.text
  const hasArticles = articles.length > 0
  const hasRelatedArtists = relatedArtists.length > 0
  const hasRelatedGenes = relatedGenes.length > 0

  return (
    <Tabs.ScrollView>
      {isDisplayable ? (
        <>
          <Spacer y={2} />
          <Join separator={<Spacer y={4} />}>
            {!!hasBiography && (
              <>
                <Spacer y={1} />
                <Biography artist={artist} />
              </>
            )}
            {!!hasInsights && <ArtistCareerHighlights artist={artist} />}
            {!!hasArtistSeries && (
              <ArtistSeriesMoreSeriesFragmentContainer
                contextScreenOwnerId={artist.internalID}
                contextScreenOwnerSlug={artist.slug}
                contextScreenOwnerType={OwnerType.artist}
                contextModule={ContextModule.artistSeriesRail}
                artist={artist}
                artistSeriesHeader="Top Artist Series"
              />
            )}
            {!!hasArticles && <Articles articles={articles} artist={artist} />}
            {!!hasShows && <ArtistAboutShowsFragmentContainer artist={artist} />}

            {!!hasRelatedArtists && <RelatedArtistsRail artists={relatedArtists} />}
            {!!hasRelatedGenes && <ArtistAboutRelatedGenes genes={relatedGenes} />}
          </Join>
          <Spacer y={4} />
        </>
      ) : (
        <ArtistAboutEmpty my={6} />
      )}
    </Tabs.ScrollView>
  )
}

export const ArtistAboutContainer = createFragmentContainer(ArtistAbout, {
  artist: graphql`
    fragment ArtistAbout_artist on Artist {
      hasArtistSeriesConnection: artistSeriesConnection(first: 1) {
        totalCount
      }
      hasBiographyBlurb: biographyBlurb(format: PLAIN, partnerBio: false) {
        text
      }
      hasMetadata
      internalID
      hasArtistInsights: insights {
        entities
      }
      hasArtistShows: showsConnection(first: 1, sort: END_AT_ASC, status: "running") {
        totalCount
      }
      slug
      ...Biography_artist
      ...ArtistSeriesMoreSeries_artist
      ...Articles_artist
      ...ArtistAboutShows_artist
      ...ArtistCareerHighlights_artist
      related {
        artistsConnection(first: 12) {
          edges {
            node {
              ...RelatedArtistsRail_artists
            }
          }
        }
        genes {
          edges {
            node {
              ...ArtistAboutRelatedGenes_genes
            }
          }
        }
      }
      articlesConnection(first: 5, inEditorialFeed: true) {
        edges {
          node {
            ...Articles_articles
          }
        }
      }
    }
  `,
})
