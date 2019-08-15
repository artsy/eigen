import { Box, Sans } from "@artsy/palette"
import { Schema, track } from "lib/utils/track"
import React, { Component } from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface CollectionProps {
  collection: any
}

@track<any>(props => ({
  context_module: Schema.ContextModules.AboutTheArtist,
  context_page_owner_slug: props.collection.slug,
  context_page_owner_id: props.collection.id,
}))
export class Collection extends Component<CollectionProps> {
  render() {
    return (
      <Box>
        <Sans size="3t">Hello world</Sans>
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
