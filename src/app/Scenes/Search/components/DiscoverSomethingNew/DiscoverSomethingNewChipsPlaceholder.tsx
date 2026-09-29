import { Flex, Skeleton, SkeletonBox, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { DISCOVER_CARD_HEIGHT } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChips"
import { getSearchRailCardWidth } from "app/Scenes/Search/components/searchRailCardWidth"
import { FlatList } from "react-native"

export const DiscoverSomethingNewChipsPlaceholder: React.FC = () => {
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()
  const cardWidth = getSearchRailCardWidth(screenWidth, space(2), space(2), space(1))

  return (
    <Skeleton>
      <Flex testID="DiscoverSomethingNewChipsPlaceholder">
        <SectionTitle title="Discover Something New" mx={2} />

        <FlatList
          horizontal
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
          showsHorizontalScrollIndicator={false}
          data={Array.from({ length: 3 })}
          renderItem={() => <SkeletonBox width={cardWidth} height={DISCOVER_CARD_HEIGHT} />}
        />
      </Flex>
    </Skeleton>
  )
}
