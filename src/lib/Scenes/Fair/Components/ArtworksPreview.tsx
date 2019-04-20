import { Sans, Serif } from "@artsy/palette"
import { ArtworksPreview_fair } from "__generated__/ArtworksPreview_fair.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  fair: ArtworksPreview_fair
}

export class ArtworksPreview extends React.Component<Props> {
  viewAllArtworksPressed() {
    SwitchBoard.presentNavigationViewController(this, `/fair/${this.props.fair.gravityID}/artworks`)
  }

  render() {
    const { fair } = this.props
    if (!fair) {
      return null
    }
    const artworks = fair.filteredArtworks.artworks_connection.edges.map(({ node }) => node)
    const counts = fair.filteredArtworks.counts
    return (
      <>
        <Serif size="6" mt={2} mb={3}>
          All works
        </Serif>
        <GenericGrid artworks={artworks} />
        {!!counts &&
          counts.total > artworks.length && (
            <TouchableOpacity onPress={this.viewAllArtworksPressed.bind(this)}>
              <Sans size="3" my={2} weight="medium">
                View all works
              </Sans>
            </TouchableOpacity>
          )}
      </>
    )
  }
}

export const ArtworksPreviewContainer = createFragmentContainer(ArtworksPreview, {
  fair: graphql`
    fragment ArtworksPreview_fair on Fair {
      gravityID
      __id
      filteredArtworks(size: 0, aggregations: [TOTAL]) {
        artworks_connection(first: 6) {
          edges {
            node {
              ...GenericGrid_artworks
            }
          }
        }
        counts {
          total
        }
      }
    }
  `,
})
