import { Box, Flex, Spacer } from "@artsy/palette-mobile"
import { CollectionQuery } from "__generated__/CollectionQuery.graphql"
import { Collection_collection$data } from "__generated__/Collection_collection.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { CollectionArtworksFilterFragmentContainer as CollectionArtworksFilter } from "app/Scenes/Collection/Components/CollectionArtworksFilter"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "app/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "app/Scenes/Collection/Screens/CollectionHeader"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { useRef } from "react"
import { Animated, FlatList } from "react-native"
import { QueryRenderer, createFragmentContainer, graphql } from "react-relay"
import { CollectionsHubRailsContainer as CollectionHubsRails } from "./Components/CollectionHubsRails/index"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface CollectionProps {
  collection: Collection_collection$data
}

export const Collection: React.FC<CollectionProps> = (props) => {
  const { collection } = props
  const flatListRef = useRef<FlatList>(null)
  const { slug, id, linkedCollections, isDepartment } = collection
  const filterComponentAnimationValue = new Animated.Value(0)

  const trackingInfo: Schema.PageView = {
    context_screen: Schema.PageNames.Collection,
    context_screen_owner_slug: slug,
    context_screen_owner_id: id,
    context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
  }

  let sections = ["collectionHubsRails", "collectionArtworksFilter", "collectionArtworks"]

  // Show the Featured artists section only when showFeaturedArtists is true
  if (collection.showFeaturedArtists) {
    sections = ["collectionFeaturedArtists", ...sections]
  }

  // Small hack that takes into account the list header component when looking for the index
  const stickySectionIndex = ["ListHeaderComponent", ...sections].findIndex(
    (section) => section === "collectionArtworksFilter"
  )

  const scrollToTop = () => {
    flatListRef?.current?.scrollToIndex({ animated: false, index: isDepartment ? 1 : 0 })
  }

  return (
    <ProvideScreenTracking info={trackingInfo}>
      <ArtworkFiltersStoreProvider>
        <Flex flex={1}>
          <Animated.FlatList
            ref={flatListRef}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: filterComponentAnimationValue } } }],
              {
                useNativeDriver: true,
              }
            )}
            keyExtractor={(_item, index) => String(index)}
            data={sections}
            ListHeaderComponent={<CollectionHeader collection={collection} />}
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
                    <CollectionHubsRails linkedCollections={linkedCollections} {...props} />
                  ) : null
                case "collectionArtworksFilter":
                  return (
                    <CollectionArtworksFilter
                      collection={collection}
                      animationValue={filterComponentAnimationValue}
                    />
                  )
                case "collectionArtworks":
                  return (
                    <Box px={2}>
                      <CollectionArtworks
                        collection={collection}
                        scrollToTop={() => scrollToTop()}
                      />
                    </Box>
                  )
              }
            }}
          />
        </Flex>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
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
    environment={getRelayEnvironment()}
    query={graphql`
      query CollectionQuery($collectionID: String!) {
        collection: marketingCollection(slug: $collectionID) @principalField {
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
