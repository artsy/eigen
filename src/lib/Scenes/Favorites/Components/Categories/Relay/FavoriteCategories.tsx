import React from "react"
import { graphql, QueryRenderer } from "react-relay"

import { FavoriteCategoriesQuery } from "__generated__/FavoriteCategoriesQuery.graphql"
import createEnvironment from "lib/relay/createEnvironment"
const environment = createEnvironment()

export default ({ render }) => {
  return (
    <QueryRenderer<FavoriteCategoriesQuery>
      environment={environment}
      query={graphql`
        query FavoriteCategoriesQuery {
          me {
            ...Categories_me
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
