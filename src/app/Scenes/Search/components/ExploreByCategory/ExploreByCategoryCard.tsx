import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Image, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ExploreByCategoryCard_category$key } from "__generated__/ExploreByCategoryCard_category.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
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
  const { width } = useScreenDimensions()
  const space = useSpace()
  const tracking = useTracking()

  const card = useFragment(fragment, categoryProp)

  if (!card) {
    return null
  }

  const href = `/collections-by-category/${card.slug}`
  const navigationProps = {
    title: card.title,
  }

  const columns = NUM_COLUMNS_MASONRY

  const imageColumnGaps = columns === 2 ? space(0.5) : 0
  const imageWidth = width / columns - space(2) - imageColumnGaps

  const handleCardPress = () => {
    if (href) {
      tracking.trackEvent(tracks.tappedCardGroup(card.slug, href, index))
    }
  }

  return (
    /**
     * A prefetchVariable is passed to RouterLink so that Relay doesn't confuse the viewer used by
     * CollectionsByCategory with other viewers it has in the cache. By providing the category slug
     * as a variable, its viewer will be stored in its own cache key.
     */
    <RouterLink
      to={href}
      navigationProps={navigationProps}
      onPress={handleCardPress}
      prefetchVariables={{ categorySlug: card.slug }}
    >
      <Flex borderRadius={5} overflow="hidden">
        <Image src={card.imageUrl} width={imageWidth} aspectRatio={IMAGE_RATIO} />

        <Flex position="absolute" top={space(1)} left={space(1)} backgroundColor="mono0" px={0.5}>
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
    title
  }
`

export const IMAGE_RATIO = 0.85

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
