import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Chip, Flex, useSpace } from "@artsy/palette-mobile"
import { DiscoverSomethingNewChips_collection$key } from "__generated__/DiscoverSomethingNewChips_collection.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { getSnapToOffsets } from "app/Scenes/CollectionsByCategory/hooks/useCollectionChips"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FlatList } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface DiscoverSomethingNewChipsProps {
  collections: DiscoverSomethingNewChips_collection$key
}

const CHIP_WIDTH = 230

export const DiscoverSomethingNewChips: React.FC<DiscoverSomethingNewChipsProps> = ({
  collections: collectionsProp,
}) => {
  const space = useSpace()
  const tracking = useTracking()
  const collections = useFragment(fragment, collectionsProp)

  if (!collections || collections.length === 0) return null

  const numRows = !isTablet() ? 3 : 2
  const numColumns = Math.ceil(collections.length / 3)
  const rows = getColumns(collections, numRows, numColumns)
  const snapToOffsets = getSnapToOffsets(numColumns, space(1), space(1), CHIP_WIDTH)

  const handleOnChipPress = (collection: (typeof collections)[number], index: number) => {
    const href = `/collection/${collection.slug}`

    tracking.trackEvent(tracks.tappedCardGroup(collection.internalID, href, index))
  }

  return (
    <Flex>
      <SectionTitle title="Discover Something New" mx={2} />

      <FlatList
        horizontal
        pagingEnabled
        snapToEnd={false}
        snapToOffsets={snapToOffsets}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={rows}
        keyExtractor={(item, index) => `item_${index}_${item[0].internalID}`}
        renderItem={({ item }) => (
          <Flex gap={1}>
            {item.map((item, index) => {
              if (!item?.title) return null

              const href = `/collection/${item.slug}`

              return (
                <Flex minWidth={CHIP_WIDTH} key={`collectionChips-row-${index}`}>
                  <RouterLink
                    to={href}
                    hasChildTouchable
                    onPress={() => handleOnChipPress(item, index)}
                  >
                    <Chip
                      key={href}
                      title={item.title}
                      subtitle={item.category as string | undefined}
                    />
                  </RouterLink>
                </Flex>
              )
            })}
          </Flex>
        )}
      />
    </Flex>
  )
}

const getColumns = <T extends Object>(
  data: readonly T[],
  numRows: number,
  numColumns: number
): T[][] => {
  const rows: T[][] = Array.from({ length: numColumns }, () => [])

  for (let i = 0; i < numRows * numColumns; i++) {
    rows[i % numColumns].push(data[i])
  }

  return rows
}

const fragment = graphql`
  fragment DiscoverSomethingNewChips_collection on MarketingCollection @relay(plural: true) {
    internalID
    slug
    title
    category
    thumbnail
  }
`

const tracks = {
  tappedCardGroup: (entityID: string, href: string, index: number) => ({
    action: ActionType.tappedCardGroup,
    context_module: ContextModule.discoverSomethingNewRail,
    context_screen_owner_type: OwnerType.search,
    destination_screen_owner_type: OwnerType.marketingCollection,
    destination_path: href,
    destination_screen_owner_id: entityID,
    horizontal_slide_position: index,
    type: "thumbnail",
  }),
}
