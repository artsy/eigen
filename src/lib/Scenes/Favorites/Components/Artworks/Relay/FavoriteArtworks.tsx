import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteArtworksQuery } from "__generated__/FavoriteArtworksQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"

// @TODO: Implement test for this component
export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteArtworksQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FavoriteArtworksQuery {
          me {
            ...Artworks_me
          }
        }
      `}
      variables={{
        count: 10,
      }}
      render={render}
    />
  )
}
