import { Box, color, FilterIcon, Flex, Sans, Separator, Spacer, Theme } from "@artsy/palette"
import { Collection_collection } from "__generated__/Collection_collection.graphql"
import { FilterModal } from "lib/Components/FilterModal"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "lib/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "lib/Scenes/Collection/Screens/CollectionHeader"
import { Schema, screenTrack } from "lib/utils/track"
import React, { Component } from "react"
import { FlatList, NativeModules, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface CollectionProps {
  collection: Collection_collection
}

interface CollectionState {
  sections: Array<{ type: string; data: any }>
  isArtworkGridVisible: boolean
  isFilterArtworksModalVisible: boolean
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
    isFilterArtworksModalVisible: false,
  }
  viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 75, // What percentage of the artworks component should be in the screen before toggling the filter button
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
        return (
          <>
            <CollectionArtworks collection={this.props.collection} />
            <FilterModal
              visible={this.state.isFilterArtworksModalVisible}
              closeModal={this.handleFilterArtworksModal.bind(this)}
            />
          </>
        )
      default:
        return null
    }
  }
  onViewableItemsChanged = ({ viewableItems }) => {
    ;(viewableItems || []).map(viewableItem => {
      const artworksRenderItem = viewableItem?.item?.type || ""
      const artworksRenderItemViewable = viewableItem?.isViewable || false

      if (artworksRenderItem === "collectionArtworks" && artworksRenderItemViewable) {
        return this.setState(_prevState => ({ isArtworkGridVisible: true }))
      }

      return this.setState(_prevState => ({ isArtworkGridVisible: false }))
    })
  }
  handleFilterArtworksModal() {
    this.setState({ isFilterArtworksModalVisible: !this.state.isFilterArtworksModalVisible })

    return
    // tslint:disable: jsdoc-format
    /**
    * TODO: Refactor this mutation code to handle filtering artworks by selected fields in the artwork filter modal
    * const { artwork, relay } = this.props
    commitMutation<ArtworkActionsSaveMutation>(relay.environment, {
      mutation: graphql`
        mutation ArtworkActionsSaveMutation($input: SaveArtworkInput!) {
          saveArtwork(input: $input) {
            artwork {
              id
              is_saved: isSaved
            }
          }
        }
      `,
      variables: { input: { artworkID: artwork.internalID, remove: artwork.is_saved } },
      optimisticResponse: { saveArtwork: { artwork: { id: artwork.id, is_saved: !artwork.is_saved } } },
      onCompleted: () => Events.userHadMeaningfulInteraction(),
    })
     */
  }
  render() {
    const { isArtworkGridVisible, sections } = this.state
    const isArtworkFilterEnabled = NativeModules.Emission?.options?.AROptionsFilterCollectionsArtworks

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
          {isArtworkGridVisible && isArtworkFilterEnabled && (
            <FilterArtworkButtonContainer>
              <FilterArtworkButton
                px="2"
                onPress={this.handleFilterArtworksModal.bind(this)}>
                <FilterIcon fill="white100" />
                <Sans size="3t" pl="1" py="1" color="white100" weight="medium">Filter</Sans>
              </FilterArtworkButton>
            </FilterArtworkButtonContainer>
          )}
        </View>
      </Theme>
    )
  }
}

export const FilterArtworkButtonContainer = styled(Flex)`
  position: absolute;
  bottom: 20;
  flex: 1;
  justify-content: center;
  width: 100%;
  flex-direction: row;
`

export const FilterArtworkButton = styled(Flex)`
  width: 110px;
  border-radius: 20;
  background-color: ${color("black100")};
  align-items: center;
  justify-content: center;
  flex-direction: row;
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
