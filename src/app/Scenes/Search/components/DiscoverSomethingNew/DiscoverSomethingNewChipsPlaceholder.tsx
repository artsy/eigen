import { Flex, Skeleton, SkeletonBox, useSpace } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import {
  DISCOVER_CARD_HEIGHT,
  DISCOVER_CARD_MIN_WIDTH,
} from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNewChips"
import { FlatList } from "react-native"

export const DiscoverSomethingNewChipsPlaceholder: React.FC = () => {
  const space = useSpace()

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
          renderItem={() => (
            <SkeletonBox width={DISCOVER_CARD_MIN_WIDTH} height={DISCOVER_CARD_HEIGHT} />
          )}
        />
      </Flex>
    </Skeleton>
  )
}
