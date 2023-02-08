import { Spacer } from "@artsy/palette-mobile"
import { CollectionQuery } from "__generated__/CollectionQuery.graphql"
import { Collection_collection$data } from "__generated__/Collection_collection.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { CollectionArtworksFilterFragmentContainer as CollectionArtworksFilter } from "app/Scenes/Collection/Components/CollectionArtworksFilter"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "app/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "app/Scenes/Collection/Screens/CollectionHeader"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "app/utils/track"
import { Box } from "palette"
import React, { Component, createRef } from "react"
import { Animated, FlatList, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { CollectionsHubRailsContainer as CollectionHubsRails } from "./Components/CollectionHubsRails/index"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface CollectionProps {
  collection: Collection_collection$data
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

    let sections = ["collectionHubsRails", "collectionArtworksFilter", "collectionArtworks"]

    // Show the Featured artists section only when showFeaturedArtists is true
    if (collection.showFeaturedArtists) {
      sections = ["collectionFeaturedArtists", ...sections]
    }

    // Small hack that takes into account the list header component when looking for the index
    const stickySectionIndex = ["ListHeaderComponent", ...sections].findIndex(
      (section) => section === "collectionArtworksFilter"
    )

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
            ItemSeparatorComponent={() => <Spacer y={2} />}
            stickyHeaderIndices={[stickySectionIndex]}
            keyboardShouldPersistTaps="handled"
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
    fragment Collection_collection on MarketingCollection {
      id
      slug
      isDepartment
      showFeaturedArtists
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
      query CollectionQuery($collectionID: String!) {
        collection: marketingCollection(slug: $collectionID) {
          ...Collection_collection
        }
      }
    `}
    variables={{
      collectionID,
    }}
    cacheConfig={{
      // Bypass Relay cache on retries.
      force: true,
    }}
    render={renderWithLoadProgress(CollectionContainer)}
  />
)
