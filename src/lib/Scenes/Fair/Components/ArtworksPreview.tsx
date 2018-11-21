import { Sans, Serif } from "@artsy/palette"
import { ArtworksPreview_fair } from "__generated__/ArtworksPreview_fair.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  onViewAllArtworksPressed: () => void
  fair: ArtworksPreview_fair
}

export class ArtworksPreview extends React.Component<Props> {
  render() {
    const { fair, onViewAllArtworksPressed } = this.props
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
        {counts &&
          counts.total > artworks.length && (
            <TouchableOpacity onPress={onViewAllArtworksPressed}>
              <Sans size="3" my={2} weight="medium">
                View all works
              </Sans>
            </TouchableOpacity>
          )}
      </>
    )
  }
}

export const ArtworksPreviewContainer = createFragmentContainer(
  ArtworksPreview,
  graphql`
    fragment ArtworksPreview_fair on Fair {
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
  `
)
