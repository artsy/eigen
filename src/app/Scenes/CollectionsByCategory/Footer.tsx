import { Flex, Skeleton, SkeletonText, Text } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { FooterCollectionsByCategoryQuery } from "__generated__/FooterCollectionsByCategoryQuery.graphql"
import { Footer_category$key } from "__generated__/Footer_category.graphql"
import { CollectionsByCategoriesRouteProp } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface FooterProps {
  categories: Footer_category$key
}

export const Footer: FC<FooterProps> = ({ categories: categoriesProp }) => {
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const connection = useFragment(fragment, categoriesProp)

  const category = decodeURI(params.category)
  const categories = extractNodes(connection).filter((c) => c.category !== category)

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
          to={`/collections-by-category/${c.category}`}
        >
          <Text variant="xl" color="mono0">
            {c.title}
          </Text>
        </RouterLink>
      ))}
    </Flex>
  )
}

const FooterPlaceholder: FC = () => {
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

export const FooterWithSuspense = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<FooterCollectionsByCategoryQuery>(query, {})

    if (!data?.categories) {
      return null
    }

    return <Footer categories={data.categories} />
  },
  LoadingFallback: FooterPlaceholder,
  ErrorFallback: NoFallback,
})

const query = graphql`
  query FooterCollectionsByCategoryQuery {
    categories: discoveryCategoriesConnection {
      ...Footer_category
    }
  }
`

const fragment = graphql`
  fragment Footer_category on DiscoveryCategoriesConnectionConnection {
    edges {
      node {
        title @required(action: NONE)
        category @required(action: NONE)
      }
    }
  }
`
