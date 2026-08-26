import { Button, Flex, Join, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { ItineraryMapView } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryMapView"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { goBack } from "app/system/navigation/navigate"
import { MotiView } from "moti"
import { useState } from "react"

interface Props {
  citySlug: string
  itineraryId: string
}

export const ItineraryScreen: React.FC<Props> = ({ citySlug, itineraryId }) => {
  // TODO: Replace with a Relay query once the itinerary schema lands.
  const itinerary = getMockItinerary(citySlug, itineraryId)
  const [isMapView, setIsMapView] = useState(false)

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
    <Screen>
      <Screen.AnimatedHeader title={itinerary.title} onBack={goBack} hideTitle />

      <Screen.Body fullwidth>
        {isMapView ? (
          <ItineraryMapView itinerary={itinerary} />
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
      </Screen.Body>
    </Screen>
  )
}
