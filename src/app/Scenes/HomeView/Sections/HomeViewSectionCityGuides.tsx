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
  canLoop,
  getCityGuideCardWidth,
  getCityGuideItemWidth,
  getInitialIndex,
  getLoopedLength,
} from "app/Scenes/HomeView/Components/CityGuides/cityGuidesCarousel"
import { findNearestCityGuide } from "app/Scenes/HomeView/Components/CityGuides/findNearestCityGuide"
import { HomeViewSectionSentinel } from "app/Scenes/HomeView/Components/HomeViewSectionSentinel"
import { SectionSharedProps } from "app/Scenes/HomeView/Sections/Section"
import { useHomeViewTracking } from "app/Scenes/HomeView/hooks/useHomeViewTracking"
import { RouterLink } from "app/system/navigation/RouterLink"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo, useCallback, useMemo, useRef, useState } from "react"
import { Alert, FlatList, Linking, ListRenderItem } from "react-native"
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"
import { graphql, useFragment, useLazyLoadQuery, useRelayEnvironment } from "react-relay"

/**
 * Cards size to their content; this approximates a city card (padding, title, image, chips) for
 * the loading skeleton only.
 */
const PLACEHOLDER_CARD_HEIGHT = 206

interface HomeViewSectionCityGuidesProps extends FlexProps {
  section: HomeViewSectionCityGuides_section$key
  index: number
}

export const HomeViewSectionCityGuides: React.FC<HomeViewSectionCityGuidesProps> = memo(
  ({ section: sectionProp, index, ...flexProps }) => {
    const section = useFragment(fragment, sectionProp)
    const tracking = useHomeViewTracking()

    const cards = useMemo(
      () => extractNodes(section.cardsConnection) as CityGuideCarouselCardData[],
      [section.cardsConnection]
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
            cards={cards}
            contextModule={contextModule}
            header={
              <Flex px={1} pt={2}>
                <Text variant="xl" color="mono0">
                  {section.component?.title}
                </Text>
              </Flex>
            }
            footer={
              <Flex
                px={1}
                pb={2}
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
  const environment = useRelayEnvironment()
  const { width: screenWidth } = useScreenDimensions()
  const cardWidth = getCityGuideCardWidth(screenWidth)
  const itemWidth = getCityGuideItemWidth(screenWidth)
  const listRef = useRef<FlatList<CityGuideCarouselCardData>>(null)

  // While "Explore city near me" waits on the permission prompt and the device position
  const [isLocating, setIsLocating] = useState(false)
  const isLocatingRef = useRef(false)

  const openNearestCityGuide = useCallback(async () => {
    if (isLocatingRef.current) return

    isLocatingRef.current = true
    setIsLocating(true)

    try {
      const result = await findNearestCityGuide(environment)

      switch (result.status) {
        case "granted":
          navigate(result.href)
          break
        case "blocked":
          showLocationSettingsAlert()
          break
        case "denied":
          // The user just declined the prompt: respect it
          break
      }
    } finally {
      isLocatingRef.current = false
      setIsLocating(false)
    }
  }, [environment])

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

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        position.value = event.contentOffset.x / itemWidth
      },
      onMomentumEnd: (event) => {
        runOnJS(setCenteredIndex)(Math.round(event.contentOffset.x / itemWidth))
      },
    },
    [itemWidth]
  )

  // Fixed-size items: no measuring, and the initial index can be jumped to directly
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({ length: itemWidth, offset: itemWidth * index, index }),
    [itemWidth]
  )

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

      // City cards navigate through their `RouterLink`. The near-me card needs the user's
      // location first, so it navigates once that's resolved.
      if (!card.citySlug) {
        openNearestCityGuide()
      }
    },
    [tracking, contextModule, count, openNearestCityGuide]
  )

  const renderItem: ListRenderItem<CityGuideCarouselCardData> = useCallback(
    ({ item, index }) => (
      <CityGuideCarouselCard
        card={item}
        index={index}
        cardWidth={cardWidth}
        itemWidth={itemWidth}
        isCentered={index === centeredIndex}
        isLoading={isLocating ? !item.citySlug : false}
        position={position}
        onPress={handleCardPress}
      />
    ),
    [cardWidth, itemWidth, centeredIndex, isLocating, position, handleCardPress]
  )

  return (
    <Flex gap={2}>
      <CityGuidesBackdrop imageURLs={backdropImageURLs} position={position} loop={loop} />

      {header}

      <Animated.FlatList
        ref={listRef}
        data={data}
        renderItem={renderItem}
        // Every card shows up many times, so the index is what makes a key unique
        keyExtractor={keyExtractor}
        extraData={`${centeredIndex}-${isLocating}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        // Center-snapping, one card per swipe
        snapToInterval={itemWidth}
        decelerationRate="fast"
        disableIntervalMomentum
        contentContainerStyle={{ paddingHorizontal: (screenWidth - itemWidth) / 2 }}
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

/** Once denied, the system prompt never shows again, so Settings is the only way back. */
const showLocationSettingsAlert = () =>
  Alert.alert(
    "Allow access to your location",
    "To find the City Guide near you, allow Artsy to access your location in Settings.",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Open Settings", onPress: () => Linking.openSettings() },
    ]
  )

const keyExtractor = (item: CityGuideCarouselCardData, index: number) =>
  `${item.citySlug ?? "near-me"}-${index}`

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
  const { width: screenWidth } = useScreenDimensions()

  return (
    <Skeleton>
      <Flex {...flexProps} gap={2} p={1}>
        <SkeletonText variant="xl">Discover the art that makes your city</SkeletonText>

        <Flex alignItems="center">
          <SkeletonBox
            width={getCityGuideCardWidth(screenWidth)}
            height={PLACEHOLDER_CARD_HEIGHT}
          />
        </Flex>

        <SkeletonText variant="sm-display">Then create your own way</SkeletonText>
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

const HomeViewSectionCityGuidesWithSuspense: React.FC<SectionSharedProps> = withSuspense({
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

/** Behind a flag; when it's off, the section's query isn't even sent. */
export const HomeViewSectionCityGuidesQueryRenderer: React.FC<SectionSharedProps> = (props) => {
  const isEnabled = useFeatureFlag("AREnableHomeViewCityGuidesRail")

  if (!isEnabled) {
    return null
  }

  return <HomeViewSectionCityGuidesWithSuspense {...props} />
}
