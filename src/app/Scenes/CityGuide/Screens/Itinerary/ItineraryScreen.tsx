import {
  BackButtonWithBackground,
  Button,
  Flex,
  Join,
  Screen,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { ItineraryScreenQuery } from "__generated__/ItineraryScreenQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { ItineraryPicker } from "app/Scenes/CityGuide/Components/ItineraryPicker"
import { MapView } from "app/Scenes/CityGuide/Components/Map/MapView"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { ItineraryShareButton } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryShareButton"
import { itineraryStopsToMapSections } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToMapSections"
import { goBack } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { MotiView } from "moti"
import { useCallback, useMemo, useState } from "react"
import { RefreshControl } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"

/** Screen.Header's bar height (palette Screen/constants.js:5), not exported from the package root. */
const NAVBAR_HEIGHT = 50

interface Props {
  citySlug: string
  itineraryId: string
  /**
   * Present when this screen was opened from a shared link to somebody else's personal
   * itinerary — `Query.itinerary` needs it to resolve one that isn't yours or curated, per
   * the schema: "Gravity returns 404 without it."
   */
  shareToken?: string
}

const Itinerary: React.FC<Props> = ({ citySlug, itineraryId, shareToken }) => {
  // An itinerary is addressed by its own id or slug and carries its city; `citySlug` only
  // looks the city's name up, for what a new itinerary is called when a custom stop is copied.
  const data = useLazyLoadQuery<ItineraryScreenQuery>(
    itineraryQuery,
    {
      id: itineraryId,
      citySlug,
      shareToken,
    },
    { fetchPolicy: "network-only" }
  )

  const itinerary = data.itinerary
  const [isMapView, setIsMapView] = useState(false)
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)

  const environment = useRelayEnvironment()
  const [isRefreshing, setIsRefreshing] = useState(false)

  /*
    Refetched via `fetchQuery`, not by bumping fetchKey — a network-only re-render would
    suspend the screen and blank the guide mid-pull instead of updating it in place.
  */
  const refresh = useCallback(async () => {
    setIsRefreshing(true)

    try {
      await fetchQuery<ItineraryScreenQuery>(
        environment,
        itineraryQuery,
        { id: itineraryId, citySlug, shareToken },
        { fetchPolicy: "network-only" }
      ).toPromise()
    } catch {
      // Keep the current itinerary visible when a refresh fails.
    } finally {
      setIsRefreshing(false)
    }
  }, [environment, itineraryId, citySlug, shareToken])

  // Android's hardware back has to agree with the on-screen one, or the two disagree
  // about whether the map is a mode or a screen. Returning false lets it pop as usual.
  useBackHandler(
    useCallback(() => {
      if (isMapView) {
        setIsMapView(false)
        return true
      }

      return false
    }, [isMapView])
  )
  const { top } = useSafeAreaInsets()
  const showRoute = useFeatureFlag("AREnableCityGuideItineraries")

  // Computed ahead of the null check to keep hook order stable.
  const mapSections = useMemo(
    () =>
      itinerary ? itineraryStopsToMapSections(itinerary, citySlug, data.city?.name ?? "") : [],
    [itinerary, citySlug, data.city?.name]
  )

  if (!itinerary) {
    return (
      <Screen>
        <Screen.Header onBack={goBack} />
        <Screen.Body>
          <Flex flex={1} alignItems="center" justifyContent="center">
            <Text variant="sm">This guide is no longer available.</Text>
          </Flex>
        </Screen.Body>
      </Screen>
    )
  }

  // Your own itinerary shows no order: it is an unordered list, so numbering would be noise.
  // A curated guide keeps it.
  const isEditorial = itinerary.isCurated
  // A section with nothing in it is nothing to show — not even its heading. Emptying one by
  // removing its last stop leaves it behind on the itinerary, so this is the common case.
  const sections = itinerary.sections.filter((section) => section.stops.length > 0)
  /*
    A guide always names its days. Your own itinerary usually has just the one section, whose
    name would be a redundant subheading over the whole list — but once it has several (a
    guide copied onto it brings its days along) they need their headings to be told apart.
  */
  const showSectionHeaders = isEditorial || sections.length > 1

  // Numbering runs continuously across sections, so each needs its running start.
  let runningTotal = 0
  const sectionStartNumbers = sections.map((section) => {
    const start = runningTotal + 1
    runningTotal += section.stops.length
    return start
  })

  return (
    <AddToItineraryProvider
      citySlug={itinerary.citySlug}
      cityName={data.city?.name ?? undefined}
      onSaved={refresh}
    >
      <Screen safeArea={false}>
        {/*
          The map fills the screen, so it gets a floating back button rather than a header
          bar: Screen.Header paints a solid background and can't be made transparent.
        */}
        {/* {!isMapView && <Screen.AnimatedHeader title={itinerary.title} hideLeftElements hideTitle />} */}

        <Flex
          style={{ top, position: "absolute", zIndex: 1000 }}
          // Screen.Header centres its back button inside a NAVBAR_HEIGHT bar at px={2} —
          // matching both keeps the button from jumping between list and map.
          height={NAVBAR_HEIGHT}
          justifyContent="center"
          px={2}
          // Always full width now: the share button sits on the right in both list and map
          // mode, not just when the map's itinerary picker is there too.
          left={0}
          right={0}
        >
          {/*
            On the map, back means "back to the list", not "leave the guide" — the map is a
            mode of this screen, not a screen of its own.
          */}
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
            <BackButtonWithBackground
              onPress={() => {
                if (isMapView) {
                  setIsMapView(false)
                  return
                }

                goBack()
              }}
            />

            <Flex flexDirection="row" alignItems="center" gap={1}>
              {/*
                Only on the map, and only for your own itineraries — the picker switches
                between yours, so it has nothing to offer on a curated guide.
              */}
              {!!isMapView && !isEditorial && (
                <ItineraryPicker
                  citySlug={itinerary.citySlug}
                  currentItineraryId={itinerary.internalID}
                  currentItineraryName={itinerary.title}
                />
              )}

              <ItineraryShareButton itinerary={itinerary} />
            </Flex>
          </Flex>
        </Flex>

        <Screen.Body fullwidth>
          {isMapView ? (
            <MapView
              sections={mapSections}
              selectedPlaceId={selectedStopId}
              onSelectPlace={setSelectedStopId}
              numbered={isEditorial}
              showRoute={showRoute}
              safeArea
            />
          ) : (
            <Screen.ScrollView
              contentContainerStyle={{ paddingBottom: 40 }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={refresh}
                  // Without this, the spinner sits right under the floating back/share bar
                  // above (`top` to `top + NAVBAR_HEIGHT`), which paints over it.
                  progressViewOffset={top + NAVBAR_HEIGHT}
                />
              }
            >
              <ItineraryHeader itinerary={itinerary} topInset={top + NAVBAR_HEIGHT} />

              <Flex px={2} pt={2}>
                <Join separator={<Spacer y={2} />}>
                  {sections.map((section, index) => (
                    <ItinerarySectionRow
                      key={section.internalID}
                      section={section}
                      sectionIndex={index}
                      startNumber={isEditorial ? sectionStartNumbers[index] : undefined}
                      showHeader={showSectionHeaders}
                      citySlug={itinerary.citySlug}
                      itineraryId={itineraryId}
                      shareToken={shareToken}
                      cityName={data.city?.name ?? ""}
                    />
                  ))}
                </Join>
              </Flex>
            </Screen.ScrollView>
          )}

          {/*
            Positioning copied from CityGuideFloatingMapButton for matching height. Not
            reused directly since that component hardcodes a navigate to /local-discovery.
          */}
          <MotiView
            from={{ opacity: 0.5, translateY: 0 }}
            animate={{ opacity: 1, translateY: -60 }}
            transition={{ type: "timing", duration: 300, delay: 200 }}
          >
            <Flex
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: -50,
                zIndex: 1000,
              }}
            >
              <Button
                testID="itinerary-view-toggle"
                size="small"
                onPress={() => setIsMapView((current) => !current)}
              >
                {isMapView ? "Show in List" : "Show in Map"}
              </Button>
            </Flex>
          </MotiView>
        </Screen.Body>
      </Screen>
    </AddToItineraryProvider>
  )
}

