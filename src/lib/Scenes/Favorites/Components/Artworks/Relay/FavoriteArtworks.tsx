import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteArtworksQuery } from "__generated__/FavoriteArtworksQuery.graphql"
import createEnvironment from "lib/relay/createEnvironment"
const environment = createEnvironment()

export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteArtworksQuery>
      environment={environment}
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
