import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"

export function SalesRenderer({ render }) {
  return (
    <QueryRenderer
      environment={defaultEnvironment}
      query={graphql`
        query SalesRendererQuery {
          viewer {
            ...Sales_viewer
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}
