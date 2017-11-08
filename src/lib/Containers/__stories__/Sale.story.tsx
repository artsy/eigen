import { storiesOf } from "@storybook/react-native"
import * as React from "react"

import Sale from "../Sale"

// TODO: Move to metametaphysics after Relay Modern migration
import { graphql, QueryRenderer } from "react-relay"
import createEnvironment from "../../relay/createEnvironment"
const RootContainer: React.SFC<any> = ({ Component, saleID }) => {
  return (
    <QueryRenderer
      environment={createEnvironment()}
      query={graphql`
        query SaleQuery($saleID: String!) {
          sale(id: $saleID) {
            ...Sale_sale
          }
        }
      `}
      variables={{
        saleID,
      }}
      render={({ error, props }) => {
        if (error) {
          console.error(error)
        } else if (props) {
          return <Component {...props} />
        }
        return null
      }}
    />
  )
}

storiesOf("Sale/Relay").add("Rago", () => {
  return <RootContainer Component={Sale} saleID="rago-auctions-curiouser-and-curiouser" />
})