export const itineraryQuery = graphql`
  query ItineraryScreenQuery($id: String!, $citySlug: String!, $shareToken: String) {
    city(slug: $citySlug) {
      name
    }

    itinerary(id: $id, shareToken: $shareToken) {
      internalID
      isCurated
      citySlug
      title
      slug
      shareToken
      ...ItineraryHeader_itinerary
      ...ItineraryShareButton_itinerary

      sections {
        internalID
        title

        stops {
          internalID
          title
          address
          category
          note
          isFreeAdmission
          sourceURL
          eventType
          image {
            url(version: "small")
            blurhash
          }
          isOnMyItineraries
          myItineraries {
            internalID
          }

          event {
            __typename
            ... on ShowEventType {
              title
              eventType
              startAtISO: startAt
            }
            ... on FairEvent {
              name
              startAtISO: startAt
            }
          }
          latitude
          longitude

          startTime: startAt(format: "h:mma")
          endTime: endAt(format: "h:mma")

          startAtISO: startAt
          endAtISO: endAt

          item {
            __typename
            ... on Show {
              internalID
              slug
              name
              href
              isFreeAdmission
              exhibitionPeriod(format: SHORT)
              coverImage {
                url
                blurhash
              }
              partner {
                ... on Partner {
                  name
                }
                ... on ExternalPartner {
                  name
                }
              }
              location {
                name
                city
                coordinates {
                  lat
                  lng
                }
              }
            }
            ... on Fair {
              internalID
              slug
              name
              href
              exhibitionPeriod(format: SHORT)
              image {
                url
                blurhash
              }
              location {
                name
                city
                coordinates {
                  lat
                  lng
                }
              }
            }
            ... on Location {
              internalID
              name
              city
              address
              coordinates {
                lat
                lng
              }
              partner {
                slug
                name
                href
                profile {
                  image {
                    url
                    blurhash
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const ItineraryScreen = withSuspense({
  Component: Itinerary,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView error={fallbackProps.error} onRetry={fallbackProps.resetErrorBoundary} />
  ),
})
