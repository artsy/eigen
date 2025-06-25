import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Image, Text, useSpace } from "@artsy/palette-mobile"
import { MarketingCollectionCategory } from "app/Scenes/Search/components/ExploreByCategory/constants"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FC } from "react"
import { useTracking } from "react-tracking"

interface ExploreByCategoryCardProps {
  card: MarketingCollectionCategory
  imageWidth: number
  index: number
}

export const ExploreByCategoryCard: FC<ExploreByCategoryCardProps> = ({
  card,
  index,
  imageWidth,
}) => {
  const space = useSpace()
  const tracking = useTracking()

  const href = `/collections-by-category/${card.category}`

  const handleCardPress = () => {
    if (href) {
      tracking.trackEvent(tracks.tappedCardGroup(card.category, href, index))
    }
  }

  return (
    /**
     * A prefetchVariable is passed to RouterLink so that Relay doesn't confuse the viewer used by
     * CollectionsByCategory with other viewers it has in the cache. By providing the category ID as
     * a variable, its viewer will be stored in its own cache key.
     */
    <RouterLink to={href} onPress={handleCardPress} prefetchVariables={{ category: card.category }}>
      <Flex borderRadius={5} overflow="hidden">
        <Image src={card.imageUrl} width={imageWidth} aspectRatio={IMAGE_RATIO} />

        <Flex position="absolute" top={space(1)} left={space(1)} backgroundColor="mono0" px={0.5}>
          <Text variant="md">{card.title}</Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const IMAGE_RATIO = 0.85

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
