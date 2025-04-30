import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, SkeletonBox, Spinner } from "@artsy/palette-mobile"
import { CollectCollectionsRailQuery } from "__generated__/CollectCollectionsRailQuery.graphql"
import {
  CollectCollectionsRail_marketingCollections$data,
  CollectCollectionsRail_marketingCollections$key,
} from "__generated__/CollectCollectionsRail_marketingCollections.graphql"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { LoadFailureView } from "app/Components/LoadFailureView"
import {
  CollectCollectionsRailItem,
  COLLECTION_CONTAINER_WIDTH,
  COLLECTION_CONTAINER_HEIGHT,
} from "app/Scenes/Collect/Components/CollectCollectionsRailItem"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { ScrollView } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface CollectCollectionsRailProps {
  marketingCollections: CollectCollectionsRail_marketingCollections$key
}

export const CollectCollectionsRail: React.FC<CollectCollectionsRailProps> = (props) => {
  const marketingCollections = useFragment(collectionsFragment, props.marketingCollections)
  const { trackEvent } = useTracking()

  const handlePress = (
    marketingCollection: CollectCollectionsRail_marketingCollections$data[0]
  ) => {
    trackEvent(
      tracks.tappedMarketingCollectionGroup(
        marketingCollection.internalID,
        marketingCollection.slug,
        ContextModule.collectionRail
      )
    )
  }

  return (
    <CardRailFlatList
      data={marketingCollections}
      initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
      windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
      renderItem={({ item }) => {
        return (
          <CollectCollectionsRailItem
            key={item.internalID}
            marketingCollection={item}
            onPress={(collection) => {
              handlePress(
                collection as unknown as CollectCollectionsRail_marketingCollections$data[0]
              )
            }}
          />
        )
      }}
    />
  )
}

const collectionsFragment = graphql`
  fragment CollectCollectionsRail_marketingCollections on MarketingCollection @relay(plural: true) {
    internalID
    slug
    ...CollectCollectionsRailItem_marketingCollection
  }
`

const collectCollectionsRailQuery = graphql`
  query CollectCollectionsRailQuery {
    marketingCollections(
      slugs: [
        "contemporary"
        "painting"
        "street-art"
        "photography"
        "emerging-art"
        "20th-century-art"
      ]
    ) {
      ...CollectCollectionsRail_marketingCollections
    }
  }
`
export const CollectCollectionsRailQueryRenderer: React.FC = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<CollectCollectionsRailQuery>(collectCollectionsRailQuery, {})
    return <CollectCollectionsRail marketingCollections={data.marketingCollections} />
  },
  LoadingFallback: () => {
    return (
      <Flex height={COLLECTION_CONTAINER_HEIGHT + 20}>
        <CardRailFlatList
          data={times(5)}
          renderItem={({ index }) => {
            return (
              <SkeletonBox
                key={index}
                width={COLLECTION_CONTAINER_WIDTH}
                height={COLLECTION_CONTAINER_HEIGHT}
              />
            )
          }}
        />
      </Flex>
    )
  },
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        showBackButton={false}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})

const tracks = {
  tappedMarketingCollectionGroup: (
    marketingCollectionId: string,
    marketingCollectionSlug: string,
    contextModule: ContextModule
  ) => ({
    action: ActionType.tappedCollectionGroup,
    context_module: contextModule,
    marketing_collection_id: marketingCollectionId,
    marketing_collection_slug: marketingCollectionSlug,
    context_owner_type: OwnerType.collect,
  }),
}
