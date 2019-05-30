import { ArtistArtworkGrid_artwork } from "__generated__/ArtistArtworkGrid_artwork.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Header } from "../../Header"

interface ArtistArtworkGridProps {
  artwork: ArtistArtworkGrid_artwork
}

export class ArtistArtworkGrid extends React.Component<ArtistArtworkGridProps> {
  render() {
    const {
      artwork: { artist },
    } = this.props

    if (!artist) {
      return null
    }
    const artworks = artist.artworks_connection.edges.map(({ node }) => node)

    return (
      <>
        <Header title={`Other works by ${artist.name}`} />
        <GenericGrid artworks={artworks} />
      </>
    )
  }
}

export const ArtistArtworkGridFragmentContainer = createFragmentContainer(ArtistArtworkGrid, {
  artwork: graphql`
    fragment ArtistArtworkGrid_artwork on Artwork {
      id
      artist {
        name
        artworks_connection(first: 8, sort: PUBLISHED_AT_DESC, exclude: $excludeArtworkIds)
          @connection(key: "GenericGrid_artworks_connection") {
          pageInfo {
            startCursor
            endCursor
            hasPreviousPage
            hasNextPage
          }
          edges {
            node {
              ...GenericGrid_artworks
            }
          }
        }
      }
    }
  `,
})
