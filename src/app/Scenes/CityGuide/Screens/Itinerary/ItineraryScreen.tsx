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
import { ItineraryPicker } from "app/Scenes/CityGuide/Components/ItineraryPicker"
import { MapView } from "app/Scenes/CityGuide/Components/Map/MapView"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { ItineraryStopEntityResolvers } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopEntityResolvers"
import { ItineraryStopEntitiesProvider } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { itineraryFromQuery } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryFromQuery"
import { itineraryStopsToMapSections } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToMapSections"
import { goBack } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { MotiView } from "moti"
import { useCallback, useMemo, useRef, useState } from "react"
import { RefreshControl } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { fetchQuery, graphql, useLazyLoadQuery, useRelayEnvironment } from "react-relay"

/** Screen.Header's bar height (palette Screen/constants.js:5), not exported from the package root. */
const NAVBAR_HEIGHT = 50

interface Props {
  citySlug: string
  itineraryId: string
}

const Itinerary: React.FC<Props> = ({ citySlug, itineraryId }) => {
  // An itinerary is addressed by its own id or slug and carries its city; `citySlug` only
  // looks the city's name up, for what a new itinerary is called when a custom stop is copied.
  const data = useLazyLoadQuery<ItineraryScreenQuery>(itineraryQuery, { id: itineraryId, citySlug })

  const derived = useMemo(
    () => (data.itinerary ? itineraryFromQuery(data.itinerary) : null),
    [data.itinerary]
  )

  /*
    Kept when a re-read comes back empty: sections/stops have no schema `id`, so Relay keys
    them positionally — adding/removing a stop shifts those slots and could empty the guide.
  */
  const lastResolved = useRef(derived)

  if (derived?.sections.length) lastResolved.current = derived

  const itinerary = derived?.sections.length ? derived : lastResolved.current
  const [isMapView, setIsMapView] = useState(false)
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)

  const environment = useRelayEnvironment()
  const [isRefreshing, setIsRefreshing] = useState(false)

  /*
    Refetched via `fetchQuery`, not by bumping fetchKey — a network-only re-render would
    suspend the screen and blank the guide mid-pull instead of updating it in place.
  */
  const refresh = useCallback(() => {
    setIsRefreshing(true)

    fetchQuery<ItineraryScreenQuery>(
      environment,
      itineraryQuery,
      { id: itineraryId, citySlug },
      { fetchPolicy: "network-only" }
    ).subscribe({
      complete: () => setIsRefreshing(false),
      error: () => setIsRefreshing(false),
    })
  }, [environment, itineraryId, citySlug])

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
  const showRoute = useFeatureFlag("AREnableCityGuideItineraryRoute")

  // Flattened once and shared by the provider, resolvers, and rows, so the expected and
  // queried sets can never disagree. Computed ahead of the null check to keep hook order stable.
  const stops = useMemo(
    () => itinerary?.sections.flatMap((section) => section.stops) ?? [],
    [itinerary]
  )

  // Same reasoning: computed ahead of the null check to keep hook order stable.
  const mapSections = useMemo(
    () => (itinerary ? itineraryStopsToMapSections(itinerary) : []),
    [itinerary]
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

  // Your own itinerary shows no order and no section headings: it is a single unordered list,
  // so numbering and a section name would both be noise. A curated guide keeps both.
  const isEditorial = itinerary.isCurated

  // Numbering runs continuously across sections, so each needs its running start.
  let runningTotal = 0
  const sectionStartNumbers = itinerary.sections.map((section) => {
    const start = runningTotal + 1
    runningTotal += section.stops.length
    return start
  })

  return (
    <ItineraryStopEntitiesProvider key={itineraryId} stops={stops}>
      <ItineraryStopEntityResolvers stops={stops} />
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
          // Full width only on the map, where the row also carries the itinerary picker. In
          // list mode it stays back-button width so it doesn't swallow taps meant for the header.
          {...(isMapView ? { left: 0, right: 0 } : {})}
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

            {/*
              Only on the map, and only for your own itineraries — the picker switches
              between yours, so it has nothing to offer on a curated guide.
            */}
            {!!isMapView && !isEditorial && (
              <ItineraryPicker
                citySlug={itinerary.citySlug}
                currentItineraryId={itinerary.id}
                currentItineraryName={itinerary.title}
              />
            )}
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
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
            >
              <ItineraryHeader itinerary={itinerary} />

              <Flex px={2} pt={2}>
                <Join separator={<Spacer y={2} />}>
                  {itinerary.sections.map((section, index) => (
                    <ItinerarySectionRow
                      key={section.id}
                      section={section}
                      startNumber={isEditorial ? sectionStartNumbers[index] : undefined}
                      showHeader={isEditorial}
                      citySlug={itinerary.citySlug}
                      itineraryId={itineraryId}
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
    </ItineraryStopEntitiesProvider>
  )
}

export const itineraryQuery = graphql`
  query ItineraryScreenQuery($id: String!, $citySlug: String!) {
    city(slug: $citySlug) {
      name
    }

    itinerary(id: $id) {
      internalID
      isCurated
      citySlug
      title
      subtitle
      description
      authorName
      heroImage {
        url(version: "large")
      }

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
              slug
              name
              href
              isFreeAdmission
              coverImage {
                url
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
              slug
              name
              href
              image {
                url
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
