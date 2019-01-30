import { Sans } from "@artsy/palette"
import { ShowArtworksPreview_show } from "__generated__/ShowArtworksPreview_show.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

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
            <TouchableOpacity onPress={onViewAllArtworksPressed}>
              <Sans size="3" weight="medium" mt={2}>
                {`View all ${artworks.length} works`}
              </Sans>
            </TouchableOpacity>
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
