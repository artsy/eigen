import { Theme } from "@artsy/palette"
import { CollectionArtworks_collection } from "__generated__/CollectionArtworks_collection.graphql"
import { CollectionArtworksQuery } from "__generated__/CollectionArtworksQuery.graphql"
import { FilteredInfiniteScrollGrid } from "lib/Components/FilteredInfiniteScrollGrid"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props {
  collection: CollectionArtworks_collection
}

export class CollectionArtworks extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <FilteredInfiniteScrollGrid entity={this.props.collection} />
      </Theme>
    )
  }
}

export const CollectionArtworksContainer = createFragmentContainer(CollectionArtworks, {
  collection: graphql`
    fragment CollectionArtworks_collection on MarketingCollection {
      id
      slug
      internalID
      artworks: artworksConnection(sort: $sort, first: $count, after: $cursor) @connection(key: "Collection_artworks") {
        edges {
          node {
            id
          }
        }
        ...InfiniteScrollArtworksGrid_connection
        # ...FilteredInfiniteScrollGrid_entity
      }
    }
  `,
})

export const CollectionArtworksRenderer: React.SFC<{ collectionID: string }> = ({ collectionID }) => {
  return (
    <QueryRenderer<CollectionArtworksQuery>
      environment={defaultEnvironment}
      query={graphql`
        query CollectionArtworksQuery($collectionID: String!) {
          marketingCollection(slug: $collectionID) {
            ...CollectionArtworks_collection
          }
        }
      `}
      variables={{ collectionID }}
      render={renderWithLoadProgress(CollectionArtworksContainer)}
    />
  )
}
