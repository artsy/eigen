import { ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import {
  Button,
  Flex,
  FlexProps,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Text,
  Theme,
} from "@artsy/palette-mobile"
import { HomeViewSectionCityGuidesQuery } from "__generated__/HomeViewSectionCityGuidesQuery.graphql"
import { HomeViewSectionCityGuides_section$key } from "__generated__/HomeViewSectionCityGuides_section.graphql"
import {
  CityGuideCarouselCard,
  CityGuideCarouselCardData,
} from "app/Scenes/HomeView/Components/CityGuides/CityGuideCarouselCard"
import { CityGuidesBackdrop } from "app/Scenes/HomeView/Components/CityGuides/CityGuidesBackdrop"
import {
  CITY_GUIDE_CARD_HEIGHT,
  CITY_GUIDE_CARD_WIDTH,
  CITY_GUIDE_ITEM_WIDTH,
  canLoop,
  getInitialIndex,
  getLoopedLength,
} from "app/Scenes/HomeView/Components/CityGuides/cityGuidesCarousel"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useLocation } from "app/utils/hooks/useLocation"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo, useCallback, useMemo, useRef, useState } from "react"
import { FlatList, ListRenderItem } from "react-native"
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

/** Leaves room around the centered card for it to scale up without clipping */
const CAROUSEL_HEIGHT = CITY_GUIDE_CARD_HEIGHT + 14

interface HomeViewSectionCityGuidesProps extends FlexProps {
  section: HomeViewSectionCityGuides_section$key
  index: number
}

export const HomeViewSectionCityGuides: React.FC<HomeViewSectionCityGuidesProps> = memo(
  ({ section: sectionProp, index, ...flexProps }) => {
    const section = useFragment(fragment, sectionProp)
    const tracking = useHomeViewTracking()

    // Never prompts: only resolves when the user has already granted location access
    const { location } = useLocation({ skipPermissionRequests: true })
    const hasLocation = !!location

    const cards = useMemo(
      () =>
        (extractNodes(section.cardsConnection) as CityGuideCarouselCardData[]).filter(
          // "Explore city near me" (no slug) is only useful when the City Guide can find the
          // nearest city, which, like here, needs a device location
          (card) => !!card.citySlug || hasLocation
        ),
      [section.cardsConnection, hasLocation]
    )

    if (cards.length === 0) {
      return null
    }

    const contextModule = section.contextModule as ContextModule
    const viewAll = section.component?.behaviors?.viewAll

    return (
      // Always light: white cards and white type over a dark, blurred backdrop
      <Theme theme="v3light">
        <Flex {...flexProps} overflow="hidden">
          <CityGuidesCarousel
            // The location can arrive after the rail is shown. The loop and initial position
            // depend on the number of cards, so start over (on the first card) when it changes.
            key={cards.length}
            cards={cards}
            contextModule={contextModule}
            header={
              <Flex px={2} pt="25px" pb={2}>
                <Text variant="xl" color="mono0">
                  {section.component?.title}
                </Text>
              </Flex>
            }
            footer={
              <Flex
                px={2}
                pt={2}
                pb="25px"
                flexDirection="row"
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <Flex flex={1} mr={2}>
                  {!!section.component?.description && (
                    <Text variant="sm-display" color="mono0">
                      {section.component.description}
                    </Text>
                  )}
                </Flex>

                {!!viewAll?.href && (
                  <RouterLink
                    to={viewAll.href}
                    hasChildTouchable
                    onPress={() => {
                      tracking.tappedCardGroupViewAll(
                        contextModule,
                        (viewAll.ownerType ?? OwnerType.cityGuide) as ScreenOwnerType
                      )
                    }}
                  >
                    <Button variant="outlineLight">{viewAll.buttonText ?? "City Guide"}</Button>
                  </RouterLink>
                )}
              </Flex>
            }
          />

          <HomeViewSectionSentinel contextModule={contextModule} index={index} />
        </Flex>
      </Theme>
    )
  }
)

interface CityGuidesCarouselProps {
  cards: CityGuideCarouselCardData[]
  contextModule: ContextModule
  /** Rendered above and below the cards, over the same backdrop */
  header: React.ReactNode
  footer: React.ReactNode
}

/**
 * An infinite, center-snapping carousel. The cards are repeated in a virtualized list that starts
 * in the middle, so swiping either way keeps coming back to the same cards.
 *
 * Swiping only updates a shared value on the UI thread; cards and backdrop animate from it without
 * re-rendering. React state changes once per swipe (the centered card), re-rendering just the two
 * cards whose `isCentered` flips.
 */
