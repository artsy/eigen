import { Flex, Text, useSpace } from "@artsy/palette-mobile"
import { ExploreByCategoryCards_category$key } from "__generated__/ExploreByCategoryCards_category.graphql"
import { ExploreByCategoryCard } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import { extractNodes } from "app/utils/extractNodes"
import React from "react"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ExploreByCategoryCardsProps {
  categories: ExploreByCategoryCards_category$key
}

export const ExploreByCategoryCards: React.FC<ExploreByCategoryCardsProps> = ({
  categories: categoriesProp,
}) => {
  const space = useSpace()
  const connection = useFragment(fragment, categoriesProp)
  const categories = extractNodes(connection)

  if (!categories.length) {
    return null
  }

  return (
    <Flex py={2} gap={2}>
      <Text px={2}>Explore by Category</Text>
      <FlatList
        testID="ExploreByCategoryCards"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: space(2), gap: space(1) }}
        data={categories}
        keyExtractor={(_, index) => `category-${index}`}
        renderItem={({ item, index }) => <ExploreByCategoryCard category={item} index={index} />}
      />
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
