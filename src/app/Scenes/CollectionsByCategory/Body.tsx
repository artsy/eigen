import { Flex, Separator, Skeleton, SkeletonText, Text, useSpace } from "@artsy/palette-mobile"
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
import { graphql, useLazyLoadQuery, useFragment } from "react-relay"

interface BodyProps {
  viewer: BodyCollectionsByCategory_viewer$key
}

export const Body: React.FC<BodyProps> = ({ viewer }) => {
  const space = useSpace()
  const data = useFragment(fragment, viewer)
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const category = params.props.category

  if (!data?.marketingCollections) {
    return null
  }

  return (
    <Flex gap={space(4)}>
      <Text variant="xl" px={2}>
        {category}
      </Text>

      <Flex px={2} gap={space(2)}>
        <Text>Explore collections with {category}</Text>
        {/* TODO: fix typings broken by some unknown reason here, prob related to @plural */}
        <CollectionsChips marketingCollections={data.marketingCollections as any} />
      </Flex>

      <Separator borderColor="black10" />

      <FlashList
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        data={data.marketingCollections}
        keyExtractor={(item) => `artwork_rail_${item?.slug}`}
        renderItem={({ item }) => {
          return <CollectionRailWithSuspense slug={item?.slug ?? ""} />
        }}
        ItemSeparatorComponent={() => <Separator borderColor="black10" my={4} />}
      />
    </Flex>
  )
}

const ESTIMATED_ITEM_SIZE = 390

const fragment = graphql`
  fragment BodyCollectionsByCategory_viewer on Viewer
  @argumentDefinitions(category: { type: "String" }) {
    marketingCollections(category: $category, first: 20) {
      ...CollectionsChips_marketingCollections

      slug @required(action: NONE)
    }
  }
`

const BodyPlaceholder: React.FC = () => {
  const space = useSpace()

  return (
    <Skeleton>
      <Flex gap={space(4)}>
        <Flex px={2}>
          <SkeletonText variant="xl">Category</SkeletonText>
        </Flex>

        <Flex gap={space(1)} px={2}>
          <SkeletonText>Category description text</SkeletonText>

          <CollectionsChipsPlaceholder />
        </Flex>

        <Separator borderColor="black10" />

        <CollectionRailPlaceholder />
      </Flex>
    </Skeleton>
  )
}

const query = graphql`
  query BodyCollectionsByCategoryQuery($category: String!) @cacheable {
    viewer {
      ...BodyCollectionsByCategory_viewer @arguments(category: $category)
    }
  }
`

export const BodyWithSuspense = withSuspense({
  Component: () => {
    const { params } = useRoute<CollectionsByCategoriesRouteProp>()
    const data = useLazyLoadQuery<BodyCollectionsByCategoryQuery>(
      query,
      {
        category: params.props.entityID,
      },
      { fetchPolicy: "store-and-network" }
    )

    if (!data.viewer) {
      return <BodyPlaceholder />
    }

    return <Body viewer={data.viewer} />
  },
  LoadingFallback: BodyPlaceholder,
  ErrorFallback: NoFallback,
})
