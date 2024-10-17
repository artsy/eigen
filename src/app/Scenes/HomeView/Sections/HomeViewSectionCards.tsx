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
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { useClientQuery } from "app/utils/useClientQuery"
import React from "react"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionCardsProps {
  section: HomeViewSectionCards_section$key
  homeViewSectionId: string
}

export const HomeViewSectionExploreBy: React.FC<HomeViewSectionCardsProps> = ({
  section: _section,
  homeViewSectionId,
}) => {
  const { width } = useScreenDimensions()
  const space = useSpace()
  const section = useFragment(fragment, _section)

  const columns = !isTablet() ? 2 : 3

  if (!section.cardsConnection) {
    return null
  }

  const imageColumnGaps = columns === 2 ? space(0.5) : 0
  const imageSize = width / columns - space(2) - imageColumnGaps
  const categories = extractNodes(section.cardsConnection)

  const handleCategoryPress = (category: string, entityID: string) => {
    navigate(
      `/collections-by-category/${category}?homeViewSectionId=${homeViewSectionId}&entityID=${entityID}`
    )
  }

  return (
    <Flex p={2} gap={space(2)}>
      <Text>{section.component?.title}</Text>
      <Flex flexDirection="row" flexWrap="wrap" gap={space(1)}>
        {categories.map((category, index) => {
          const src = category.image?.url
          if (!src) {
            return null
          }

          return (
            <Touchable
              key={`exploreBy-${index}`}
              onPress={() => handleCategoryPress(category.title, category.entityID)}
            >
              <Flex borderRadius={5} overflow="hidden">
                <Image src={src} width={imageSize} height={imageSize} />

                <Flex
                  position="absolute"
                  top={space(1)}
                  left={space(1)}
                  backgroundColor="white100"
                  p={0.5}
                >
                  <Text variant="lg-display">{category.title}</Text>
                </Flex>
              </Flex>
            </Touchable>
          )
        })}
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionCards_section on HomeViewSectionCards {
    internalID
    component {
      title
    }
    cardsConnection(first: 6) {
      edges {
        node {
          entityID @required(action: NONE)
          title @required(action: NONE)
          image {
            url
          }
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
  const imageSize = width / columns - space(2) - imageColumnGaps

  return (
    <Skeleton>
      <Flex p={2} gap={space(2)}>
        <SkeletonText>Explore by category</SkeletonText>
        <Flex flexDirection="row" flexWrap="wrap" gap={space(1)}>
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <Flex key={index} borderRadius={5}>
                <SkeletonBox height={imageSize} width={imageSize} />
              </Flex>
            ))}
          </>
        </Flex>
      </Flex>
    </Skeleton>
  )
}

export const HomeViewSectionCardsQueryRenderer = withSuspense<
  Pick<SectionSharedProps, "sectionID">
>({
  Component: ({ sectionID }) => {
    const isEnabled = useFeatureFlag("AREnableMarketingCollectionsCategories")
    const { data } = useClientQuery<HomeViewSectionCardsQuery>({
      query,
      variables: { id: sectionID },
      skip: !isEnabled,
    })

    if (!data?.homeView.section || !isEnabled) {
      return null
    }

    return (
      <HomeViewSectionExploreBy section={data.homeView.section} homeViewSectionId={sectionID} />
    )
  },
  LoadingFallback: HomeViewCardsPlaceholder,
  ErrorFallback: NoFallback,
})
