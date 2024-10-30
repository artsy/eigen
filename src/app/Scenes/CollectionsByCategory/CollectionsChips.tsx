import { Chip, Flex, SkeletonBox, SkeletonText, Spacer, useSpace } from "@artsy/palette-mobile"
import {
  CollectionsChips_marketingCollections$data,
  CollectionsChips_marketingCollections$key,
} from "__generated__/CollectionsChips_marketingCollections.graphql"
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

  const numRows = !isTablet() ? 3 : 2
  const numColumns = Math.ceil(marketingCollections.length / 3)
  const rows = getRows(marketingCollections, numRows)
  const snapToOffsets = getSnapToOffsets(numColumns, space(1), space(1))

  const handleChipPress = (slug: string, index: number) => {
    trackChipTap(slug, index)
    navigate(`/collection/${slug}`)
  }

  return (
    <Flex pl={2}>
      <FlatList
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToEnd={false}
        data={rows}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        ItemSeparatorComponent={() => <Spacer x={1} />}
        contentContainerStyle={{ paddingRight: space(2) }}
        keyExtractor={(item, index) => `item_${index}_${item[0]?.internalID}`}
        renderItem={({ item }) => (
          <Flex gap={1}>
            {item.map((item, index) => {
              return (
                <Flex minWidth={CHIP_WIDTH} key={`collectionChips-row-${index}`}>
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
              )
            })}
          </Flex>
        )}
      />
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

const getRows = (data: CollectionsChips_marketingCollections$data, numRows: number) => {
  const rows = []
  for (let i = 0; i < data.length; i += numRows) {
    rows.push(data.slice(i, i + numRows))
  }
  return rows
}

export const getSnapToOffsets = (
  numColumns: number,
  gap: number,
  padding: number,
  chipWidth = CHIP_WIDTH
) => {
  if (!isTablet()) {
    // first and last elements are cornered
    const firstOffset = chipWidth + gap + chipWidth / 2 - (width / 2 - padding)
    const lastOffset = chipWidth * (numColumns - 1)
    // the middle elements are centered, the logic here is
    // first element offset + chipWidth + gap multiplied by the index to keep it increasing
    const middleOffsets = Array.from({ length: numColumns - 2 }).map((_, index) => {
      const offset = (chipWidth + gap) * (index + 1)
      return firstOffset + offset
    })
    return [firstOffset, ...middleOffsets, lastOffset]
  }

  return [CHIP_WIDTH * numColumns - 2]
}
