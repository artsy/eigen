import { Flex, Separator, Skeleton, SkeletonText, Text } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { CollectionsByCategoryBodyQuery } from "__generated__/CollectionsByCategoryBodyQuery.graphql"
import { CollectionsByCategoryBody_viewer$key } from "__generated__/CollectionsByCategoryBody_viewer.graphql"
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

interface CollectionsByCategoryBodyProps {
  viewer: CollectionsByCategoryBody_viewer$key
}

export const CollectionsByCategoryBody: React.FC<CollectionsByCategoryBodyProps> = ({ viewer }) => {
  const data = useFragment(fragment, viewer)

  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const title = params.title

  if (!data?.marketingCollections) {
    return null
  }

  return (
    <Flex gap={4}>
      <Flex gap={2}>
        <Text variant="xl" px={2}>
          {title}
        </Text>
        <Text px={2}>Explore collections by {title.toLowerCase()}</Text>
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
  fragment CollectionsByCategoryBody_viewer on Viewer
  @argumentDefinitions(categorySlug: { type: "String" }) {
    marketingCollections(categorySlug: $categorySlug, sort: CURATED, first: 20) {
      ...CollectionsChips_marketingCollections
      slug @required(action: NONE)
      title
    }
  }
`

const CollectionsByCategoryBodyPlaceholder: React.FC = () => {
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
  query CollectionsByCategoryBodyQuery($categorySlug: String!) {
    viewer {
      ...CollectionsByCategoryBody_viewer @arguments(categorySlug: $categorySlug)
    }
  }
`

export const CollectionsByCategoryBodyWithSuspense = withSuspense({
  Component: () => {
    const { params } = useRoute<CollectionsByCategoriesRouteProp>()
    const slug = params.slug

    const data = useLazyLoadQuery<CollectionsByCategoryBodyQuery>(collectionsByCategoryQuery, {
      categorySlug: slug,
    })

    if (!data.viewer) {
      return null
    }

    return <CollectionsByCategoryBody viewer={data.viewer} />
  },
  LoadingFallback: CollectionsByCategoryBodyPlaceholder,
  ErrorFallback: NoFallback,
})
