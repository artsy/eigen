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
          ...Auctions_auctions
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

export default AuctionsRenderer
