import { ContextModule } from "@artsy/cohesion"
import {
  Flex,
  Skeleton,
  SkeletonText,
  Text,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import { HomeViewSectionCardsQuery } from "__generated__/HomeViewSectionCardsQuery.graphql"
import { HomeViewSectionCards_section$key } from "__generated__/HomeViewSectionCards_section.graphql"
import {
  HomeViewSectionCardsCard,
  HomeViewSectionCardsCardPlaceholder,
} from "app/Scenes/HomeView/Components/HomeViewSectionCardsCard"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import React, { memo } from "react"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionCardsProps {
  section: HomeViewSectionCards_section$key
  index: number
}

export const HomeViewSectionCards: React.FC<HomeViewSectionCardsProps> = ({
  section: _section,
  index,
}) => {
  const { width } = useScreenDimensions()
  const space = useSpace()
  const section = useFragment(fragment, _section)

  const columns = !isTablet() ? 2 : 3

  if (!section.cardsConnection) {
    return null
  }

  const imageColumnGaps = columns === 2 ? space(0.5) : 0
  const imageWidth = width / columns - space(2) - imageColumnGaps
  const cards = extractNodes(section.cardsConnection)

  return (
    <Flex p={2} gap={2}>
      <Text>{section.component?.title}</Text>
      <Flex flexDirection="row" flexWrap="wrap" gap={1}>
        {cards.map((card, index) => {
          return (
            <HomeViewSectionCardsCard
              key={`exploreBy-${index}`}
              imageWidth={imageWidth}
              index={index}
              card={card}
              section={section}
            />
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
    ...HomeViewSectionCardsCard_section

    component {
      title
    }
    contextModule
    cardsConnection(first: 6) {
      edges {
        node {
          ...HomeViewSectionCardsCard_card
        }
      }
    }
  }
`

const query = graphql`
  query HomeViewSectionCardsQuery($id: String!) {
    homeView {
      section(id: $id) {
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
              <HomeViewSectionCardsCardPlaceholder
                key={`exploreByPlaceholder-${index}`}
                imageWidth={imageWidth}
                index={index}
              />
            ))}
          </>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionCardsQueryRenderer = memo(
  withSuspense<Pick<SectionSharedProps, "sectionID" | "index">>({
    Component: ({ sectionID, index }) => {
      const data = useLazyLoadQuery<HomeViewSectionCardsQuery>(query, {
        id: sectionID,
      })

      if (!data?.homeView.section) {
        return null
      }

      return <HomeViewSectionCards section={data.homeView.section} index={index} />
    },
    LoadingFallback: HomeViewCardsPlaceholder,
    ErrorFallback: NoFallback,
  })
)
