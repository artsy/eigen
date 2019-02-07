import { Box, Serif } from "@artsy/palette"
import { ShowArtworksPreview_show } from "__generated__/ShowArtworksPreview_show.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  onViewAllArtworksPressed: () => void
  show: ShowArtworksPreview_show
  title: string
}

export class ShowArtworksPreview extends React.Component<Props> {
  render() {
    const { show, onViewAllArtworksPressed, title } = this.props
    if (!show) {
      return null
    }
    const { artworks, counts } = show
    return (
      <>
        {title && (
          <Serif size="6" mt={2} mb={3}>
            {title}
          </Serif>
        )}
        <GenericGrid artworks={this.props.show.artworks} />
        {counts &&
          counts.artworks > artworks.length && (
            <Box mt={1}>
              <CaretButton text={`View all ${artworks.length} works`} onPress={() => onViewAllArtworksPressed()} />
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
