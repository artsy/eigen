import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteArtistsQuery } from "__generated__/FavoriteArtistsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"

// @TODO: Implement test for this component
export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteArtistsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FavoriteArtistsQuery {
          me {
            ...Artists_me
          }
        }
      `}
      variables={{ count: 10 }}
      render={render}
    />
  )
}
