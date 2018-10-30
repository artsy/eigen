import { Artworks_show } from "__generated__/Artworks_show.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  show: Artworks_show
}

export class Artworks extends React.Component<Props> {
  render() {
    if (!this.props.show) {
      return null
    }
    return <GenericGrid artworks={this.props.show.artworks} />
  }
}

export const ArtworksContainer = createFragmentContainer(Artworks, {
  show: graphql`
    fragment Artworks_show on Show {
      __id
      artworks {
        ...GenericGrid_artworks
      }
    }
  `,
})
