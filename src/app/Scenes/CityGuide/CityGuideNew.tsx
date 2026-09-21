import { OwnerType } from "@artsy/cohesion"
import { Flex, Join, Screen, Spacer } from "@artsy/palette-mobile"
import { CityGuideNewQuery } from "__generated__/CityGuideNewQuery.graphql"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityData, CityGuideCityPicker } from "app/Scenes/CityGuide/Components/CityGuideCityPicker"
import { CityGuideCitySwitcherButton } from "app/Scenes/CityGuide/Components/CityGuideCitySwitcherButton"
import { CityGuideEventArticles } from "app/Scenes/CityGuide/Components/CityGuideEventArticles"
import { CityGuideEventGuides } from "app/Scenes/CityGuide/Components/CityGuideEventGuides"
import { CityGuideEventVideos } from "app/Scenes/CityGuide/Components/CityGuideEventVideos"
import { CityGuideEvents } from "app/Scenes/CityGuide/Components/CityGuideEvents"
import { CityGuideFloatingMapButton } from "app/Scenes/CityGuide/Components/CityGuideFloatingMapButton"
import { CityGuideItinerariesRail } from "app/Scenes/CityGuide/Components/CityGuideItinerariesRail"
import { CityGuideNewPlaceholder } from "app/Scenes/CityGuide/Components/CityGuideNewPlaceholder"
import { useInitialLocation } from "app/Scenes/CityGuide/hooks/useInitialLocation"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useCallback, useState } from "react"
import { RefreshControl } from "react-native"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"
import expandedCities from "../../../../data/cityDataSortedByDisplayPreference-expanded.json"

const cities = expandedCities as CityData[]
const fallbackCity = cities.find((city) => city.slug === "new-york-ny-usa") as CityData

/** Well above the number of rows any one of the three sections shows on the home screen. */
const PAGE_SIZE = 10

/**
 * How much of the first video page has to be showing before scrolling down commits to it.
 * This rides in `snapToOffsets` as an offset just above the block, because with `snapToStart`
 * off the scroll runs free below the *first* offset — so while the video's own top was that
 * first offset, coming down onto it never snapped, and only leaving it upwards did.
 */
const VIDEO_ENTRY_VISIBLE_RATIO = 0.7

interface SectionsProps {
  citySlug: string
  cityName: string
  videoPageHeight: number
  onVideosLayout: (layout: { y: number; height: number }) => void
}

const CityGuideNewSections: React.FC<SectionsProps> = ({
  citySlug,
  cityName,
  videoPageHeight,
  onVideosLayout,
}) => {
  const data = useLazyLoadQuery<CityGuideNewQuery>(Query, { citySlug, first: PAGE_SIZE })
  const enableEditorialContent = useFeatureFlag("AREnableCityGuideEditorialContent")

  return (
    <Join separator={<Spacer y={4} />}>
      <>
        <CityGuideItinerariesRail citySlug={citySlug} me={data.me} />

        <CityGuideEventGuides citySlug={citySlug} city={data.city} query={data} />
      </>

      <CityGuideEvents citySlug={citySlug} cityName={cityName} city={data.city} />

      {/*
        Both sections come from the event the guides above belong to, but sit at the bottom of
        the screen rather than inside that dark block, which is where the designs put them.
        `Join` drops falsy children, so the flag being off leaves no stray separator behind.
      */}
      {!!enableEditorialContent && (
        // Measured, not self-reporting: `y` here is the offset within the scroll content,
        // which is what the scroll view needs to snap to. The videos themselves only know
        // their own size.
        <Flex
          onLayout={(event) => {
            const { y, height } = event.nativeEvent.layout
            onVideosLayout({ y, height })
          }}
        >
          <CityGuideEventVideos city={data.city} pageHeight={videoPageHeight} />
        </Flex>
      )}

      {!!enableEditorialContent && <CityGuideEventArticles citySlug={citySlug} city={data.city} />}
    </Join>
  )
}

const CityGuideNewSectionsWithSuspense = withSuspense({
  Component: CityGuideNewSections,
  // A spinner, so the initial load doesn't blank the screen outright.
  LoadingFallback: CityGuideNewPlaceholder,
  ErrorFallback: NoFallback,
})