const CityGuidesCarousel: React.FC<CityGuidesCarouselProps> = ({
  cards,
  contextModule,
  header,
  footer,
}) => {
  const tracking = useHomeViewTracking()
  const { width: screenWidth } = useScreenDimensions()
  const listRef = useRef<FlatList<CityGuideCarouselCardData>>(null)

  const count = cards.length
  const loop = canLoop(count)
  const initialIndex = getInitialIndex(count)

  const position = useSharedValue(initialIndex)
  const [centeredIndex, setCenteredIndex] = useState(initialIndex)

  const data = useMemo(
    () => Array.from({ length: getLoopedLength(count) }, (_, i) => cards[i % count]),
    [cards, count]
  )

  const backdropImageURLs = useMemo(() => cards.map((card) => card.image?.imageURL), [cards])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      position.value = event.contentOffset.x / CITY_GUIDE_ITEM_WIDTH
    },
    onMomentumEnd: (event) => {
      runOnJS(setCenteredIndex)(Math.round(event.contentOffset.x / CITY_GUIDE_ITEM_WIDTH))
    },
  })

  const handleCardPress = useCallback(
    (card: CityGuideCarouselCardData, itemIndex: number, isCentered: boolean) => {
      if (!isCentered) {
        listRef.current?.scrollToIndex({ index: itemIndex, animated: true })
        // Not left to `onMomentumEnd`: platforms differ on firing it for programmatic scrolls
        setCenteredIndex(itemIndex)
        return
      }

      tracking.tappedCardGroup(
        card.citySlug ?? "",
        OwnerType.cityGuide as ScreenOwnerType,
        card.href,
        contextModule,
        itemIndex % count
      )
    },
    [tracking, contextModule, count]
  )

  const renderItem: ListRenderItem<CityGuideCarouselCardData> = useCallback(
    ({ item, index }) => (
      <CityGuideCarouselCard
        card={item}
        index={index}
        isCentered={index === centeredIndex}
        position={position}
        onPress={handleCardPress}
      />
    ),
    [centeredIndex, position, handleCardPress]
  )

  return (
    <Flex>
      <CityGuidesBackdrop imageURLs={backdropImageURLs} position={position} loop={loop} />

      {header}

      <Animated.FlatList
        ref={listRef}
        data={data}
        renderItem={renderItem}
        // Every card shows up many times, so the index is what makes a key unique
        keyExtractor={keyExtractor}
        extraData={centeredIndex}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Center-snapping, one card per swipe
        snapToInterval={CITY_GUIDE_ITEM_WIDTH}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: (screenWidth - CITY_GUIDE_ITEM_WIDTH) / 2 }}
        style={{ height: CAROUSEL_HEIGHT }}
        // Fixed-size items: no measuring, and the initial index can be jumped to directly
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />

      {footer}
    </Flex>
  )
}

const keyExtractor = (item: CityGuideCarouselCardData, index: number) =>
  `${item.citySlug ?? "near-me"}-${index}`

const getItemLayout = (_: unknown, index: number) => ({
  length: CITY_GUIDE_ITEM_WIDTH,
  offset: CITY_GUIDE_ITEM_WIDTH * index,
  index,
})

const fragment = graphql`
  fragment HomeViewSectionCityGuides_section on HomeViewSectionCityGuides {
    internalID
    contextModule
    component {
      title
      description
      behaviors {
        viewAll {
          buttonText
          href
          ownerType
        }
      }
    }
    cardsConnection(first: 10) {
      edges {
        node {
          citySlug
          title
          href
          chips
          image {
            imageURL
          }
        }
      }
    }
  }
`

const HomeViewSectionCityGuidesPlaceholder: React.FC<FlexProps> = (flexProps) => {
  return (
    <Skeleton>
      <Flex {...flexProps} px={2} pt="25px" pb="25px">
        <SkeletonText variant="xl">Discover the art that makes your city</SkeletonText>

        <Flex height={CAROUSEL_HEIGHT} mt={2} alignItems="center" justifyContent="center">
          <SkeletonBox width={CITY_GUIDE_CARD_WIDTH} height={CITY_GUIDE_CARD_HEIGHT} />
        </Flex>

        <SkeletonText variant="sm-display" mt={2}>
          Then create your own way
        </SkeletonText>
      </Flex>
    </Skeleton>
  )
}

const homeViewSectionCityGuidesQuery = graphql`
  query HomeViewSectionCityGuidesQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...HomeViewSectionCityGuides_section
      }
    }
  }
`

export const HomeViewSectionCityGuidesQueryRenderer: React.FC<SectionSharedProps> = withSuspense({
  Component: ({ sectionID, index, ...flexProps }) => {
    const data = useLazyLoadQuery<HomeViewSectionCityGuidesQuery>(
      homeViewSectionCityGuidesQuery,
      { id: sectionID },
      { networkCacheConfig: { force: false } }
    )

    if (!data.homeView.section) {
      return null
    }

    return (
      <HomeViewSectionCityGuides section={data.homeView.section} index={index} {...flexProps} />
    )
  },
  LoadingFallback: HomeViewSectionCityGuidesPlaceholder,
  ErrorFallback: NoFallback,
})
