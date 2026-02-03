import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Spacer, Tabs, useSpace } from "@artsy/palette-mobile"
import { ArtistAbout_artist$data } from "__generated__/ArtistAbout_artist.graphql"
import { Articles } from "app/Components/Artist/Articles/Articles"
import { ArtistAboutEmpty } from "app/Components/Artist/ArtistAbout/ArtistAboutEmpty"
import { ArtistAboutRelatedGenes } from "app/Components/Artist/ArtistAbout/ArtistAboutRelatedGenes"
import { Biography, MAX_WIDTH_BIO } from "app/Components/Artist/Biography"
import { RelatedArtistsRail } from "app/Components/Artist/RelatedArtistsRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { ArtistSeriesMoreSeriesFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"
import { ArtistCareerHighlights } from "./ArtistCareerHighlights"

interface Props {
  artist: ArtistAbout_artist$data
}

export const ArtistAbout: React.FC<Props> = ({ artist }) => {
  const space = useSpace()

  const articles = extractNodes(artist.articlesConnection)
  const relatedArtists = extractNodes(artist.related?.artistsConnection)
  const relatedGenes = extractNodes(artist.related?.genes)

  const hasInsights = artist.hasArtistInsights.length > 0
  const hasArtistSeries = artist.hasArtistSeriesConnection?.totalCount ?? 0 > 0
  const hasShows = artist.hasArtistShows?.totalCount ?? 0 > 0
  const hasBiography = !!artist.hasBiographyBlurb?.text
  const hasArticles = artist.counts?.articles ?? 0 > 0
  const hasRelatedArtists = artist.counts?.relatedArtists ?? 0 > 0
  const hasRelatedGenes = relatedGenes.length > 0

  const isDisplayable =
    hasArtistSeries ||
    hasInsights ||
    hasBiography ||
    hasArticles ||
    hasRelatedArtists ||
    hasRelatedGenes

  const data = compact([
    hasBiography && {
      key: "biography",
      content: (
        <>
          <Spacer y={1} />
          <Flex maxWidth={MAX_WIDTH_BIO} px={2}>
            <SectionTitle title="Biography" />
            <Biography artist={artist} />
          </Flex>
        </>
      ),
    },

    !!hasInsights && {
      key: "insights",
      content: <ArtistCareerHighlights artist={artist} />,
    },

    !!hasArtistSeries && {
      key: "artistSeries",
      content: (
        <ArtistSeriesMoreSeriesFragmentContainer
          px={2}
          contextScreenOwnerId={artist.internalID}
          contextScreenOwnerSlug={artist.slug}
          contextScreenOwnerType={OwnerType.artist}
          contextModule={ContextModule.artistSeriesRail}
          artist={artist}
          artistSeriesHeader="Top Artist Series"
        />
      ),
    },

    !!hasArticles && {
      key: "articles",
      content: <Articles articles={articles} artist={artist} />,
    },

    !!hasShows && {
      key: "shows",
      content: <ArtistAboutShowsFragmentContainer artist={artist} />,
    },

    !!hasRelatedArtists && {
      key: "relatedArtists",
      content: <RelatedArtistsRail artists={relatedArtists} artist={artist} />,
    },
    !!hasRelatedGenes && {
      key: "relatedGenes",
      content: <ArtistAboutRelatedGenes genes={relatedGenes} />,
    },
  ])

  return (
    <Tabs.FlashList
      data={isDisplayable ? data : []}
      renderItem={({ item }) => item?.content}
      keyExtractor={(item) => item?.key}
      ItemSeparatorComponent={() => <Spacer y={4} />}
      contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: space(4) }}
      ListEmptyComponent={() => <ArtistAboutEmpty my={6} />}
    />
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
      ...RelatedArtistsRailCell_artist
      counts {
        articles
        relatedArtists
      }
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
      articlesConnection(first: 5) {
        edges {
          node {
            ...Articles_articles
          }
        }
      }
    }
  `,
})
