import { Box, Serif } from "@artsy/palette"
import { ShowArtworksPreview_show } from "__generated__/ShowArtworksPreview_show.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  onViewAllArtworksPressed: () => void
  show: ShowArtworksPreview_show
  title: string
  relay: RelayProp
}

export class ShowArtworksPreview extends React.Component<Props> {
  render() {
    const { show, onViewAllArtworksPressed, title } = this.props
    if (!show) {
      return null
    }
    const { counts } = show
    const artworks = show.artworks.edges.map(({ node }) => node)
    return (
      <>
        {!!title && (
          <Serif size="6" mt={2} mb={3}>
            {title}
          </Serif>
        )}
        <GenericGrid artworks={artworks} />
        {counts.artworks > artworks.length && (
          <Box mt={1}>
            <CaretButton text={`View all ${counts.artworks} works`} onPress={() => onViewAllArtworksPressed()} />
          </Box>
        )}
      </>
    )
  }
}

export const ShowArtworksPreviewContainer = createFragmentContainer(ShowArtworksPreview, {
  show: graphql`
    fragment ShowArtworksPreview_show on Show {
      id
      counts {
        artworks
      }
      artworks: artworksConnection(first: 6) {
        edges {
          node {
            ...GenericGrid_artworks
          }
        }
      }
    }
  `,
})
