import { RelatedArtworkGrid_artwork } from "__generated__/RelatedArtworkGrid_artwork.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import _ from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Header } from "../../Header"

interface RelatedArtworkGridProps {
  artwork: RelatedArtworkGrid_artwork
}

export class RelatedArtworkGrid extends React.Component<RelatedArtworkGridProps> {
  render() {
    const {
      artwork: { layer },
    } = this.props

    if (!layer) {
      return null
    }

    const artworks = layer.artworksConnection.edges.map(({ node }) => node)
    if (_.isEmpty(artworks)) {
      return null
    }

    return (
      <>
        <Header title="Related Works" />
        <GenericGrid artworks={artworks} />
      </>
    )
  }
}

export const RelatedArtworkGridFragmentContainer = createFragmentContainer(RelatedArtworkGrid, {
  artwork: graphql`
    fragment RelatedArtworkGrid_artwork on Artwork {
      layer(id: "main") {
        artworksConnection(first: 8) {
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
