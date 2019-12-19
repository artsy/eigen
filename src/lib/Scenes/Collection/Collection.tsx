import { Box, Sans, Theme } from "@artsy/palette"
import { Collection_collection } from "__generated__/Collection_collection.graphql"
import { CollectionArtworkPreviewContainer as CollectionArtworkPreview } from "lib/Scenes/Collection/Screens/CollectionArtworkPreview"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "lib/Scenes/Collection/Screens/CollectionHeader"
import React, { Component } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface CollectionProps {
  collection: Collection_collection
}

interface CollectionState {
  sections: Array<{ type: string; data: any }>
}

export class Collection extends Component<CollectionProps, CollectionState> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const sections = []

    sections.push({
      type: "featuredArtists",
      data: {
        artists: [],
      },
    })

    sections.push({
      type: "artworkPreview",
      data: {
        artworks: [],
      },
    })

    sections.push({
      type: "collectionArtworks",
      data: {
        artworks: [],
      },
    })

    this.setState({
      sections,
    })
  }

  renderItem = ({ item: { type } }) => {
    switch (type) {
      case "featuredArtists":
        return (
          <Box>
            <Sans size="3t">Featured Artists</Sans>
          </Box>
        )
      case "artworkPreview":
        return <CollectionArtworkPreview collection={this.props.collection} />
      case "collectionArtworks":
        return <CollectionArtworks collection={this.props.collection} />
      default:
        return null
    }
  }

  render() {
    const { sections } = this.state

    return (
      <Theme>
        <Box>
          <FlatList
            keyExtractor={(_item, index) => String(index)}
            data={sections}
            ListHeaderComponent={<CollectionHeader collection={this.props.collection} />}
            renderItem={item => (
              <Box px={2} pb={2}>
                {this.renderItem(item)}
              </Box>
            )}
          />
        </Box>
      </Theme>
    )
  }
}

export const CollectionContainer = createFragmentContainer(Collection, {
  collection: graphql`
    fragment Collection_collection on MarketingCollection {
      ...CollectionHeader_collection
      ...CollectionArtworkPreview_collection
      ...CollectionArtworks_collection
    }
  `,
})
