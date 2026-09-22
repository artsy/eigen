import { ChevronDownIcon, ChevronUpIcon } from "@artsy/icons/native"
import { Flex, Join, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { ItineraryStopRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopRow"
import { itinerarySectionTitle } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import {
  ItineraryScrollHandlers,
  ItinerarySection,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { RefObject, useEffect, useMemo, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { SortableContainer, SortableItem, useSortableList } from "react-native-drax"

/** Drax sorts the stop ids; the row each one renders is looked up by id below. */
const stopIDKey = (stopID: string) => stopID

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
  /** False on a curated guide or a shared link — neither is yours to reorder. */
  canReorder?: boolean
  /** The screen's scroll view, which drax scrolls on its own while a stop is held near an edge. */
  scrollRef: RefObject<ScrollView | null>
  /** Every section shares the screen's one scroll view, so each registers its own listeners
   *  with it rather than owning a scroll view of its own. */
  registerScrollHandlers: (sectionID: string, handlers: ItineraryScrollHandlers | null) => void
  /** Fires once a drag is dropped on a real move — a drop back on the source index never
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
  canReorder = false,
  scrollRef,
  registerScrollHandlers,
  onReorderStop,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const title = itinerarySectionTitle(section, sectionIndex)
  const sectionID = section.internalID

  const stopIDsKey = section.stops.map((stop) => stop.internalID).join(",")
  /*
    The screen rebuilds `section.stops` on every render (it overlays the locally dragged order
    on Relay's data fresh each time), so a plain `.map` here would hand drax a new array every
    render and it would read each one as an external data change, dropping its shifts. Pinning
    the identity to the ids themselves keeps it stable until the order actually changes.
  */
  const stopIDs = useMemo(
    () => section.stops.map((stop) => stop.internalID),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopIDsKey]
  )
  // Keyed on the stops themselves, not on `stopIDsKey` like `stopIDs` above: a stop's fields
  // change without its id doing so (saving one flips `isOnMyItineraries`), and the id key
  // would then hand the rows the stop as it was before.
  const stopsByID = useMemo(
    () => new Map(section.stops.map((stop) => [stop.internalID, stop])),
    [section.stops]
  )

  const sortable = useSortableList<string>({
    data: stopIDs,
    keyExtractor: stopIDKey,
    onReorder: ({ fromIndex, toIndex }) => {
      const stopID = stopIDs[fromIndex]

      if (!stopID) return

      onReorderStop?.(sectionID, stopID, fromIndex, toIndex)
    },
  })

  // The handle is rebuilt each render, but everything the listeners touch behind it (shared
  // values, refs) is stable — so register once and read the current handle through this.
  // A collapsed section keeps its listeners registered, which is deliberate: both only write
  // to those shared values/refs, which nothing reads until a drag starts, and a collapsed
  // section renders no `SortableItem` to start one from. Re-registering on collapse would
  // churn the screen's map for nothing.
  const sortableRef = useRef(sortable)
  sortableRef.current = sortable

  useEffect(() => {
    registerScrollHandlers(sectionID, {
      onScroll: (event) => sortableRef.current.onScroll(event),
      onContentSizeChange: (width, height) =>
        sortableRef.current.onContentSizeChange(width, height),
    })

    return () => registerScrollHandlers(sectionID, null)
  }, [registerScrollHandlers, sectionID])

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
        <SortableContainer sortable={sortable} scrollRef={scrollRef}>
          <Join separator={<Spacer y={1} />}>
            {/*
              Rendered from drax's own copy of the ids rather than `section.stops`: after a drop
              it holds the rows at their original positions and moves them with transforms, so
              rendering our reordered array here would apply the same move twice.
            */}
            {sortable.data.map((stopID, index) => {
              const stop = stopsByID.get(stopID)

              if (!stop) return null

              return (
                <SortableItem key={stopID} sortable={sortable} index={index} draggable={canReorder}>
                  <ItineraryStopRow
                    stop={stop}
                    // Only a curated guide numbers its stops, and a curated guide is never
                    // reorderable, so this index is always the displayed position.
                    number={startNumber === undefined ? undefined : startNumber + index}
                    citySlug={citySlug}
                    itineraryId={itineraryId}
                    itinerarySlug={itinerarySlug}
                    shareToken={shareToken}
                    cityName={cityName}
                    isCuratedGuide={isCuratedGuide}
                  />
                </SortableItem>
              )
            })}
          </Join>
        </SortableContainer>
      )}
    </Flex>
  )
}
