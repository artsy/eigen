import { Flex, Skeleton, SkeletonText, Text, useSpace } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { BodyCollectionsByCategoryQuery } from "__generated__/BodyCollectionsByCategoryQuery.graphql"
import { CollectionsChips_marketingCollections$key } from "__generated__/CollectionsChips_marketingCollections.graphql"
import { CollectionsByCategoriesRouteProp } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import {
  CollectionsChips,
  CollectionsChipsPlaceholder,
} from "app/Scenes/CollectionsByCategory/CollectionsChips"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface BodyProps {
  marketingCollections: CollectionsChips_marketingCollections$key
}

export const Body: React.FC<BodyProps> = ({ marketingCollections }) => {
  const space = useSpace()
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const category = params.props.category

  return (
    <Flex px={2} gap={space(2)}>
      <Text variant="xl">{category}</Text>

      <Flex gap={space(1)}>
        <Text>Explore collections with {category}</Text>
        <CollectionsChips marketingCollections={marketingCollections} />
      </Flex>
    </Flex>
  )
}

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
      </Flex>
    </Skeleton>
  )
}

const query = graphql`
  query BodyCollectionsByCategoryQuery($category: String!) {
    marketingCollections(category: $category, size: 10) {
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
