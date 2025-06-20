import { ActionType, ContextModule, OwnerType, TappedCardGroup } from "@artsy/cohesion"
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

  const href = `/collections-by-category/${card.id}`
  const navigationProps = {
    category: card.title,
    entityID: card.id,
  }

  const handleCardPress = () => {
    if (href) {
      tracking.trackEvent(tracks.tappedCardGroup(card.id, href, index))
    }
  }

  return (
    <RouterLink
      to={href}
      prefetchVariables={{ category: card.id }}
      navigationProps={navigationProps}
      onPress={handleCardPress}
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

const IMAGE_RATIO = 0.85

const tracks = {
  tappedCardGroup: (entityID: string, href: string, index: number) =>
    ({
      action: ActionType.tappedCardGroup,
      context_module: ContextModule.exploreBy,
      context_screen_owner_type: OwnerType.search,
      destination_screen_owner_type: OwnerType.collectionsCategory,
      destination_path: href,
      destination_screen_owner_id: entityID,
      horizontal_slide_position: index,
      type: "thumbnail",
    }) as TappedCardGroup, // TODO: stop typecasting this once cohesion is updated to include destination_path
}
