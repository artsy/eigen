import { Flex, Skeleton, SkeletonText, Text } from "@artsy/palette-mobile"
import { CollectionsByCategoryFooterQuery } from "__generated__/CollectionsByCategoryFooterQuery.graphql"
import { CollectionsByCategoryFooter_category$key } from "__generated__/CollectionsByCategoryFooter_category.graphql"
import { useCollectionsByCategoryParams } from "app/Scenes/CollectionsByCategory/hooks/useCollectionsByCategoryParams"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface CollectionsByCategoryFooterProps {
  categories: CollectionsByCategoryFooter_category$key
}

export const CollectionsByCategoryFooter: FC<CollectionsByCategoryFooterProps> = ({
  categories: categoriesProp,
}) => {
  const { slug } = useCollectionsByCategoryParams()

  const connection = useFragment(fragment, categoriesProp)

  const categories = extractNodes(connection).filter((c) => c.slug !== slug)

  if (categories.length === 0) {
    return null
  }

  return (
    <Flex backgroundColor="mono100" p={2} gap={2}>
      <Text color="mono0">Explore more categories</Text>

      {categories.map((c, index) => (
        <RouterLink
          disablePrefetch
          key={`category_rail_${index}`}
          to={`/collections-by-category/${c.slug}`}
          navigationProps={{
            title: c.title,
          }}
        >
          <Text variant="xl" color="mono0">
            {c.title}
          </Text>
        </RouterLink>
      ))}
    </Flex>
  )
}

const fragment = graphql`
  fragment CollectionsByCategoryFooter_category on DiscoveryCategoriesConnectionConnection {
    edges {
      node {
        title @required(action: NONE)
        slug @required(action: NONE)
      }
    }
  }
`

const CollectionsByCategoryFooterPlaceholder: FC = () => {
  return (
    <Skeleton>
      <Flex p={2} gap={2}>
        <SkeletonText>Explore more categories</SkeletonText>

        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonText key={`category_rail_${index}`} variant="xl">
            Category
          </SkeletonText>
        ))}
      </Flex>
    </Skeleton>
  )
}

const query = graphql`
  query CollectionsByCategoryFooterQuery {
    categories: discoveryCategoriesConnection {
      ...CollectionsByCategoryFooter_category
    }
  }
`

export const CollectionsByCategoryFooterWithSuspense = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<CollectionsByCategoryFooterQuery>(query, {})

    if (!data?.categories) {
      return null
    }

    return <CollectionsByCategoryFooter categories={data.categories} />
  },
  LoadingFallback: CollectionsByCategoryFooterPlaceholder,
  ErrorFallback: NoFallback,
})
