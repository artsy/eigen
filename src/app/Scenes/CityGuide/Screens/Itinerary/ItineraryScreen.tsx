import { Flex, Join, Screen, Spacer, Text } from "@artsy/palette-mobile"
import { ItineraryHeader } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryHeader"
import { ItinerarySectionRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItinerarySectionRow"
import { getMockItinerary } from "app/Scenes/CityGuide/Screens/Itinerary/utils/mockItineraries"
import { goBack } from "app/system/navigation/navigate"

interface Props {
  citySlug: string
  itineraryId: string
}

export const ItineraryScreen: React.FC<Props> = ({ citySlug, itineraryId }) => {
  // TODO: Replace with a Relay query once the itinerary schema lands.
  const itinerary = getMockItinerary(citySlug, itineraryId)

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
      </Screen.Body>
    </Screen>
  )
}
