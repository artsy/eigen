import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteShowsQuery } from "__generated__/FavoriteShowsQuery.graphql"
import createEnvironment from "lib/relay/createEnvironment"
const environment = createEnvironment()

export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteShowsQuery>
      environment={environment}
      query={graphql`
        query FavoriteShowsQuery {
          me {
            ...Shows_me
          }
        }
      `}
      variables={{
        count: 10,
      }}
      render={render}
      cacheConfig={{ force: true }}
    />
  )
}
