import { Chip, Flex, SkeletonBox, SkeletonText, Spacer, useSpace } from "@artsy/palette-mobile"
import { CollectionsChips_marketingCollections$key } from "__generated__/CollectionsChips_marketingCollections.graphql"
import { useCollectionByCategoryTracking } from "app/Scenes/CollectionsByCategory/hooks/useCollectionByCategoryTracking"
import { navigate } from "app/system/navigation/navigate"
import { Dimensions, FlatList, ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

const { width } = Dimensions.get("window")
const CHIP_WIDTH = 260

interface CollectionsChipsProps {
  marketingCollections: CollectionsChips_marketingCollections$key
}

export const CollectionsChips: React.FC<CollectionsChipsProps> = ({
  marketingCollections: _marketingCollections,
}) => {
  const marketingCollections = useFragment(fragment, _marketingCollections)
  const space = useSpace()
  const { trackChipTap } = useCollectionByCategoryTracking()

  if (!marketingCollections) {
    return null
  }

  const numColumns = Math.ceil(marketingCollections.length / 3)

  const snapToOffsets = getSnapToOffsets(numColumns, space(1), space(2))

  const handleChipPress = (slug: string, id: number) => {
    trackChipTap(slug, id)
    navigate(`/collection/${slug}`)
  }

  return (
    <Flex>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToEnd={false}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
      >
        <FlatList
          scrollEnabled={false}
          columnWrapperStyle={numColumns > 1 ? { gap: space(1) } : undefined}
          ItemSeparatorComponent={() => <Spacer y={1} />}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={numColumns}
          data={marketingCollections}
          keyExtractor={(item, index) => `item_${index}_${item.internalID}`}
          renderItem={({ item, index }) => (
            <Flex minWidth={CHIP_WIDTH}>
              <Chip
                key={item.internalID}
                title={item.title}
                onPress={() => {
                  if (item?.slug) {
                    handleChipPress(item.slug, index)
                  }
                }}
              />
            </Flex>
          )}
        />
      </ScrollView>
    </Flex>
  )
}

const fragment = graphql`
  fragment CollectionsChips_marketingCollections on MarketingCollection @relay(plural: true) {
    internalID
    title
    slug
  }
`

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

const getSnapToOffsets = (numColumns: number, gap: number, padding: number) => {
  if (!isTablet()) {
    // first and last elements are cornered
    const firstOffset = CHIP_WIDTH + gap + CHIP_WIDTH / 2 - (width / 2 - padding)
    const lastOffset = CHIP_WIDTH * (numColumns - 1)
    // the middle elements are centered, the logic here is
    // first element offset + CHIP_WIDTH + gap multiplied by the index to keep it increasing
    const middleOffsets = Array.from({ length: numColumns - 2 }).map((_, index) => {
      const offset = (CHIP_WIDTH + gap) * (index + 1)
      return firstOffset + offset
    })
    return [firstOffset, ...middleOffsets, lastOffset]
  }

  return [CHIP_WIDTH * numColumns - 2]
}
