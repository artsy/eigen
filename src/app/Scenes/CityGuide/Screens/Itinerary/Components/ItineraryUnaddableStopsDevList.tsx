import { Flex, Text } from "@artsy/palette-mobile"
import { useItineraryStopEntitiesState } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useDevToggle } from "app/utils/hooks/useDevToggle"

interface UnaddableStop {
  stop: ItineraryStop
  reason: "not an Artsy entity" | "lookup failed"
}

/**
 * Dev-only aid for auditing "Add Full List" gaps. Two distinct reasons a stop cannot be
 * added: it was never an Artsy entity to begin with (`saveTarget` is null, by design — a
 * cafe or address the guide author added), or it has a `saveTarget` but its lookup settled
 * as failed (see `ItineraryStopEntityResolvers`).
 *
 * Mounted directly on the itinerary screen, inside `ItineraryStopEntitiesProvider` and
 * outside the stop preview's bottom sheet: the sheet renders through a `@gorhom/portal`
 * `PortalHost`, which does not carry React context, so a context-dependent component mounted
 * there would silently render nothing.
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
