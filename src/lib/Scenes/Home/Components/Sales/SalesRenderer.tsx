import React from "react"
import createEnvironment from "lib/relay/createEnvironment"
import { graphql, QueryRenderer, QueryRendererProps } from "react-relay"

const environment = createEnvironment()

const SalesRenderer: React.SFC<any> = ({ render }) => {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
        query SalesRendererQuery {
          sales: sales(live: true, is_auction: true) {
            ...Sales_sales
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

export default SalesRenderer
