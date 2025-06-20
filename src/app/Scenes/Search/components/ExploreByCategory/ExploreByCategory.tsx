import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ExploreByCategoryCard } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import React from "react"
import { isTablet } from "react-native-device-info"

export const ExploreByCategory: React.FC = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  const cards = MARKETING_COLLECTION_CATEGORIES

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

export interface MarketingCollectionCategory {
  id: string
  title: string
  imageUrl: string
}

export const MARKETING_COLLECTION_CATEGORIES: MarketingCollectionCategory[] = [
  {
    id: "Medium",
    title: "Medium",
    imageUrl: "https://files.artsy.net/images/collections-mediums-category.jpeg",
  },
  {
    id: "Movement",
    title: "Movement",
    imageUrl: "https://files.artsy.net/images/collections-movement-category.jpeg",
  },
  {
    id: "Collect by Size",
    title: "Size",
    imageUrl: "https://files.artsy.net/images/collections-size-category.jpeg",
  },
  {
    id: "Collect by Color",
    title: "Color",
    imageUrl: "https://files.artsy.net/images/collections-color-category.png",
  },
  {
    id: "Collect by Price",
    title: "Price",
    imageUrl: "https://files.artsy.net/images/collections-price-category.jpeg",
  },
  {
    id: "Gallery",
    title: "Gallery",
    imageUrl: "https://files.artsy.net/images/collections-gallery-category.jpeg",
  },
]
