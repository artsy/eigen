import { Flex, Skeleton, SkeletonText, Text, Touchable } from "@artsy/palette-mobile"
import { useRoute } from "@react-navigation/native"
import { FooterCollectionsByCategoryQuery } from "__generated__/FooterCollectionsByCategoryQuery.graphql"
import { Footer_homeViewSectionCards$key } from "__generated__/Footer_homeViewSectionCards.graphql"
import { CollectionsByCategoriesRouteProp } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { FC } from "react"
import { graphql, useLazyLoadQuery, useFragment } from "react-relay"

interface FooterProps {
  cards: Footer_homeViewSectionCards$key
  homeViewSectionId: string
}

export const Footer: FC<FooterProps> = ({ cards, homeViewSectionId }) => {
  const { params } = useRoute<CollectionsByCategoriesRouteProp>()
  const data = useFragment(fragment, cards)

  const category = decodeURI(params.category)

  const categories = extractNodes(data?.cardsConnection).filter((c) => c.title !== category)

  if (!data || categories.length === 0) {
    return null
  }

  const handleCategoryPress = (category: string, entityID: string) => {
    navigate(
      `/collections-by-category/${category}?homeViewSectionId=${homeViewSectionId}&entityID=${entityID}`
    )
  }

  return (
    <Flex backgroundColor="mono100" p={2} gap={2}>
      <Text color="mono0">Explore more categories</Text>

      {categories.map((c, index) => (
        <Touchable
          key={`category_rail_${index}`}
          onPress={() => handleCategoryPress(c.title, c.entityID)}
        >
          <Text variant="xl" color="mono0">
            {c.title}
          </Text>
        </Touchable>
      ))}
    </Flex>
  )
}

const fragment = graphql`
  fragment Footer_homeViewSectionCards on HomeViewSectionCards {
    cardsConnection(first: 6) {
      edges {
        node {
          title @required(action: NONE)
          entityID @required(action: NONE)
        }
      }
    }
  }
`

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

const query = graphql`
  query FooterCollectionsByCategoryQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...Footer_homeViewSectionCards
      }
    }
  }
`

export const FooterWithSuspense = withSuspense<Pick<FooterProps, "homeViewSectionId">>({
  Component: ({ homeViewSectionId }) => {
    const data = useLazyLoadQuery<FooterCollectionsByCategoryQuery>(query, {
      id: homeViewSectionId,
    })

    if (!data?.homeView.section) {
      return <FooterPlaceholder />
    }

    return <Footer cards={data.homeView.section} homeViewSectionId={homeViewSectionId} />
  },
  LoadingFallback: FooterPlaceholder,
  ErrorFallback: NoFallback,
})
