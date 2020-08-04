import { Sans } from "@artsy/palette"
import { ArtistSeriesFullArtistSeriesList_artist } from "__generated__/ArtistSeriesFullArtistSeriesList_artist.graphql"
import { ArtistSeriesFullArtistSeriesListQuery } from "__generated__/ArtistSeriesFullArtistSeriesListQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface FullArtistSeriesListProps {
  artist: ArtistSeriesFullArtistSeriesList_artist
}

export const FullArtistSeriesList: React.FC<FullArtistSeriesListProps> = ({ artist }) => {
  if (!artist) {
    return null
  }

  const a = artist?.artistSeriesConnection?.edges?.[0]?.node?.title

  return <Sans size="14">{a}</Sans>
}

export const ArtistSeriesFullArtistSeriesListFragmentContainer = createFragmentContainer(FullArtistSeriesList, {
  artist: graphql`
    fragment ArtistSeriesFullArtistSeriesList_artist on Artist {
      artistSeriesConnection {
        edges {
          node {
            slug
            internalID
            title
            forSaleArtworksCount
            image {
              url
            }
          }
        }
      }
    }
  `,
})

export const ArtistSeriesFullArtistSeriesListQueryRenderer: React.SFC<{ artistID: string }> = ({ artistID }) => {
  return (
    <QueryRenderer<ArtistSeriesFullArtistSeriesListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtistSeriesFullArtistSeriesListQuery($artistID: String!) {
          artist(id: $artistID) {
            ...ArtistSeriesFullArtistSeriesList_artist
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        artistID,
      }}
      render={renderWithLoadProgress(ArtistSeriesFullArtistSeriesListFragmentContainer)}
    />
  )
}
