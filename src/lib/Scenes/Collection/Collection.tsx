import { CollectionQuery } from "__generated__/CollectionQuery.graphql"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Spacer } from "palette"
import React, { Component, createRef } from "react"
import { Animated, Dimensions, FlatList, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Collection_collection } from "../../../__generated__/Collection_collection.graphql"
import { CollectionArtworksFilterFragmentContainer as CollectionArtworksFilter } from "../../../lib/Scenes/Collection/Components/CollectionArtworksFilter"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "../../../lib/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "../../../lib/Scenes/Collection/Screens/CollectionHeader"
import { Schema, screenTrack } from "../../../lib/utils/track"
import { CollectionsHubRailsContainer as CollectionHubsRails } from "./Components/CollectionHubsRails/index"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface CollectionProps {
  collection: Collection_collection
}

@screenTrack((props: CollectionProps) => ({
  context_screen: Schema.PageNames.Collection,
  context_screen_owner_slug: props.collection.slug,
  context_screen_owner_id: props.collection.id,
  context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
}))
export class Collection extends Component<CollectionProps> {
  filterComponentAnimationValue = new Animated.Value(0)
  private flatList = createRef<FlatList<any>>()

  scrollToTop() {
    const {
      collection: { isDepartment },
    } = this.props

    this.flatList?.current?.scrollToIndex({ animated: false, index: isDepartment ? 1 : 0 })
  }

  render() {
    const { collection } = this.props
    const { linkedCollections, isDepartment } = collection

    const sections = [
      "collectionFeaturedArtists",
      "collectionHubsRails",
      "collectionArtworksFilter",
      "collectionArtworks",
    ]

    return (
      <ArtworkFiltersStoreProvider>
        <View style={{ flex: 1 }}>
          <Animated.FlatList
            ref={this.flatList}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.filterComponentAnimationValue } } }],
              {
                useNativeDriver: true,
              }
            )}
            keyExtractor={(_item, index) => String(index)}
            data={sections}
            ListHeaderComponent={<CollectionHeader collection={this.props.collection} />}
            ItemSeparatorComponent={() => <Spacer mb={2} />}
            stickyHeaderIndices={[3]}
            renderItem={({ item }): null | any => {
              switch (item) {
                case "collectionFeaturedArtists":
                  return (
                    <Box px={2}>
                      <CollectionFeaturedArtists collection={collection} />
                    </Box>
                  )
                case "collectionHubsRails":
                  return isDepartment ? (
                    <CollectionHubsRails linkedCollections={linkedCollections} {...this.props} />
                  ) : null
                case "collectionArtworksFilter":
                  return (
                    <CollectionArtworksFilter
                      collection={collection}
                      animationValue={this.filterComponentAnimationValue}
                    />
                  )
                case "collectionArtworks":
                  return (
                    <Box px={2}>
                      <CollectionArtworks
                        collection={collection}
                        scrollToTop={() => this.scrollToTop()}
                      />
                    </Box>
                  )
              }
            }}
          />
        </View>
      </ArtworkFiltersStoreProvider>
    )
  }
}

export const CollectionContainer = createFragmentContainer(Collection, {
  collection: graphql`
    fragment Collection_collection on MarketingCollection
    @argumentDefinitions(screenWidth: { type: "Int", defaultValue: 500 }) {
      id
      slug
      isDepartment
      ...CollectionHeader_collection
      ...CollectionArtworks_collection @arguments(input: { sort: "-decayed_merch" })
      ...CollectionArtworksFilter_collection
      ...FeaturedArtists_collection
      ...CollectionHubsRails_collection

      linkedCollections {
        ...CollectionHubsRails_linkedCollections
      }
    }
  `,
})

interface CollectionQueryRendererProps {
  collectionID: string
}

export const CollectionQueryRenderer: React.FC<CollectionQueryRendererProps> = ({
  collectionID,
}) => (
  <QueryRenderer<CollectionQuery>
    environment={defaultEnvironment}
    query={graphql`
      query CollectionQuery($collectionID: String!, $screenWidth: Int) {
        collection: marketingCollection(slug: $collectionID) {
          ...Collection_collection @arguments(screenWidth: $screenWidth)
        }
      }
    `}
    variables={{
      collectionID,
      screenWidth: Dimensions.get("screen").width,
    }}
    cacheConfig={{
      // Bypass Relay cache on retries.
      force: true,
    }}
    render={renderWithLoadProgress(CollectionContainer)}
  />
)
