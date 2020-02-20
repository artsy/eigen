import { storiesOf } from "@storybook/react-native"
import React from "react"

import Fair from "../"

import { FairQuery } from "__generated__/FairQuery.graphql"
import { graphql, QueryRenderer } from "react-relay"
import createEnvironment from "../../../relay/createEnvironment"

const RootContainer: React.SFC<any> = ({ Component, fairID }) => {
  return (
    <QueryRenderer<FairQuery>
      environment={createEnvironment()}
      query={graphql`
        query FairQuery($fairID: String!) {
          fair(id: $fairID) {
            ...Fair_fair
          }
        }
      `}
      variables={{
        fairID,
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

storiesOf("Fairs")
  .add("Ink Miami 2018", () => {
    return <RootContainer Component={Fair} fairID="ink-miami-2018" />
  })
  .add("West Bund 2018", () => {
    return <RootContainer Component={Fair} fairID="west-bund-art-and-design-2018" />
  })
  .add("Art Basel Miami 2018", () => {
    return <RootContainer Component={Fair} fairID="art-basel-in-miami-beach-2018" />
  })
  .add("Tefaf NY Fall 2019", () => {
    return <RootContainer Component={Fair} fairID="tefaf-new-york-fall-2019" />
  })

// art-basel-in-miami-beach-2018
