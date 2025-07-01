import {
  Flex,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { IMAGE_RATIO } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategoryCard"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import React from "react"

export const ExploreByCategoryCardsPlaceholder: React.FC = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  const columns = NUM_COLUMNS_MASONRY
  const imageColumnGaps = columns === 2 ? space(0.5) : 0
  const imageWidth = width / columns - space(2) - imageColumnGaps

  return (
    <Skeleton>
      <Flex p={2} gap={2}>
        <SkeletonText>Explore by Category</SkeletonText>
        <Flex flexDirection="row" flexWrap="wrap" gap={1}>
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <Flex key={index} borderRadius={5}>
                <SkeletonBox width={imageWidth} height={imageWidth / IMAGE_RATIO} />
              </Flex>
            ))}
          </>
        </Flex>
      </Flex>
    </Skeleton>
  )
}
