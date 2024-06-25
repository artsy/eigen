import { Box, Flex, Screen, ShareIcon, Spacer } from "@artsy/palette-mobile"
import { CollectionQuery } from "__generated__/CollectionQuery.graphql"
import { Collection_collection$data } from "__generated__/Collection_collection.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { CollectionArtworksFilterFragmentContainer as CollectionArtworksFilter } from "app/Scenes/Collection/Components/CollectionArtworksFilter"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "app/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeaderContainer as CollectionHeader } from "app/Scenes/Collection/Screens/CollectionHeader"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { compact } from "lodash"
import { useRef } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import RNShare from "react-native-share"
import { QueryRenderer, createFragmentContainer, graphql } from "react-relay"
import { CollectionsHubRailsContainer as CollectionHubsRails } from "./Components/CollectionHubsRails/index"
import { CollectionFeaturedArtistsContainer as CollectionFeaturedArtists } from "./Components/FeaturedArtists"

interface CollectionProps {
  collection: Collection_collection$data
}

export const Collection: React.FC<CollectionProps> = (props) => {
  const { collection } = props
  const flatListRef = useRef<FlatList>(null)
  const { show: showToast } = useToast()

  const { slug, id, linkedCollections, isDepartment } = collection

  const trackingInfo: Schema.PageView = {
    context_screen: Schema.PageNames.Collection,
    context_screen_owner_slug: slug,
    context_screen_owner_id: id,
    context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
  }

  const handleSharePress = async () => {
    try {
      const url = getShareURL(`/collection/${collection.slug}?utm_content=collection-share`)
      const message = `View ${collection.title} on Artsy`

      await RNShare.open({
        title: collection.title,
        message: message + "\n" + url,
        failOnCancel: true,
      })
      showToast("Copied to Clipboard", "middle", { Icon: ShareIcon })
    } catch (error) {
      if (typeof error === "string" && error.includes("User did not share")) {
        console.error("Collection.tsx", error)
      }
    }
  }

  const data = compact([
    collection.showFeaturedArtists
      ? {
          key: "collectionFeaturedArtists",
          content: (
            <Box px={2}>
              <CollectionFeaturedArtists collection={collection} />
            </Box>
          ),
        }
      : null,
    isDepartment
      ? {
          key: "collectionHubsRails",
          content: <CollectionHubsRails linkedCollections={linkedCollections} {...props} />,
        }
      : null,
    {
      key: "collectionArtworksFilter",
      content: (
        <Flex mb={-2}>
          <CollectionArtworksFilter collection={collection} />
        </Flex>
      ),
    },
    {
      key: "collectionArtworks",
      content: (
        <Box px={2}>
          <CollectionArtworks collection={collection} scrollToTop={() => scrollToTop()} />
        </Box>
      ),
    },
  ])

  // Small hack that takes into account the list header component when looking for the index
  const stickySectionIndex =
    data.findIndex((section) => section.key === "collectionArtworksFilter") + 1

  const scrollToTop = () => {
    flatListRef?.current?.scrollToIndex({ animated: false, index: isDepartment ? 1 : 0 })
  }

  return (
    <ProvideScreenTracking info={trackingInfo}>
      <Screen>
        <Screen.AnimatedHeader
          title="African Artists"
          onBack={goBack}
          rightElements={
            <TouchableOpacity
              onPress={() => {
                handleSharePress()
              }}
            >
              <ShareIcon width={24} height={24} />
            </TouchableOpacity>
          }
        />
        <ArtworkFiltersStoreProvider>
          <Flex flex={1}>
            <Screen.FlatList
              keyExtractor={(_item, index) => String(index)}
              data={data}
              ListHeaderComponent={<CollectionHeader collection={collection} />}
              ItemSeparatorComponent={() => <Spacer y={2} />}
              stickyHeaderIndices={[stickySectionIndex]}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                return item.content
              }}
            />
          </Flex>
        </ArtworkFiltersStoreProvider>
      </Screen>
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
      title
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
