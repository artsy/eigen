import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteFairsQuery } from "__generated__/FavoriteFairsQuery.graphql"
import createEnvironment from "lib/relay/createEnvironment"
const environment = createEnvironment()

export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteFairsQuery>
      environment={environment}
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
      cacheConfig={{ force: true }}
    />
  )
}
