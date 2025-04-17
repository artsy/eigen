import { Flex, Separator, Skeleton, SkeletonText, Text } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { BodyCollectionsByCategoryQuery } from "__generated__/BodyCollectionsByCategoryQuery.graphql"
import { BodyCollectionsByCategory_viewer$key } from "__generated__/BodyCollectionsByCategory_viewer.graphql"
import {
  CollectionRailPlaceholder,
  CollectionRailWithSuspense,
} from "app/Scenes/CollectionsByCategory/CollectionRail"
import { CollectionsByCategoriesRouteProp } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import {
  CollectionsChips,
  CollectionsChipsPlaceholder,
} from "app/Scenes/CollectionsByCategory/CollectionsChips"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface BodyProps {
  viewer: BodyCollectionsByCategory_viewer$key
}

export const Body: React.FC<BodyProps> = ({ viewer }) => {
  const data = useFragment(fragment, viewer)
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const category = params.category

  if (!data?.marketingCollections) {
    return null
  }

  return (
    <Flex gap={4}>
      <Flex gap={2}>
        <Text variant="xl" px={2}>
          {category}
        </Text>
        <Text px={2}>Explore collections by {category.toLowerCase()}</Text>
        {/* TODO: fix typings broken by some unknown reason here, prob related to @plural */}
        <CollectionsChips marketingCollections={data.marketingCollections as any} />
      </Flex>

      <Separator borderColor="mono10" />

      <FlashList
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        data={data.marketingCollections}
        keyExtractor={(item) => `artwork_rail_${item?.slug}`}
        renderItem={({ item, index }) => {
          return (
            <CollectionRailWithSuspense
              slug={item?.slug ?? ""}
              lastElement={index === data.marketingCollections.length - 1}
            />
          )
        }}
      />
    </Flex>
  )
}

const ESTIMATED_ITEM_SIZE = 390

const fragment = graphql`
  fragment BodyCollectionsByCategory_viewer on Viewer
  @argumentDefinitions(category: { type: "String" }) {
    marketingCollections(category: $category, sort: CURATED, first: 20) {
      ...CollectionsChips_marketingCollections
      slug @required(action: NONE)
    }
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

        <Separator borderColor="mono10" />

        <CollectionRailPlaceholder />
      </Flex>
    </Skeleton>
  )
}

export const collectionsByCategoryQuery = graphql`
  query BodyCollectionsByCategoryQuery($category: String!) {
    viewer {
      ...BodyCollectionsByCategory_viewer @arguments(category: $category)
    }
  }
`

export const BodyWithSuspense = withSuspense({
  Component: () => {
    const { params } = useRoute<CollectionsByCategoriesRouteProp>()
    const data = useLazyLoadQuery<BodyCollectionsByCategoryQuery>(collectionsByCategoryQuery, {
      category: params.entityID,
    })

    if (!data.viewer) {
      return <BodyPlaceholder />
    }

    return <Body viewer={data.viewer} />
  },
  LoadingFallback: BodyPlaceholder,
  ErrorFallback: NoFallback,
})
