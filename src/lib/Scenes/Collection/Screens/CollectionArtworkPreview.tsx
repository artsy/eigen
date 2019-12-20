import { Separator } from "@artsy/palette"
import { CollectionArtworkPreview_collection } from "__generated__/CollectionArtworkPreview_collection.graphql"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { get } from "lib/utils/get"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  collection: CollectionArtworkPreview_collection
}

export class CollectionArtworkPreview extends React.Component<Props> {
  render() {
    const { collection } = this.props
    if (!collection) {
      return null
    }
    const collectionArtworks = get(collection, collectionWorks => collectionWorks.artworks.edges, [])
    const artworks = collectionArtworks.map(({ node }) => node)

    return (
      <>
        <Separator mb={4} />
        <GenericGrid artworks={artworks} />
      </>
    )
  }
}

export const CollectionArtworkPreviewContainer = createFragmentContainer(CollectionArtworkPreview, {
  collection: graphql`
    fragment CollectionArtworkPreview_collection on MarketingCollection {
      artworks: artworksConnection(sort: "-merchandisability", first: 6) {
        edges {
          node {
            ...GenericGrid_artworks
          }
        }
      }
    }
  `,
})
