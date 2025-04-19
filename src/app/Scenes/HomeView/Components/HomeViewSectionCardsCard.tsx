import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, Image, SkeletonBox, Text, useSpace } from "@artsy/palette-mobile"
import { HomeViewSectionCardsCard_card$key } from "__generated__/HomeViewSectionCardsCard_card.graphql"
import { HomeViewSectionCardsCard_section$key } from "__generated__/HomeViewSectionCardsCard_section.graphql"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

const IMAGE_RATIO = 0.85

interface HomeViewSectionCardsCardProps {
  card: HomeViewSectionCardsCard_card$key
  section: HomeViewSectionCardsCard_section$key
  index: number
  imageWidth: number
}

export const HomeViewSectionCardsCard: FC<HomeViewSectionCardsCardProps> = ({
  card: _card,
  section: _section,
  index,
  imageWidth,
}) => {
  const space = useSpace()
  const card = useFragment(cardFragment, _card)
  const section = useFragment(sectionFragment, _section)
  const tracking = useHomeViewTracking()

  if (!card || !section) {
    return null
  }

  const href =
    card?.entityType === OwnerType.collectionsCategory
      ? `/collections-by-category/${card.entityID}`
      : card?.href
  const navigationProps =
    card?.entityType === OwnerType.collectionsCategory
      ? {
          homeViewSectionId: section.internalID,
          category: card.title,
          entityID: card.entityID,
        }
      : undefined

  const handleCardPress = () => {
    if (href) {
      tracking.tappedCardGroup(
        card.entityID,
        card.entityType as ScreenOwnerType,
        href,
        section.contextModule as ContextModule,
        index
      )
    }
  }

  return (
    <RouterLink
      to={href}
      prefetchVariables={{ category: card.entityID }}
      navigationProps={navigationProps}
      onPress={handleCardPress}
    >
      <Flex borderRadius={5} overflow="hidden">
        <Image src={card.image?.url as string} width={imageWidth} aspectRatio={IMAGE_RATIO} />

        <Flex position="absolute" top={space(1)} left={space(1)} backgroundColor="mono0" px={0.5}>
          <Text variant="md">{card.title}</Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const cardFragment = graphql`
  fragment HomeViewSectionCardsCard_card on HomeViewCard {
    entityID @required(action: NONE)
    title @required(action: NONE)
    entityType
    href
    image {
      url
    }
  }
`
const sectionFragment = graphql`
  fragment HomeViewSectionCardsCard_section on HomeViewSectionCards {
    internalID
    contextModule
  }
`

export const HomeViewSectionCardsCardPlaceholder: FC<
  Pick<HomeViewSectionCardsCardProps, "imageWidth" | "index">
> = ({ imageWidth, index }) => {
  return (
    <Flex key={index} borderRadius={5}>
      <SkeletonBox width={imageWidth} height={imageWidth / IMAGE_RATIO} />
    </Flex>
  )
}
