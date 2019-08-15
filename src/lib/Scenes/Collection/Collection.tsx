import { Sans, Theme } from "@artsy/palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

export class Collection extends React.Component<any> {
  render() {
    return (
      <Theme>
        <Sans size="3t">Hello world</Sans>
      </Theme>
    )
  }
}

export const CollectionContainer = createFragmentContainer(Collection, {
  collection: graphql`
    fragment Collection_collection on MarketingCollection {
      slug
      title
    }
  `,
})
