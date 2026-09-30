import {
  Flex,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import {
  IMAGE_RATIO,
  MAX_TABLET_CATEGORY_CARD_WIDTH,
  NEXT_CATEGORY_CARD_VISIBLE_FRACTION,
} from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import { getSearchRailCardWidth } from "app/Scenes/Search/components/searchRailCardWidth"
import React from "react"
import { FlatList } from "react-native"

export const ExploreByCategoryCardsPlaceholder: React.FC = () => {
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()
  const cardWidth = getSearchRailCardWidth(
    screenWidth,
    space(2),
    0,
    space(1),
    MAX_TABLET_CATEGORY_CARD_WIDTH,
    NEXT_CATEGORY_CARD_VISIBLE_FRACTION
  )

  return (
    <Skeleton>
      <Flex py={2} gap={2}>
        <Flex px={2}>
          <SkeletonText>Explore by Category</SkeletonText>
        </Flex>
        <FlatList
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: space(2), gap: space(1) }}
          data={Array.from({ length: 6 })}
          renderItem={() => (
            <Flex borderRadius={5}>
              <SkeletonBox width={cardWidth} height={cardWidth / IMAGE_RATIO} />
            </Flex>
          )}
        />
      </Flex>
    </Skeleton>
  )
}
