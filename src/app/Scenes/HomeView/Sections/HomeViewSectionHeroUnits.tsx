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
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useViewabilityConfig } from "app/utils/hooks/useViewabilityConfig"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { isNumber } from "lodash"
import { memo, useCallback, useMemo, useRef, useState } from "react"
import { FlatList, ViewToken } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface HomeViewSectionHeroUnitsProps extends FlexProps {
  section: HomeViewSectionHeroUnits_section$key
  index: number
}

type HeroUnitItem = ExtractNodeType<HomeViewSectionHeroUnits_section$data["heroUnitsConnection"]>

export const HomeViewSectionHeroUnits: React.FC<HomeViewSectionHeroUnitsProps> = memo(
  ({ section: sectionProp, index, ...flexProps }) => {
    const tracking = useHomeViewTracking()

    const section = useFragment(fragment, sectionProp)
    const heroUnits = extractNodes(section.heroUnitsConnection)

    const [currentIndex, setCurrentIndex] = useState(0)

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index

        if (isNumber(index)) {
          setCurrentIndex(index)
        }
      }
    })

    const viewabilityConfig = useViewabilityConfig()

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

    const HeroUnits = useMemo(() => {
      return (
        <FlatList
          data={heroUnits}
          decelerationRate="fast"
          horizontal
          keyExtractor={(item) => item.internalID}
          renderItem={renderItem}
          snapToAlignment="start"
          snapToInterval={width}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged.current}
        />
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!heroUnits || heroUnits.length === 0) {
      return null
    }

    return (
      <Flex {...flexProps}>
        {HeroUnits}

        <Spacer y={2} />

        <PaginationDots currentIndex={currentIndex} length={heroUnits.length} />

        <HomeViewSectionSentinel
          contextModule={section.contextModule as ContextModule}
          index={index}
        />
      </Flex>
    )
  }
)

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

export const HomeViewSectionHeroUnitsQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
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

    return <HomeViewSectionHeroUnits section={data.homeView.section} index={index} {...flexProps} />
  },
  LoadingFallback: HomeViewSectionHeroUnitsPlaceholder,
  ErrorFallback: NoFallback,
})
