import { Flex, Skeleton, SkeletonBox, SkeletonText, useSpace } from "@artsy/palette-mobile"
import {
  CATEGORY_CARD_WIDTH,
  IMAGE_RATIO,
} from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import React from "react"
import { FlatList } from "react-native"

export const ExploreByCategoryCardsPlaceholder: React.FC = () => {
  const space = useSpace()

  return (
    <Skeleton>
      <Flex p={2} gap={2}>
        <SkeletonText>Explore by Category</SkeletonText>
        <FlatList
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: space(1) }}
          data={Array.from({ length: 3 })}
          renderItem={() => (
            <Flex borderRadius={5}>
              <SkeletonBox width={CATEGORY_CARD_WIDTH} height={CATEGORY_CARD_WIDTH / IMAGE_RATIO} />
            </Flex>
          )}
        />
      </Flex>
    </Skeleton>
  )
}
