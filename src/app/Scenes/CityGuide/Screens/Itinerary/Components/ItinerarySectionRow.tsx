import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Join, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { itinerarySectionTitle } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { useState } from "react"

interface Props {
  section: ItinerarySection
  /** Position among sections — used only for the nullable-title fallback label. */
  sectionIndex: number
  /**
   * Flattened index of this section's first stop, so numbering runs across sections. Absent
   * on your own itinerary, which shows no order.
   */
  startNumber?: number
  /**
   * The collapsible section heading. Hidden on your own itinerary while it has a single
   * section, whose name would be a redundant subheading over the whole list.
   */
  showHeader?: boolean
  /** Passed through to the rows, which address a custom stop's screen by itinerary. */
  citySlug: string
  itineraryId: string
  shareToken?: string
  /** What a new itinerary gets called when a custom stop is copied onto one. */
  cityName: string
}

export const ItinerarySectionRow: React.FC<Props> = ({
  section,
  sectionIndex,
  startNumber,
  showHeader = true,
  citySlug,
  itineraryId,
  shareToken,
  cityName,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const title = itinerarySectionTitle(section, sectionIndex)

  return (
    <Flex>
      {!!showHeader && (
        <Touchable
          testID="itinerary-section-header"
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          onPress={() => setIsExpanded((expanded) => !expanded)}
        >
          <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={1}>
            <Text variant="sm-display">{title}</Text>
            {isExpanded ? <ChevronUpIcon fill="mono60" /> : <ChevronDownIcon fill="mono60" />}
          </Flex>
        </Touchable>
      )}

      {!!isExpanded && (
        <Join separator={<Spacer y={1} />}>
          {section.stops.map((stop, index) => (
            <ItineraryStopRow
              key={stop.internalID}
              stop={stop}
              number={startNumber === undefined ? undefined : startNumber + index}
              citySlug={citySlug}
              itineraryId={itineraryId}
              shareToken={shareToken}
              cityName={cityName}
            />
          ))}
        </Join>
      )}
    </Flex>
  )
}
