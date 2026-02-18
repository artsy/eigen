import { ShareIcon } from "@artsy/icons/native"
import {
  Box,
  Flex,
  Screen,
  Separator,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Tabs,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { CollectionQuery } from "__generated__/CollectionQuery.graphql"
import { Collection_collection$key } from "__generated__/Collection_collection.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { getShareURL } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { CollectionOverview } from "app/Scenes/Collection/CollectionOverview"
import { CollectionArtworksFragmentContainer as CollectionArtworks } from "app/Scenes/Collection/Screens/CollectionArtworks"
import { CollectionHeader } from "app/Scenes/Collection/Screens/CollectionHeader"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { PlaceholderGrid } from "app/utils/placeholderGrid"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { isEmpty } from "lodash"
import { Suspense, useCallback } from "react"
import { TouchableOpacity } from "react-native"
import RNShare from "react-native-share"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface CollectionScreenProps {
  collectionID: string
}

interface CollectionProps {
  collection: Collection_collection$key
}

export const CollectionContent: React.FC<CollectionProps> = ({ collection }) => {
  const data = useFragment(fragment, collection)
  const { show: showToast } = useToast()

  const renderBelowTheHeaderComponent = useCallback(
    () => <CollectionHeader collection={data} />,
    [data]
  )

  if (!data) {
    return null
  }

  const { slug, id, title, linkedCollections, showFeaturedArtists } = data

  const shouldRenderOverviewTab = !!showFeaturedArtists || !isEmpty(linkedCollections)

  const trackingInfo: Schema.PageView = {
    context_screen: Schema.PageNames.Collection,
    context_screen_owner_slug: slug,
    context_screen_owner_id: id,
    context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
  }

  const handleSharePress = async () => {
    try {
      const url = getShareURL(`/collection/${slug}?utm_content=collection-share`)
      const message = `View ${title} on Artsy`

      await RNShare.open({
        title: title,
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

  return (
    <ProvideScreenTracking info={trackingInfo}>
      <ArtworkFiltersStoreProvider>
        <Tabs.TabsWithHeader
          initialTabName="Artworks"
          title={`${title}`}
          showLargeHeaderText={false}
          BelowTitleHeaderComponent={renderBelowTheHeaderComponent}
          headerProps={{
            onBack: goBack,
            rightElements: (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Share Collection"
                onPress={() => {
                  handleSharePress()
                }}
              >
                <ShareIcon width={24} height={24} />
              </TouchableOpacity>
            ),
          }}
        >
          <Tabs.Tab name="Artworks" label="Artworks">
            <Tabs.Lazy>
              <CollectionArtworks collection={data} />
            </Tabs.Lazy>
          </Tabs.Tab>
          {!!shouldRenderOverviewTab ? (
            <Tabs.Tab name="Overview" label="Overview">
              <Tabs.Lazy>
                <CollectionOverview collection={data} />
              </Tabs.Lazy>
            </Tabs.Tab>
          ) : null}
        </Tabs.TabsWithHeader>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
}

const CollectionQueryRenderer: React.FC<CollectionScreenProps> = ({ collectionID }) => {
  const data = useLazyLoadQuery<CollectionQuery>(
    CollectionScreenQuery,
    { collectionID },
    {
      fetchPolicy: "store-and-network",
    }
  )

  if (!data?.collection) {
    return null
  }

  return <CollectionContent collection={data?.collection} />
}

export const CollectionScreen: React.FC<CollectionScreenProps> = ({ collectionID }) => {
  return (
    <Suspense fallback={<CollectionPlaceholder />}>
      <CollectionQueryRenderer collectionID={collectionID} />
    </Suspense>
  )
}

const CollectionPlaceholder: React.FC = () => {
  const { width } = useScreenDimensions()
  const shouldHideHeaderImage = useFeatureFlag("AREnableCollectionsWithoutHeaderImage")

  return (
    <Screen>
      <Screen.Header onBack={goBack} rightElements={<ShareIcon width={23} height={23} />} />
      <Screen.Body fullwidth>
        <Skeleton>
          {!shouldHideHeaderImage && <SkeletonBox width={width} height={250} />}
          <Spacer y={2} />
          <Flex px={2}>
            <SkeletonText variant="lg">Collection Name</SkeletonText>
          </Flex>
          <Spacer y={2} />

          <Box px={2}>
            <SkeletonBox width={width - 40} height={100} />
          </Box>

          <Spacer y={4} />

          {/* Tabs */}
          <Flex justifyContent="space-around" flexDirection="row" px={2}>
            <SkeletonText variant="xs">Artworks</SkeletonText>
            <SkeletonText variant="xs">Overview</SkeletonText>
          </Flex>
        </Skeleton>

        <Separator mt={1} mb={4} />

        <PlaceholderGrid />
      </Screen.Body>
    </Screen>
  )
}

export const CollectionScreenQuery = graphql`
  query CollectionQuery($collectionID: String!) {
    collection: marketingCollection(slug: $collectionID) @principalField {
      ...Collection_collection
    }
  }
`

export const fragment = graphql`
  fragment Collection_collection on MarketingCollection {
    ...CollectionOverview_collection
    id
    slug
    title
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
`
