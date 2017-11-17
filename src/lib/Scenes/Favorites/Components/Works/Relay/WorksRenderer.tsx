import React from "react"
import { graphql, QueryRenderer, QueryRendererProps } from "react-relay"

import createEnvironment from "lib/relay/createEnvironment"
const environment = createEnvironment()

export default ({ render }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql.experimental`
        query WorksRendererQuery($count: Int!, $cursor: String) {
          me {
            ...Works_me @arguments(count: $count, cursor: $cursor)
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
