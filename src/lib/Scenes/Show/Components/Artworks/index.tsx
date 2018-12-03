import { Sans, Serif } from "@artsy/palette"
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
    return (
      <>
        <Serif size="6" my={1}>
          All works
        </Serif>
        <GenericGrid artworks={this.props.show.artworks} />
        <Sans size="3" my={2} weight="medium">
          View all works
        </Sans>
      </>
    )
  }
}

export const ArtworksContainer = createFragmentContainer(Artworks, {
  show: graphql`
    fragment Artworks_show on Show {
      __id
      artworks(size: 6) {
        ...GenericGrid_artworks
      }
    }
  `,
})
