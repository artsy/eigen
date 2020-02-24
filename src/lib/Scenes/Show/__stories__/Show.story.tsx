import { storiesOf } from "@storybook/react-native"
import React from "react"

import { ShowContainer as Show } from "../Show"

import { graphql, QueryRenderer } from "react-relay"
import createEnvironment from "../../../relay/createEnvironment"

import { ShowQuery } from "../../../../__generated__/ShowQuery.graphql"

const RootContainer: React.SFC<any> = ({ Component, showID }) => {
  return (
    <QueryRenderer<ShowQuery>
      environment={createEnvironment()}
      query={graphql`
        query ShowQuery($showID: String!) {
          show(id: $showID) {
            ...Show_show
          }
        }
      `}
      variables={{
        showID,
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

storiesOf("Shows")
  .add("Blk & Blue", () => {
    return <RootContainer Component={Show} showID="art-gallery-pure-art-of-design-at-art-gallery-pure" />
  })
  .add("William A. Hall: Symphony of Survival", () => {
    return <RootContainer Component={Show} showID="ross-plus-kramer-gallery-william-a-hall-symphony-of-survival" />
  })
  .add("Kate Moss Exlcusive by CHRISTOPH MARTIN SCHMID", () => {
    return <RootContainer Component={Show} showID="5-pieces-gallery-kate-moss-exlcusive-by-christoph-martin-schmid" />
  })
  .add("twentyfourseven - Wetterling Gallery 40 Years!", () => {
    return <RootContainer Component={Show} showID="wetterling-gallery-twentyfourseven-wetterling-gallery-40-years" />
  })
  .add("Anna Bjerger – Lit", () => {
    return <RootContainer Component={Show} showID="galleri-magnus-karlsson-anna-bjerger-lit" />
  })
  .add("Out of the Vault & New Acquisitions (Many Artists)", () => {
    return <RootContainer Component={Show} showID="david-barnett-gallery-out-of-the-vault-and-new-acquisitions" />
  })
  .add("Stubbed show: Erik Olson: Deep Field", () => {
    return <RootContainer Component={Show} showID="bravinlee-programs-erik-olson-deep-field" />
  })
