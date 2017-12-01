import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { PAGE_SIZE } from "../Components/LotsByFollowedArtists"

export function SalesRenderer({ render }) {
  return (
    <QueryRenderer
      environment={defaultEnvironment}
      query={graphql.experimental`
        query SalesRendererQuery {
          sales: sales(live: true, is_auction: true) {
            ...Sales_sales
          }
          viewer {
            ...Sales_viewer
          }
        }
      `}
      variables={{
        count: PAGE_SIZE,
      }}
      render={render}
    />
  )
}
