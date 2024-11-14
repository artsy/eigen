import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import {
  Flex,
  Image,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Text,
  Touchable,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { HomeViewSectionCardsQuery } from "__generated__/HomeViewSectionCardsQuery.graphql"
import { HomeViewSectionCards_section$key } from "__generated__/HomeViewSectionCards_section.graphql"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import React from "react"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionCardsProps {
  section: HomeViewSectionCards_section$key
  homeViewSectionId: string
  index: number
}

const IMAGE_RATIO = 0.85

export const HomeViewSectionCards: React.FC<HomeViewSectionCardsProps> = ({
  section: _section,
  homeViewSectionId,
  index,
}) => {
  const { width } = useScreenDimensions()
  const tracking = useHomeViewTracking()
  const space = useSpace()
  const section = useFragment(fragment, _section)

  const columns = !isTablet() ? 2 : 3

  if (!section.cardsConnection) {
    return null
  }

  const imageColumnGaps = columns === 2 ? space(0.5) : 0
  const imageWidth = width / columns - space(2) - imageColumnGaps
  const cards = extractNodes(section.cardsConnection)

  const handleCardPress = (card: (typeof cards)[number], index: number) => {
    const href =
      card.entityType === OwnerType.collectionsCategory
        ? `/collections-by-category/${card.title}?homeViewSectionId=${homeViewSectionId}&entityID=${card.entityID}`
        : card.href

    if (href) {
      tracking.tappedCardGroup(
        card.entityID,
        card.entityType as ScreenOwnerType,
        href,
        section.contextModule as ContextModule,
        index
      )
      navigate(href)
    }
  }

  return (
    <Flex p={2} gap={2}>
      <Text>{section.component?.title}</Text>
      <Flex flexDirection="row" flexWrap="wrap" gap={1}>
        {cards.map((card, index) => {
          const src = card.image?.url
          if (!src) {
            return null
          }

          return (
            <Touchable key={`exploreBy-${index}`} onPress={() => handleCardPress(card, index)}>
              <Flex borderRadius={5} overflow="hidden">
                <Image src={src} width={imageWidth} aspectRatio={IMAGE_RATIO} />

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
        })}
      </Flex>

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionCards_section on HomeViewSectionCards {
    internalID
    component {
      title
    }
    contextModule
    cardsConnection(first: 6) {
      edges {
        node {
          entityID @required(action: NONE)
          title @required(action: NONE)
          entityType
          href
          image {
            url
          }
        }
      }
    }
  }
`

const query = graphql`
  query HomeViewSectionCardsQuery($id: String!, $isEnabled: Boolean!) {
    homeView {
      section(id: $id) @include(if: $isEnabled) {
        ...HomeViewSectionCards_section
      }
    }
  }
`

const HomeViewCardsPlaceholder: React.FC = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  const columns = !isTablet() ? 2 : 3
  const imageColumnGaps = columns === 2 ? space(0.5) : 0
  const imageWidth = width / columns - space(2) - imageColumnGaps

  return (
    <Skeleton>
      <Flex p={2} gap={2}>
        <SkeletonText>Explore by category</SkeletonText>
        <Flex flexDirection="row" flexWrap="wrap" gap={1}>
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <Flex key={index} borderRadius={5}>
                <SkeletonBox width={imageWidth} height={imageWidth / IMAGE_RATIO} />
              </Flex>
            ))}
          </>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionCardsQueryRenderer = withSuspense<
  Pick<SectionSharedProps, "sectionID" | "index">
>({
  Component: ({ sectionID, index }) => {
    const isEnabled = useFeatureFlag("AREnableMarketingCollectionsCategories")
    const data = useLazyLoadQuery<HomeViewSectionCardsQuery>(query, { id: sectionID, isEnabled })

    if (!data?.homeView.section || !isEnabled) {
      return null
    }

    return (
      <HomeViewSectionCards
        section={data.homeView.section}
        homeViewSectionId={sectionID}
        index={index}
      />
    )
  },
  LoadingFallback: HomeViewCardsPlaceholder,
  ErrorFallback: NoFallback,
})
