import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import {
  ItinerarySection,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useState } from "react"
import { TouchableOpacity } from "react-native"

interface Props {
  section: ItinerarySection
  /** Flattened index of this section's first stop, so numbering runs across sections. */
  startNumber: number
  onSelectStop: (stop: ItineraryStop) => void
}

export const ItinerarySectionRow: React.FC<Props> = ({ section, startNumber, onSelectStop }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Flex>
      <TouchableOpacity
        testID="itinerary-section-header"
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded((expanded) => !expanded)}
      >
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={1}>
          <Text variant="sm-display">{section.title}</Text>
          {isExpanded ? <ChevronUpIcon fill="mono60" /> : <ChevronDownIcon fill="mono60" />}
        </Flex>
      </TouchableOpacity>

      {!!isExpanded && (
        <Join separator={<Spacer y={1} />}>
          {section.stops.map((stop, index) => (
            <ItineraryStopRow
              key={stop.id}
              stop={stop}
              number={startNumber + index}
              onPress={onSelectStop}
            />
          ))}
        </Join>
      )}
    </Flex>
  )
}
