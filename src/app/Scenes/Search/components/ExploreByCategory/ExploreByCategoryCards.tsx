import { Flex, Text } from "@artsy/palette-mobile"
import { ExploreByCategoryCards_category$key } from "__generated__/ExploreByCategoryCards_category.graphql"
import { ExploreByCategoryCard } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import { extractNodes } from "app/utils/extractNodes"
import React from "react"
import { graphql, useFragment } from "react-relay"

interface ExploreByCategoryCardsProps {
  categories: ExploreByCategoryCards_category$key
}

export const ExploreByCategoryCards: React.FC<ExploreByCategoryCardsProps> = ({
  categories: categoriesProp,
}) => {
  const connection = useFragment(fragment, categoriesProp)
  const categories = extractNodes(connection)

  if (!categories.length) {
    return null
  }

  return (
    <Flex p={2} gap={2}>
      <Text>Explore by Category</Text>
      <Flex flexDirection="row" flexWrap="wrap" gap={1}>
        {categories.map((category, index) => {
          return (
            <ExploreByCategoryCard category={category} index={index} key={`exploreBy-${index}`} />
          )
        })}
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment ExploreByCategoryCards_category on DiscoveryCategoriesConnectionConnection {
    edges {
      node {
        ...ExploreByCategoryCard_category
      }
    }
  }
`
