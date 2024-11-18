import { Flex, Separator, Skeleton, SkeletonText, Text } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { BodyCollectionsByCategory_marketingCollections$key } from "__generated__/BodyCollectionsByCategory_marketingCollections.graphql"
import {
  CollectionRailPlaceholder,
  CollectionRailWithSuspense,
} from "app/Scenes/CollectionsByCategory/CollectionRail"
import { CollectionsByCategoriesRouteProp } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import {
  CollectionsChips,
  CollectionsChipsPlaceholder,
} from "app/Scenes/CollectionsByCategory/CollectionsChips"
import { marketingCollectionsQuery } from "app/Scenes/HomeView/Components/HomeViewSectionCardsCard"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, usePreloadedQuery } from "react-relay"

interface BodyProps {
  marketingCollections: BodyCollectionsByCategory_marketingCollections$key
}

export const Body: React.FC<BodyProps> = ({ marketingCollections }) => {
  const data = useFragment(fragment, marketingCollections)
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const category = params.category

  if (!data) {
    return null
  }

  return (
    <Flex gap={4}>
      <Flex gap={2}>
        <Text variant="xl" px={2}>
          {category}
        </Text>
        <Text px={2}>Explore collections with {category}</Text>
        {/* TODO: fix typings broken by some unknown reason here, prob related to @plural */}
        <CollectionsChips marketingCollections={marketingCollections as any} />
      </Flex>

      <Separator borderColor="black10" />

      <FlashList
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        data={data}
        keyExtractor={(item) => `artwork_rail_${item?.slug}`}
        renderItem={({ item, index }) => {
          return (
            <CollectionRailWithSuspense
              slug={item?.slug ?? ""}
              lastElement={index === data.length - 1}
            />
          )
        }}
      />
    </Flex>
  )
}

const ESTIMATED_ITEM_SIZE = 390

const fragment = graphql`
  fragment BodyCollectionsByCategory_marketingCollections on MarketingCollection
  @relay(plural: true) {
    slug @required(action: NONE)
  }
`

const BodyPlaceholder: React.FC = () => {
  return (
    <Skeleton>
      <Flex gap={4}>
        <Flex gap={2} px={2}>
          <SkeletonText variant="xl">Category</SkeletonText>

          <SkeletonText>Category description text</SkeletonText>

          <CollectionsChipsPlaceholder />
        </Flex>

        <Separator borderColor="black10" />

        <CollectionRailPlaceholder />
      </Flex>
    </Skeleton>
  )
}

export const BodyWithSuspense = withSuspense({
  Component: () => {
    const { params } = useRoute<CollectionsByCategoriesRouteProp>()
    const data = usePreloadedQuery(marketingCollectionsQuery, params.queryRef)

    if (!data.viewer) {
      return <BodyPlaceholder />
    }

    return <Body marketingCollections={data.viewer.marketingCollections} />
  },
  LoadingFallback: BodyPlaceholder,
  ErrorFallback: NoFallback,
})
