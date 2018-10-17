import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteArtistsQuery } from "__generated__/FavoriteArtistsQuery.graphql"
import createEnvironment from "lib/relay/createEnvironment"
const environment = createEnvironment()

export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteArtistsQuery>
      environment={environment}
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
