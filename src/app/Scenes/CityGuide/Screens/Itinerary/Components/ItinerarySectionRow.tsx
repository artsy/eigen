import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Join, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { ItineraryDraggableStop } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryDraggableStop"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { itinerarySectionTitle } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { ItinerarySection } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { dropIndex } from "app/Scenes/CityGuide/Screens/Itinerary/utils/reorderStops"
import { useEffect, useState } from "react"
import { useSharedValue } from "react-native-reanimated"

/** Approximates the `Join`'s `Spacer y={1}` gap below — folded into the drag's drop-position
 *  math for a smoother feel; the actual reorder decision doesn't depend on this being exact. */
const SECTION_ROW_GAP = 8

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
  /** The itinerary's own slug, threaded through to each row's save control for tracking only. */
  itinerarySlug?: string
  shareToken?: string
  /** What a new itinerary gets called when a custom stop is copied onto one. */
  cityName: string
  /** Whether this section belongs to a curated guide's own stop list, rather than the
   *  viewer's personal itinerary. */
  isCuratedGuide?: boolean
  /** False on a curated guide or a shared link — neither is yours to edit. */
  canDelete?: boolean
  /** Same ownership gate as `canDelete` — reordering somebody else's guide isn't yours to do
   *  either. Kept as its own prop since the two are conceptually separate affordances that
   *  happen to share a gate today, not because they're expected to diverge. */
  canReorder?: boolean
  /** The stop id whose swipe row is currently open, so opening another one closes it. */
  swipingStopID?: string | null
  onSwipeBegin?: (id: string) => void
  onStopDeleted?: (id: string) => void
  /** Fires once a hold-and-drag ends on a real move — a drop back on the source index never
   *  calls this. `fromIndex`/`toIndex` are both positions within this section only; there is
   *  no cross-section drag, since `updateItineraryStopInput` has no section field to move one. */
  onReorderStop?: (sectionID: string, stopID: string, fromIndex: number, toIndex: number) => void
}

export const ItinerarySectionRow: React.FC<Props> = ({
  section,
  sectionIndex,
  startNumber,
  showHeader = true,
  citySlug,
  itineraryId,
  itinerarySlug,
  shareToken,
  cityName,
  isCuratedGuide = false,
  canDelete = false,
  canReorder = false,
  swipingStopID,
  onSwipeBegin,
  onStopDeleted,
  onReorderStop,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const title = itinerarySectionTitle(section, sectionIndex)

  // Shared across every row in the section (not owned by any one row) so a dragged row's
  // shift math can see every row's measured height, and so only one row can be "the" dragged
  // one at a time.
  const rowHeights = useSharedValue<number[]>(section.stops.map(() => 0))
  const draggedIndex = useSharedValue(-1)
  const dragOffsetY = useSharedValue(0)

  // Reset when the stop count changes (added, swipe-deleted, or reordered elsewhere) — heights
  // are read by index, and a stale array of the wrong length would misindex the shift math.
  useEffect(() => {
    rowHeights.set(section.stops.map(() => 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.stops.length])

  const handleDragEnd = (fromIndex: number, offsetY: number) => {
    if (!onReorderStop) return

    const heights = rowHeights.get()
    const toIndex = dropIndex(heights, fromIndex, offsetY, SECTION_ROW_GAP)

    if (toIndex === fromIndex) return

    const stop = section.stops[fromIndex]

    if (!stop) return

    onReorderStop(section.internalID, stop.internalID, fromIndex, toIndex)
  }

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

      {/* Reorder only binds while the section is expanded — collapsed rows aren't rendered at
          all here, so there is nothing further to gate. */}
      {!!isExpanded && (
        <Join separator={<Spacer y={1} />}>
          {section.stops.map((stop, index) => (
            <ItineraryDraggableStop
              key={stop.internalID}
              stopID={stop.internalID}
              citySlug={citySlug}
              index={index}
              canDelete={canDelete}
              canReorder={canReorder}
              isSwipingActive={swipingStopID === stop.internalID}
              onSwipeBegin={onSwipeBegin ?? (() => undefined)}
              onDeleted={onStopDeleted}
              rowHeights={rowHeights}
              draggedIndex={draggedIndex}
              dragOffsetY={dragOffsetY}
              gap={SECTION_ROW_GAP}
              onDragEnd={handleDragEnd}
            >
              <ItineraryStopRow
                stop={stop}
                number={startNumber === undefined ? undefined : startNumber + index}
                citySlug={citySlug}
                itineraryId={itineraryId}
                itinerarySlug={itinerarySlug}
                shareToken={shareToken}
                cityName={cityName}
                isCuratedGuide={isCuratedGuide}
              />
            </ItineraryDraggableStop>
          ))}
        </Join>
      )}
    </Flex>
  )
}
