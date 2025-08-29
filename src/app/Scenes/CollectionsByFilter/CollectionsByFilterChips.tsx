import { Chip, Flex, useSpace } from "@artsy/palette-mobile"
import {
  CollectionsByFilterChips_discoveryCategories$data,
  CollectionsByFilterChips_discoveryCategories$key,
} from "__generated__/CollectionsByFilterChips_discoveryCategories.graphql"
import {
  CHIP_WIDTH,
  getRows,
  getSnapToOffsets,
} from "app/Scenes/CollectionsByCategory/CollectionsChips"
import { useCollectionByCategoryTracking } from "app/Scenes/CollectionsByCategory/hooks/useCollectionByCategoryTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { FC, memo } from "react"
import { FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface CollectionsByFilterChipsProps {
  discoveryCategories: CollectionsByFilterChips_discoveryCategories$key
}

export const CollectionsByFilterChips: FC<CollectionsByFilterChipsProps> = ({
  discoveryCategories,
}) => {
  const data = useFragment(fragment, discoveryCategories)
  const space = useSpace()

  if (!data.chipsFilteredCollections) {
    return null
  }

  const collections = extractNodes(data.chipsFilteredCollections)

  const numRows = !isTablet() ? 3 : 2
  const numColumns = Math.ceil(collections.length / 3)
  const rows = getRows<(typeof collections)[number]>(collections, numRows)
  const snapToOffsets = getSnapToOffsets(numColumns, space(1), space(1))

  return (
    <FlatList
      horizontal
      disableVirtualization
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      snapToEnd={false}
      data={rows}
      snapToOffsets={snapToOffsets}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
      keyExtractor={(item, index) => `item_${index}_${item[0]?.title}`}
      renderItem={({ item }) => <CollectionsByFilterChip item={item} />}
    />
  )
}

const fragment = graphql`
  fragment CollectionsByFilterChips_discoveryCategories on DiscoveryCategory {
    chipsFilteredCollections: filtersForArtworksConnection(first: 10) {
      edges {
        node {
          href
          title
        }
      }
    }
  }
`

interface CollectionsByFilterChipProps {
  item: NonNullable<
    NonNullable<
      NonNullable<
        NonNullable<
          NonNullable<
            NonNullable<CollectionsByFilterChips_discoveryCategories$data>["chipsFilteredCollections"]
          >["edges"]
        >[number]
      >["node"]
    >[]
  >
}

const CollectionsByFilterChip = memo<CollectionsByFilterChipProps>(({ item }) => {
  const { trackChipTap } = useCollectionByCategoryTracking()
  const handleChipPress = (title: string, index: number) => {
    trackChipTap(title, index)
  }

  return (
    <Flex gap={1}>
      {item.map((item, index) => {
        const href = `${item.href}&title=${encodeURI(item.title)}&disableSubtitle=true`
        return (
          <Flex minWidth={CHIP_WIDTH} key={`collectionChips-row-${index}`}>
            <RouterLink
              to={href}
              onPress={() => handleChipPress(item.title, index)}
              hasChildTouchable
            >
              <Chip title={item.title} />
            </RouterLink>
          </Flex>
        )
      })}
    </Flex>
  )
})
