import { Box, Separator, Spacer, Theme } from "@artsy/palette"
import { Collection_collection } from "__generated__/Collection_collection.graphql"
import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "lib/Scenes/Collection/Screens/CollectionHeader"
import { Schema, screenTrack } from "lib/utils/track"
import React, { Component } from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface CollectionProps {
  collection: Collection_collection
}

interface CollectionState {
  sections: Array<{ type: string; data: any }>
  isArtworkGridVisible: boolean
}

@screenTrack((props: CollectionProps) => ({
  context_screen: Schema.PageNames.Collection,
  context_screen_owner_slug: props.collection.slug,
  context_screen_owner_id: props.collection.id,
  context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
}))
export class Collection extends Component<CollectionProps, CollectionState> {
  state = {
    sections: [],
    isArtworkGridVisible: false,
  }
  viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 5,
  }
  componentDidMount() {
    const sections = []

    sections.push({
      type: "collectionFeaturedArtists",
      data: {
        artists: [],
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
      case "collectionFeaturedArtists":
        return (
          <Box>
            <CollectionFeaturedArtists collection={this.props.collection} />
            <Spacer mb={1} />
            <Separator />
          </Box>
        )
      case "collectionArtworks":
        return <CollectionArtworks collection={this.props.collection} />
      default:
        return null
    }
  }

  onViewableItemsChanged = ({ viewableItems }) => {
    ;(viewableItems || []).map(viewableItem => {
      const artworksRenderItem = viewableItem?.item?.type || ""
      const artworksRenderItemViewable = viewableItem?.isViewable || false
      if (artworksRenderItem === "collectionArtworks" && artworksRenderItemViewable) {
        return this.setState({ isArtworkGridVisible: true })
      }
      return this.setState({ isArtworkGridVisible: false })
    })
  }
  render() {
    const { isArtworkGridVisible, sections } = this.state

    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <FlatList
            onViewableItemsChanged={this.onViewableItemsChanged}
            viewabilityConfig={this.viewabilityConfig}
            keyExtractor={(_item, index) => String(index)}
            data={sections}
            ListHeaderComponent={<CollectionHeader collection={this.props.collection} />}
            renderItem={item => (
              <Box px={2} pb={2}>
                {this.renderItem(item)}
              </Box>
            )}
          />
          {isArtworkGridVisible ? <FilterArtworkButton title="Filter" /> : null}
        </View>
      </Theme>
    )
  }
}

const FilterArtworkButton = styled(DarkNavigationButton)`
  position: absolute;
  bottom: 100;
`

export const CollectionContainer = createFragmentContainer(Collection, {
  collection: graphql`
    fragment Collection_collection on MarketingCollection
      @argumentDefinitions(screenWidth: { type: "Int", defaultValue: 500 }) {
      id
      slug
      ...CollectionHeader_collection
      ...CollectionArtworks_collection
      ...FeaturedArtists_collection
    }
  `,
})
