import { SalesRendererQuery } from "__generated__/SalesRendererQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"

export function SalesRenderer({ render }) {
  return (
    <QueryRenderer<SalesRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SalesRendererQuery {
          ...Sales_query
        }
      `}
      variables={{}}
      render={render}
    />
  )
}
