import { Flex, Skeleton, SkeletonBox, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionHeroUnitsQuery } from "__generated__/HomeViewSectionHeroUnitsQuery.graphql"
import { HomeViewSectionHeroUnits_section$key } from "__generated__/HomeViewSectionHeroUnits_section.graphql"
import { PaginationDots } from "app/Components/PaginationDots"
import { HERO_UNIT_CARD_HEIGHT, HeroUnit } from "app/Scenes/Home/Components/HeroUnitsRail"
import { HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT } from "app/Scenes/HomeView/HomeView"
import { useHomeViewTracking } from "app/Scenes/HomeView/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useRef, useState } from "react"
import { FlatList, ViewabilityConfig, ViewToken } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionHeroUnitsProps {
  section: HomeViewSectionHeroUnits_section$key
}

export const HomeViewSectionHeroUnits: React.FC<HomeViewSectionHeroUnitsProps> = ({ section }) => {
  const tracking = useHomeViewTracking()

  const data = useFragment(fragment, section)
  const heroUnits = extractNodes(data.heroUnitsConnection)

  const [currentIndex, setCurrentIndex] = useState(0)

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index

      if (index) {
        setCurrentIndex(index)
      }
    }
  }

  const viewabilityConfig: ViewabilityConfig = { itemVisiblePercentThreshold: 25 }
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged, viewabilityConfig }])

  const { width } = useScreenDimensions()

  return (
    <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
      <FlatList
        data={heroUnits}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item) => item.internalID}
        renderItem={({ item, index }) => (
          <HeroUnit
            item={item}
            onPress={() => {
              tracking.tappedHeroUnitGroup(item.link.url, data.internalID, index)
            }}
          />
        )}
        snapToAlignment="start"
        snapToInterval={width}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <Spacer y={2} />
      <PaginationDots currentIndex={currentIndex} length={heroUnits.length} />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionHeroUnits_section on HomeViewSectionHeroUnits {
    internalID
    heroUnitsConnection(first: 10) {
      edges {
        node {
          internalID
          body
          credit
          image {
            imageURL
          }
          label
          link {
            text
            url
          }
          title
        }
      }
    }
  }
`

const HomeViewSectionHeroUnitsPlaceholder: React.FC = () => {
  return (
    <Skeleton>
      <Flex my={HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT}>
        <Spacer y={1} />

        <Flex flexDirection="row">
          <SkeletonBox height={HERO_UNIT_CARD_HEIGHT} width="100%" />
        </Flex>
      </Flex>
      <PaginationDots currentIndex={-1} length={1} />
    </Skeleton>
  )
}

const homeViewSectionHeroUnitsQuery = graphql`
  query HomeViewSectionHeroUnitsQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionHeroUnits_section
      }
    }
  }
`

export const HomeViewSectionHeroUnitsQueryRenderer: React.FC<{
  sectionID: string
}> = withSuspense((props) => {
  const data = useLazyLoadQuery<HomeViewSectionHeroUnitsQuery>(homeViewSectionHeroUnitsQuery, {
    id: props.sectionID,
  })

  if (!data.homeView.section) {
    return null
  }

  return <HomeViewSectionHeroUnits section={data.homeView.section} />
}, HomeViewSectionHeroUnitsPlaceholder)