export const CityGuideNew: React.FC = () => {
  const [showCityPicker, setShowCityPicker] = useState(false)

  /*
    The scroll view's own visible height — the screen without the animated header or the
    bottom tabs. Measured rather than assembled out of constants: the two pieces of chrome
    and the safe-area insets all move between devices, and a page built from the raw screen
    height runs under both and can never snap flush.
  */
  const [viewportHeight, setViewportHeight] = useState(0)
  const [videoSnapOffsets, setVideoSnapOffsets] = useState<number[]>([])

  /*
    Turns the videos block into a run of viewport-height pages the scroll can stop on. Paired
    with `snapToStart`/`snapToEnd` off, this is what makes the video behave like a story
    page: everything above and below scrolls freely, but a release that would leave the
    video half on screen resolves to either the page's top or the content after it.
  */
  const handleVideosLayout = useCallback(
    ({ y, height }: { y: number; height: number }) => {
      // The block collapses to nothing when the city has no video, and a zero-height
      // "page" would otherwise pin the scroll to a single offset.
      if (height < 1 || viewportHeight <= 0) {
        setVideoSnapOffsets((current) => (current.length ? [] : current))
        return
      }

      const pages = Math.max(1, Math.round(height / viewportHeight))
      const pageOffsets = Array.from({ length: pages + 1 }, (_, page) => y + page * viewportHeight)

      // Clamped so a video sitting near the top of the content can't produce an offset above
      // the scroll's own start, and dropped when it collides with the block's top — an
      // out-of-order or duplicated first offset would make `snapToStart` read the wrong end.
      const entryOffset = Math.max(0, y - viewportHeight * (1 - VIDEO_ENTRY_VISIBLE_RATIO))
      const offsets = entryOffset < y ? [entryOffset, ...pageOffsets] : pageOffsets

      setVideoSnapOffsets((current) =>
        current.length === offsets.length && current.every((offset, i) => offset === offsets[i])
          ? current
          : offsets
      )
    },
    [viewportHeight]
  )

  // Same order the map's City Guide uses: where you were last, else nearest, else New York.
  const initialCitySlug = useInitialLocation()
  const [city, setCity] = useState<CityData>(
    () => cities.find((option) => option.slug === initialCitySlug) ?? fallbackCity
  )

  const environment = useRelayEnvironment()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const citySlug = city?.slug ?? ""

  /*
    Refetched via `fetchQuery`, not by bumping fetchKey — a network-only re-render would
    suspend the whole screen and blank all three sections mid-pull instead of updating them
    in place (same pattern as `ItineraryScreen.tsx`'s own pull to refresh).
  */
  const refresh = useCallback(() => {
    setIsRefreshing(true)

    fetchQuery<CityGuideNewQuery>(
      environment,
      Query,
      { citySlug, first: PAGE_SIZE },
      { fetchPolicy: "network-only" }
    ).subscribe({
      complete: () => setIsRefreshing(false),
      error: () => setIsRefreshing(false),
    })
  }, [environment, citySlug])

  const onSelectCity = (newCity: CityData) => {
    setShowCityPicker(false)
    setCity(newCity)
    GlobalStore.actions.userPrefs.setPreviouslySelectedCitySlug(newCity.slug)
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.cityGuide,
        context_screen_owner_slug: citySlug,
      })}
    >
      <AddToItineraryProvider citySlug={citySlug} cityName={city?.name ?? ""} onSaved={refresh}>
        <Screen>
          <Screen.AnimatedHeader
            title={city?.name ?? ""}
            rightElements={
              <CityGuideCitySwitcherButton
                cityName={city?.name ?? ""}
                onPress={() => {
                  setShowCityPicker(true)
                }}
              />
            }
            onBack={goBack}
            hideTitle
          />

          <Screen.Body fullwidth>
            <Screen.ScrollView
              contentContainerStyle={{ paddingBottom: 40 }}
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
              // The scroll view's frame is the viewport the video pages have to match, so it
              // reports its own height rather than anyone computing it.
              onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
              // Undefined rather than an empty array when there is no video: an empty list
              // still puts the scroll view into snapping mode.
              snapToOffsets={videoSnapOffsets.length ? videoSnapOffsets : undefined}
              // Both off so the only snap points are the video's own pages — the rest of the
              // screen keeps scrolling freely.
              snapToStart={false}
              snapToEnd={false}
              decelerationRate="fast"
            >
              <CityGuideCityPicker
                showCityPicker={showCityPicker}
                setShowCityPicker={setShowCityPicker}
                selectedCity={city?.name ?? ""}
                onSelectCity={onSelectCity}
              />

              <CityGuideNewSectionsWithSuspense
                citySlug={citySlug}
                cityName={city?.name ?? ""}
                videoPageHeight={viewportHeight}
                onVideosLayout={handleVideosLayout}
              />
            </Screen.ScrollView>

            <CityGuideFloatingMapButton cityName={city?.name ?? ""} citySlug={citySlug} />
          </Screen.Body>
        </Screen>
      </AddToItineraryProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const Query = graphql`
  query CityGuideNewQuery($citySlug: String!, $first: Int!) {
    me {
      ...CityGuideItinerariesRail_me @arguments(citySlug: $citySlug, first: $first)
    }
    city(slug: $citySlug) {
      ...CityGuideEventGuides_city @arguments(first: $first)
      ...CityGuideEvents_city @arguments(first: $first)
      ...CityGuideEventVideos_city @arguments(first: $first)
      ...CityGuideEventArticles_city @arguments(first: $first)
    }
    ...CityGuideEventGuides_query @arguments(citySlug: $citySlug, first: $first)
  }
`
