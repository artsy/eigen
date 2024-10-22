import { Flex, Skeleton, SkeletonText, Text, useSpace } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { BodyCollectionsByCategoryQuery } from "__generated__/BodyCollectionsByCategoryQuery.graphql"
import { BodyCollectionsByCategory_marketingCollection$key } from "__generated__/BodyCollectionsByCategory_marketingCollection.graphql"
import { CollectionsChips_marketingCollections$key } from "__generated__/CollectionsChips_marketingCollections.graphql"
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
  marketingCollections: BodyCollectionsByCategory_marketingCollection$key &
    CollectionsChips_marketingCollections$key
}

export const Body: React.FC<BodyProps> = ({ marketingCollections: _marketingCollections }) => {
  const space = useSpace()
  const marketingCollections = useFragment(fragment, _marketingCollections)
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const category = params.props.category

  if (!marketingCollections) {
    return null
  }

  return (
    <Flex px={2} gap={space(4)}>
      <Text variant="xl">{category}</Text>

      <Flex gap={space(1)}>
        <Text>Explore collections with {category}</Text>
        <CollectionsChips marketingCollections={_marketingCollections} />
      </Flex>

      {marketingCollections.map((collection) => {
        const slug = collection?.slug ?? ""
        return <CollectionRailWithSuspense key={`artwork_rail_${slug}`} slug={slug} />
      })}
    </Flex>
  )
}

const fragment = graphql`
  fragment BodyCollectionsByCategory_marketingCollection on MarketingCollection
  @relay(plural: true) {
    slug @required(action: NONE)
  }
`

const BodyPlaceholder: React.FC = () => {
  const space = useSpace()

  return (
    <Skeleton>
      <Flex px={2} gap={space(2)}>
        <SkeletonText variant="xl">Category</SkeletonText>

        <Flex gap={space(1)}>
          <SkeletonText>Category description text</SkeletonText>

          <CollectionsChipsPlaceholder />
        </Flex>

        <CollectionRailPlaceholder />
      </Flex>
    </Skeleton>
  )
}

const query = graphql`
  query BodyCollectionsByCategoryQuery($category: String!) {
    marketingCollections(category: $category, first: 20) {
      ...BodyCollectionsByCategory_marketingCollection
      ...CollectionsChips_marketingCollections
    }
  }
`

export const BodyWithSuspense = withSuspense({
  Component: () => {
    const { params } = useRoute<CollectionsByCategoriesRouteProp>()
    const data = useLazyLoadQuery<BodyCollectionsByCategoryQuery>(query, {
      category: params.props.entityID,
    })

    if (!data.marketingCollections) {
      return <BodyPlaceholder />
    }

    return <Body marketingCollections={data.marketingCollections} />
  },
  LoadingFallback: BodyPlaceholder,
  ErrorFallback: NoFallback,
})
