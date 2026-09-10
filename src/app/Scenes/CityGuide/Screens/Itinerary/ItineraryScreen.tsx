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
import { ItineraryStopPreview } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopPreview"
import { ItineraryUnaddableStopsDevList } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryUnaddableStopsDevList"
import {
  ItineraryStopEntitiesProvider,
  useItineraryStopEntity,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { itineraryFromQuery } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryFromQuery"
import { itineraryStopsToMapSections } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopsToMapSections"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { goBack } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { MotiView } from "moti"
import { useCallback, useMemo, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

/** Screen.Header's bar height (palette Screen/constants.js:5), not exported from the package root. */
const NAVBAR_HEIGHT = 50

interface Props {
  citySlug: string
  itineraryId: string
}

const Itinerary: React.FC<Props> = ({ itineraryId }) => {
  // `citySlug` is not a query variable: an itinerary is addressed by its own id or slug, and
  // carries its city. The route keeps the slug in the path so the URL reads as a city's guide
  // and so a deep link matches artsy.net, not because the lookup needs it.
  const data = useLazyLoadQuery<ItineraryScreenQuery>(Query, { id: itineraryId })

  const itinerary = useMemo(
    () => (data.itinerary ? itineraryFromQuery(data.itinerary) : null),
    [data.itinerary]
  )
  const [isMapView, setIsMapView] = useState(false)
  const [previewStop, setPreviewStop] = useState<ItineraryStop | null>(null)
  // Lifted out of ItineraryMapView so the preview's "Show on map" can select a pin
  // as it switches views.
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)

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

  // Flattened once and shared by the provider, the resolvers and the rows below, so the
  // expected set (provider) and the queried set (resolvers) can never disagree. Computed
  // ahead of the null check so hook order stays stable regardless of whether the itinerary
  // resolves; it is simply empty when there is no itinerary.
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

  // Numbering runs continuously across sections, so each needs its running start.
  let runningTotal = 0
  const sectionStartNumbers = itinerary.sections.map((section) => {
    const start = runningTotal + 1
    runningTotal += section.stops.length
    return start
  })

  return (
    <ItineraryStopEntitiesProvider stops={stops}>
      <ItineraryStopEntityResolvers stops={stops} />
      <Screen safeArea={false}>
        {/*
          The map fills the screen, so it gets a floating back button over the map rather
          than a header bar: Screen.Header paints a solid background and cannot be made
          transparent through props. Same treatment CityGuideMapHeader gives the City
          Guide's own map.
        */}
        {/* {!isMapView && <Screen.AnimatedHeader title={itinerary.title} hideLeftElements hideTitle />} */}

        <Flex
          style={{ top, position: "absolute", zIndex: 1000 }}
          // Screen.Header centres its back button inside a NAVBAR_HEIGHT bar at px={2}
          // (palette Screen/Header.js:69, constants.js:5). Matching both keeps the
          // button from jumping when you toggle between list and map.
          height={NAVBAR_HEIGHT}
          justifyContent="center"
          px={2}
          // Full width only on the map, where the row also carries the itinerary picker at
          // its right. In list mode it stays as wide as the back button so it does not
          // swallow taps meant for the header beneath it.
          {...(isMapView ? { left: 0, right: 0 } : {})}
        >
          {/*
            On the map, back means "back to the list" rather than "leave the guide". The
            map is a mode of this screen, not a screen of its own, so popping the whole
            route would skip the itinerary the user came from.
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
              Only on the map, where the designs put it. The list already names the itinerary
              in its own header.
            */}
            {!!isMapView && (
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
              numbered
              showRoute={showRoute}
              safeArea
            />
          ) : (
            <Screen.ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <ItineraryHeader itinerary={itinerary} />

              <Flex px={2} pt={2}>
                <Join separator={<Spacer y={2} />}>
                  {itinerary.sections.map((section, index) => (
                    <ItinerarySectionRow
                      key={section.id}
                      section={section}
                      startNumber={sectionStartNumbers[index]}
                      onSelectStop={setPreviewStop}
                    />
                  ))}
                </Join>
              </Flex>

              <ItineraryUnaddableStopsDevList stops={stops} />
            </Screen.ScrollView>
          )}

          {/*
            Positioning copied from CityGuideFloatingMapButton so this sits at the same
            height as the City Guide's own floating button. Not reused directly because
            that component hardcodes a navigate to /local-discovery.
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
          <ItineraryStopPreviewWithEntity
            stop={previewStop}
            onClose={() => setPreviewStop(null)}
            onShowOnMap={(stopId) => {
              setPreviewStop(null)
              setSelectedStopId(stopId)
              setIsMapView(true)
            }}
          />
        </Screen.Body>
      </Screen>
    </ItineraryStopEntitiesProvider>
  )
}

/**
 * Looks up the previewed stop's entity from `ItineraryStopEntitiesProvider` and forwards it as
 * a prop, rather than letting `ItineraryStopPreview` read the context itself. The preview
 * renders through a `@gorhom/bottom-sheet` modal, which mounts its children behind a
 * `@gorhom/portal` `PortalHost` elsewhere in the tree — unlike `ReactDOM.createPortal`, that
 * does not carry React context across, so a context read from inside the sheet would always
 * see the default (empty) value. This component sits here, inside the provider and outside
 * the portal, where the context read still works.
 */
const ItineraryStopPreviewWithEntity: React.FC<{
  stop: ItineraryStop | null
  onClose: () => void
  onShowOnMap: (stopId: string) => void
}> = ({ stop, onClose, onShowOnMap }) => {
  const entity = useItineraryStopEntity(stop?.id ?? "")

  return (
    <ItineraryStopPreview stop={stop} onClose={onClose} onShowOnMap={onShowOnMap} entity={entity} />
  )
}

const Query = graphql`
  query ItineraryScreenQuery($id: String!) {
    itinerary(id: $id) {
      internalID
      citySlug
      name
      subtitle
      description
      authorName
      heroImage {
        resized(width: 1200) {
          url
        }
        url
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
          imageURL
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
            }
            ... on Fair {
              slug
              name
            }
            ... on Partner {
              slug
              name
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
