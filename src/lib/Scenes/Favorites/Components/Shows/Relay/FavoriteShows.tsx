import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteShowsQuery } from "__generated__/FavoriteShowsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"

export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteShowsQuery>
      environment={defaultEnvironment}
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
    />
  )
}
