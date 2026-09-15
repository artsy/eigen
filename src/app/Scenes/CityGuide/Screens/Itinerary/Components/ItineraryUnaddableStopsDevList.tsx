import { Flex, Text } from "@artsy/palette-mobile"
import { useItineraryStopEntitiesState } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useDevToggle } from "app/utils/hooks/useDevToggle"

interface UnaddableStop {
  stop: ItineraryStop
  reason: "not an Artsy entity" | "lookup failed"
}

/**
 * Dev-only aid for auditing "Add Full List" gaps — a stop with no `saveTarget`, or one whose
 * lookup failed. Mounted outside the stop preview's `@gorhom/portal` sheet, which drops React context.
 */
export const ItineraryUnaddableStopsDevList: React.FC<{ stops: ItineraryStop[] }> = ({ stops }) => {
  const showUnaddableStops = useDevToggle("DTShowItineraryUnaddableStops")
  const { failedStopIds } = useItineraryStopEntitiesState()

  if (!showUnaddableStops) {
    return null
  }

  const failedIds = new Set(failedStopIds)

  const unaddable: UnaddableStop[] = stops.reduce<UnaddableStop[]>((acc, stop) => {
    if (!stop.saveTarget) {
      acc.push({ stop, reason: "not an Artsy entity" })
    } else if (failedIds.has(stop.id)) {
      acc.push({ stop, reason: "lookup failed" })
    }

    return acc
  }, [])

  if (unaddable.length === 0) {
    return (
      <Flex p={2} testID="itinerary-unaddable-stops-dev-list">
        <Text variant="xs" color="mono60">
          DEV: All stops can be added
        </Text>
      </Flex>
    )
  }

  return (
    <Flex p={2} testID="itinerary-unaddable-stops-dev-list">
      <Text variant="xs" color="mono60">
        DEV: Stops that can't be added
      </Text>

      {unaddable.map(({ stop, reason }) => (
        <Text key={stop.id} variant="xs" color="mono60">
          {`${stop.title} — ${reason}`}
        </Text>
      ))}
    </Flex>
  )
}
