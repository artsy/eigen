import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteFairsQuery } from "__generated__/FavoriteFairsQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"

export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteFairsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FavoriteFairsQuery {
          me {
            ...Fairs_me
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
