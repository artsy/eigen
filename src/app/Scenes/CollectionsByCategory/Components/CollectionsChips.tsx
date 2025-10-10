import { Chip, Flex, SkeletonBox, SkeletonText, Spacer, useSpace } from "@artsy/palette-mobile"
import { useCollectionByCategoryTracking } from "app/Scenes/CollectionsByCategory/hooks/useCollectionByCategoryTracking"
import { useCollectionsChips } from "app/Scenes/CollectionsByCategory/hooks/useCollectionChips"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FlatList, ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"

export const CHIP_WIDTH = 260

interface CollectionsChipsProps {
  chips: {
    title: string
    slug?: string
    href: string
  }[]
}

export const CollectionsChips: React.FC<CollectionsChipsProps> = ({ chips }) => {
  const space = useSpace()
  const { trackChipTap } = useCollectionByCategoryTracking()
  const { rows, snapToOffsets } = useCollectionsChips<CollectionsChipsProps["chips"][number]>(chips)

  if (!chips) {
    return null
  }

  const handleChipPress = (slug: string, index: number) => {
    trackChipTap(slug, index)
  }

  return (
    <FlatList
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      snapToEnd={false}
      data={rows}
      snapToOffsets={snapToOffsets}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
      keyExtractor={(_, index) => `collection-chip-column-${index}`}
      renderItem={({ item }) => (
        <Flex gap={1}>
          {item.map((item, index) => {
            return (
              <Flex minWidth={CHIP_WIDTH} key={`collectionChips-row-${index}`}>
                <RouterLink
                  to={item.href}
                  hasChildTouchable
                  onPress={() => handleChipPress(item.slug ?? item.title, index)}
                >
                  <Chip title={item.title} />
                </RouterLink>
              </Flex>
            )
          })}
        </Flex>
      )}
    />
  )
}

export const CollectionsChipsPlaceholder: React.FC = () => {
  const space = useSpace()
  const size = 6
  const numColumns = !isTablet() ? Math.ceil(size / 3) : Math.ceil(size / 2)

  return (
    <Flex>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
        <FlatList
          scrollEnabled={false}
          data={Array.from({ length: size })}
          columnWrapperStyle={{ gap: space(1) }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={numColumns}
          ItemSeparatorComponent={() => <Spacer y={1} />}
          renderItem={() => (
            <SkeletonBox width={CHIP_WIDTH} height={70}>
              <SkeletonText>Collection</SkeletonText>
            </SkeletonBox>
          )}
        />
      </ScrollView>
    </Flex>
  )
}
