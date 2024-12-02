import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, Image, SkeletonBox, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { HomeViewSectionCardsCardQuery } from "__generated__/HomeViewSectionCardsCardQuery.graphql"
import { HomeViewSectionCardsCard_card$key } from "__generated__/HomeViewSectionCardsCard_card.graphql"
import { HomeViewSectionCardsCard_section$key } from "__generated__/HomeViewSectionCardsCard_section.graphql"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { FC, useEffect } from "react"
import { graphql, useFragment, useQueryLoader } from "react-relay"

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
  const [queryRef, loadQuery] =
    useQueryLoader<HomeViewSectionCardsCardQuery>(marketingCollectionsQuery)
  const tracking = useHomeViewTracking()

  useEffect(() => {
    if (!queryRef && card?.entityID) {
      loadQuery({ category: card.entityID }, { fetchPolicy: "store-or-network" })
    }
  }, [queryRef, card?.entityID])

  if (!card || !section) {
    return null
  }

  if (!queryRef) {
    return <HomeViewSectionCardsCardPlaceholder imageWidth={imageWidth} index={index} />
  }

  const handleCardPress = () => {
    const href =
      card?.entityType === OwnerType.collectionsCategory
        ? `/collections-by-category/${card.title}?homeViewSectionId=${section.internalID}&entityID=${card.entityID}`
        : card?.href

    if (href) {
      tracking.tappedCardGroup(
        card.entityID,
        card.entityType as ScreenOwnerType,
        href,
        section.contextModule as ContextModule,
        index
      )
      navigate(href, { passProps: { queryRef } })
    }
  }

  return (
    <Touchable onPress={handleCardPress}>
      <Flex borderRadius={5} overflow="hidden">
        <Image src={card.image?.url as string} width={imageWidth} aspectRatio={IMAGE_RATIO} />

        <Flex
          position="absolute"
          top={space(1)}
          left={space(1)}
          backgroundColor="white100"
          px={0.5}
        >
          <Text variant="md">{card.title}</Text>
        </Flex>
      </Flex>
    </Touchable>
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

export const marketingCollectionsQuery = graphql`
  query HomeViewSectionCardsCardQuery($category: String!) @cacheable {
    viewer {
      marketingCollections(category: $category, sort: CURATED, first: 20) {
        ...BodyCollectionsByCategory_marketingCollections
        ...CollectionsChips_marketingCollections
      }
    }
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
