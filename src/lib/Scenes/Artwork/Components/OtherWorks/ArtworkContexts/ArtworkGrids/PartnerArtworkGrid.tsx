import { PartnerArtworkGrid_artwork } from "__generated__/PartnerArtworkGrid_artwork.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import _ from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Header } from "../../Header"

interface PartnerArtworkGridProps {
  artwork: PartnerArtworkGrid_artwork
}

export class PartnerArtworkGrid extends React.Component<PartnerArtworkGridProps> {
  render() {
    const {
      artwork: { partner },
    } = this.props

    if (!partner) {
      return null
    }

    const artworks = partner.artworksConnection.edges.map(({ node }) => node)
    if (_.isEmpty(artworks)) {
      return null
    }

    return (
      <>
        <Header title={`Other works from ${partner.name}`} />
        <GenericGrid artworks={artworks} />
      </>
    )
  }
}

export const PartnerArtworkGridFragmentContainer = createFragmentContainer(PartnerArtworkGrid, {
  artwork: graphql`
    fragment PartnerArtworkGrid_artwork on Artwork {
      partner {
        name
        artworksConnection(first: 6, for_sale: true, sort: PUBLISHED_AT_DESC, exclude: $excludeArtworkIds) {
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
