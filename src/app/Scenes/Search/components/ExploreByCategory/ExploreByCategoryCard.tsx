import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Image, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ExploreByCategoryCard_category$key } from "__generated__/ExploreByCategoryCard_category.graphql"
import { getSearchRailCardWidth } from "app/Scenes/Search/components/searchRailCardWidth"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ExploreByCategoryCardProps {
  category: ExploreByCategoryCard_category$key
  index: number
}

export const ExploreByCategoryCard: FC<ExploreByCategoryCardProps> = ({
  category: categoryProp,
  index,
}) => {
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()
  const tracking = useTracking()

  const card = useFragment(fragment, categoryProp)

  if (!card) {
    return null
  }

  const navigationProps = {
    title: card.title,
  }
  const cardWidth = getSearchRailCardWidth(
    screenWidth,
    space(2),
    0,
    space(1),
    MAX_TABLET_CATEGORY_CARD_WIDTH,
    NEXT_CATEGORY_CARD_VISIBLE_FRACTION
  )

  const handleCardPress = () => {
    if (card.href) {
      tracking.trackEvent(tracks.tappedCardGroup(card.slug, card.href, index))
    }
  }

  return (
    /**
     * A prefetchVariable is passed to RouterLink so that Relay doesn't confuse the viewer used by
     * CollectionsByCategory with other viewers it has in the cache. By providing the category slug
     * as a variable, its viewer will be stored in its own cache key.
     */
    <RouterLink
      to={card.href}
      navigationProps={navigationProps}
      onPress={handleCardPress}
      prefetchVariables={{ categorySlug: card.slug }}
    >
      <Flex borderRadius={5} overflow="hidden">
        <Image src={card.imageUrl} width={cardWidth} aspectRatio={IMAGE_RATIO} />

        <Flex position="absolute" top={0} left={0} backgroundColor="mono0" p={0.5}>
          <Text variant="md">{card.title}</Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const fragment = graphql`
  fragment ExploreByCategoryCard_category on DiscoveryCategory {
    category
    imageUrl @required(action: NONE)
    slug @required(action: NONE)
    href
    title
  }
`

export const IMAGE_RATIO = 1.9
export const MAX_TABLET_CATEGORY_CARD_WIDTH = 250
export const NEXT_CATEGORY_CARD_VISIBLE_FRACTION = 0.25

const tracks = {
  tappedCardGroup: (category: string, href: string, index: number) => ({
    action: ActionType.tappedCardGroup,
    context_module: ContextModule.exploreBy,
    context_screen_owner_type: OwnerType.search,
    destination_screen_owner_type: OwnerType.collectionsCategory,
    destination_path: href,
    destination_screen_owner_id: category,
    horizontal_slide_position: index,
    type: "thumbnail",
  }),
}
