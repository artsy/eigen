import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { DiscoverSomethingNewChips_collection$key } from "__generated__/DiscoverSomethingNewChips_collection.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { getSearchRailCardWidth } from "app/Scenes/Search/components/searchRailCardWidth"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FlatList } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface DiscoverSomethingNewChipsProps {
  collections: DiscoverSomethingNewChips_collection$key
}

export const DISCOVER_CARD_HEIGHT = 60

export const DiscoverSomethingNewChips: React.FC<DiscoverSomethingNewChipsProps> = ({
  collections: collectionsProp,
}) => {
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()
  const tracking = useTracking()
  const collections = useFragment(fragment, collectionsProp)
  const cardMinWidth = getSearchRailCardWidth(screenWidth, space(2), space(2), space(1))

  if (!collections || collections.length === 0) return null

  const handleOnChipPress = (collection: (typeof collections)[number], index: number) => {
    const href = `/collection/${collection.slug}`

    tracking.trackEvent(tracks.tappedCardGroup(collection.internalID, href, index))
  }

  return (
    <Flex>
      <SectionTitle title="Discover Something New" mx={2} />

      <FlatList
        testID="DiscoverSomethingNewCards"
        horizontal
        contentContainerStyle={{ paddingHorizontal: space(2), gap: space(1) }}
        showsHorizontalScrollIndicator={false}
        data={collections}
        keyExtractor={(item) => item.internalID}
        renderItem={({ item, index }) => {
          if (!item.title) return null

          const href = `/collection/${item.slug}`

          return (
            <RouterLink
              to={href}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => handleOnChipPress(item, index)}
            >
              <Flex
                minWidth={cardMinWidth}
                height={DISCOVER_CARD_HEIGHT}
                px={1}
                justifyContent="center"
                backgroundColor="mono5"
              >
                {!!item.category && (
                  <Text variant="xs" color="mono60" numberOfLines={1}>
                    {item.category}
                  </Text>
                )}
                <Text variant="sm-display" numberOfLines={1}>
                  {item.title}
                </Text>
              </Flex>
            </RouterLink>
          )
        }}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment DiscoverSomethingNewChips_collection on MarketingCollection @relay(plural: true) {
    internalID
    slug
    title
    category
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
