import { ShowArtworksPreview_show$data } from "__generated__/ShowArtworksPreview_show.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { extractNodes } from "app/utils/extractNodes"
import { Box, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface Props {
  onViewAllArtworksPressed: () => void
  show: ShowArtworksPreview_show$data
  title?: string
  relay: RelayProp
}

export class ShowArtworksPreview extends React.Component<Props> {
  render() {
    const { show, onViewAllArtworksPressed, title } = this.props
    if (!show) {
      return null
    }
    const { counts } = show
    const artworks = extractNodes(show.artworks)
    return (
      <>
        {!!title && (
          <Text variant="sm-display" mb={2}>
            {title}
          </Text>
        )}
        <GenericGrid artworks={artworks} />
        {counts! /*STRICTNESS_MIGRATION*/.artworks! /*STRICTNESS_MIGRATION*/ > artworks.length && (
          <Box mt={1}>
            <CaretButton
              text={`View all ${counts!.artworks} works`}
              onPress={() => onViewAllArtworksPressed()}
            />
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
