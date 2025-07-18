import { ContextModule } from "@artsy/cohesion"
import { Flex, FlexProps, Skeleton, SkeletonBox, Spacer } from "@artsy/palette-mobile"
import { HomeViewSectionHeroUnitsQuery } from "__generated__/HomeViewSectionHeroUnitsQuery.graphql"
import {
  HomeViewSectionHeroUnits_section$data,
  HomeViewSectionHeroUnits_section$key,
} from "__generated__/HomeViewSectionHeroUnits_section.graphql"
import { PaginationDots } from "app/Components/PaginationDots"
import { HERO_UNIT_CARD_HEIGHT, HeroUnit } from "app/Scenes/HomeView/Components/HeroUnit"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import {
  HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT,
  HORIZONTAL_FLATLIST_WINDOW_SIZE,
} from "app/Scenes/HomeView/helpers/constants"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { isNumber } from "lodash"
import { memo, useCallback, useRef, useState } from "react"
import { FlatList, ViewabilityConfig, ViewToken } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionHeroUnitsProps extends FlexProps {
  section: HomeViewSectionHeroUnits_section$key
  index: number
}

type HeroUnitItem = ExtractNodeType<HomeViewSectionHeroUnits_section$data["heroUnitsConnection"]>

export const HomeViewSectionHeroUnits: React.FC<HomeViewSectionHeroUnitsProps> = ({
  section: sectionProp,
  index,
  ...flexProps
}) => {
  const tracking = useHomeViewTracking()

  const section = useFragment(fragment, sectionProp)
  const heroUnits = extractNodes(section.heroUnitsConnection)

  const [currentIndex, setCurrentIndex] = useState(0)

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index

      if (isNumber(index)) {
        setCurrentIndex(index)
      }
    }
  }

  const viewabilityConfig: ViewabilityConfig = { itemVisiblePercentThreshold: 25 }
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged, viewabilityConfig }])

  const { width } = useScreenDimensions()

  const renderItem = useCallback(
    ({ item, index }: { item: HeroUnitItem; index: number }) => {
      return (
        <HeroUnit
          item={{
            internalID: item.internalID,
            title: item.title,
            body: item.body,
            imageSrc: item.image?.imageURL ?? "",
            url: item.link.url,
            buttonText: item.link.text,
          }}
          onPress={() => {
            tracking.tappedHeroUnitGroup(
              item.link.url,
              section.contextModule as ContextModule,
              index
            )
          }}
        />
      )
    },
    [tracking, section.contextModule]
  )

  if (!heroUnits || heroUnits.length === 0) {
    return null
  }

  return (
    <Flex {...flexProps}>
      <FlatList
        data={heroUnits}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item) => item.internalID}
        renderItem={renderItem}
        snapToAlignment="start"
        snapToInterval={width}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        initialNumToRender={HORIZONTAL_FLATLIST_INTIAL_NUMBER_TO_RENDER_DEFAULT}
        windowSize={HORIZONTAL_FLATLIST_WINDOW_SIZE}
      />

      <Spacer y={2} />

      <PaginationDots currentIndex={currentIndex} length={heroUnits.length} />

      <HomeViewSectionSentinel
        contextModule={section.contextModule as ContextModule}
        index={index}
      />
    </Flex>
  )
}

const fragment = graphql`
  fragment HomeViewSectionHeroUnits_section on HomeViewSectionHeroUnits {
    internalID
    contextModule
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

const HomeViewSectionHeroUnitsPlaceholder: React.FC<FlexProps> = (flexProps) => {
  return (
    <Skeleton>
      <Flex {...flexProps}>
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
  query HomeViewSectionHeroUnitsQuery($id: String!) @cacheable {
    homeView {
      section(id: $id) {
        ...HomeViewSectionHeroUnits_section
      }
    }
  }
`

export const HomeViewSectionHeroUnitsQueryRenderer: React.FC<SectionSharedProps> = memo(
  withSuspense({
    Component: ({ sectionID, index, ...flexProps }) => {
      const data = useLazyLoadQuery<HomeViewSectionHeroUnitsQuery>(
        homeViewSectionHeroUnitsQuery,
        {
          id: sectionID,
        },
        {
          networkCacheConfig: {
            force: false,
          },
        }
      )

      if (!data.homeView.section) {
        return null
      }

      return (
        <HomeViewSectionHeroUnits section={data.homeView.section} index={index} {...flexProps} />
      )
    },
    LoadingFallback: HomeViewSectionHeroUnitsPlaceholder,
    ErrorFallback: NoFallback,
  })
)
