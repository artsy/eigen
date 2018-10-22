import { storiesOf } from "@storybook/react-native"
import { ActiveBidsQuery } from "__generated__/ActiveBidsQuery.graphql"
import createEnvironment from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import ActiveBids from "../index"

function ActiveBidsRenderer({ render }) {
  return (
    <QueryRenderer<ActiveBidsQuery>
      environment={createEnvironment()}
      query={graphql`
        query ActiveBidsQuery {
          me {
            ...ActiveBids_me
          }
        }
      `}
      variables={{}}
      render={render}
    />
  )
}

storiesOf("Inbox/Active Bids").add("List", () => <ActiveBidsRenderer render={renderWithLoadProgress(ActiveBids)} />)
