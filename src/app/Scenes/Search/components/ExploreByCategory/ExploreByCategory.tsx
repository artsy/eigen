import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ExploreByCategoryCard } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import { MARKETING_COLLECTION_CATEGORIES } from "app/Scenes/Search/components/ExploreByCategory/constants"
import React from "react"
import { isTablet } from "react-native-device-info"

export const ExploreByCategory: React.FC = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  const cards = Object.values(MARKETING_COLLECTION_CATEGORIES)

  const columns = !isTablet() ? 2 : 3

  const imageColumnGaps = columns === 2 ? space(0.5) : 0
  const imageWidth = width / columns - space(2) - imageColumnGaps

  return (
    <Flex p={2} gap={2}>
      <Text>Explore by Category</Text>
      <Flex flexDirection="row" flexWrap="wrap" gap={1}>
        {cards.map((card, index) => {
          return (
            <ExploreByCategoryCard
              card={card}
              imageWidth={imageWidth}
              index={index}
              key={`exploreBy-${index}`}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}
