import * as React from "react"
import { graphql, QueryRenderer, QueryRendererProps } from "react-relay"

import createEnvironment from "../../../../../relay/createEnvironment"
const environment = createEnvironment()

const AuctionsRenderer: React.SFC<any> = ({ render }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query AuctionsRendererQuery {
          auctions: sales(live: true, is_auction: true) {
            ...Auctions_auctions
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

export default AuctionsRenderer
