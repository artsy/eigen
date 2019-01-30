import { Box } from "@artsy/palette"
import { ShowArtworksPreview_show } from "__generated__/ShowArtworksPreview_show.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { CaretButton } from "../../../lib/Components/Buttons/CaretButton"

interface Props {
  onViewAllArtworksPressed: () => void
  show: ShowArtworksPreview_show
}

export class ShowArtworksPreview extends React.Component<Props> {
  render() {
    const { show, onViewAllArtworksPressed } = this.props
    if (!show) {
      return null
    }
    const { artworks, counts } = show
    return (
      <>
        <GenericGrid artworks={this.props.show.artworks} />
        {counts &&
          counts.artworks > artworks.length && (
            <Box mt={1}>
              <CaretButton text={`View all ${artworks.length} artists`} onPress={() => onViewAllArtworksPressed()} />
            </Box>
          )}
      </>
    )
  }
}

export const ShowArtworksPreviewContainer = createFragmentContainer(ShowArtworksPreview, {
  show: graphql`
    fragment ShowArtworksPreview_show on Show {
      __id
      artworks(size: 6) {
        ...GenericGrid_artworks
      }
      counts {
        artworks
      }
    }
  `,
})
