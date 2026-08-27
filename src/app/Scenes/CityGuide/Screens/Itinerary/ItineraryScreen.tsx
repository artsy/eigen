import {
  BackButtonWithBackground,
  Button,
  Flex,
  Join,
  Screen,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { ItineraryMapView } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapView"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { ItineraryStopPreview } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopPreview"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { goBack } from "app/system/navigation/navigate"
import { useBackHandler } from "app/utils/hooks/useBackHandler"
import { MotiView } from "moti"
import { useCallback, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

/** Screen.Header's bar height (palette Screen/constants.js:5), not exported from the package root. */
const NAVBAR_HEIGHT = 50

interface Props {
  citySlug: string
  itineraryId: string
}

export const ItineraryScreen: React.FC<Props> = ({ citySlug, itineraryId }) => {
  // TODO: Replace with a Relay query once the itinerary schema lands.
  const itinerary = getMockItinerary(citySlug, itineraryId)
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
      >
        {/*
          On the map, back means "back to the list" rather than "leave the guide". The
          map is a mode of this screen, not a screen of its own, so popping the whole
          route would skip the itinerary the user came from.
        */}
        <BackButtonWithBackground
          onPress={() => {
            if (isMapView) {
              setIsMapView(false)
              return
            }

            goBack()
          }}
        />
      </Flex>

      <Screen.Body fullwidth>
        {isMapView ? (
          <ItineraryMapView
            itinerary={itinerary}
            selectedStopId={selectedStopId}
            onSelectStop={setSelectedStopId}
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
        <ItineraryStopPreview
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
  )
}
