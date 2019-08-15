import { Box, Sans } from "@artsy/palette"
import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface CollectionProps {
  collection: any
}

export class Collection extends Component<CollectionProps> {
  render() {
    const { title } = this.props.collection
    return (
      <Box>
        <Sans size="3t">{title}</Sans>
      </Box>
    )
  }
}

export const CollectionContainer = createFragmentContainer(Collection, {
  collection: graphql`
    fragment Collection_collection on MarketingCollection {
      slug
      title
      description
      headerImage
      category
      credit
    }
  `,
})
