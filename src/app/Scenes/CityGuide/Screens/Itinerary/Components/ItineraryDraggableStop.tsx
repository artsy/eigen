import { ItineraryStopSwipeRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSwipeRow"
import { DragAutoScroll } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/useDragAutoScroll"
import {
  draggedShift,
  dropIndex,
  isDragJitter,
  siblingShifts,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/reorderStops"
import { useRef } from "react"
import { LayoutChangeEvent } from "react-native"
import { Gesture } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

/**
 * Critically damped — `damping` is exactly `2 * sqrt(stiffness * mass)` — so a row eases home
 * in about a quarter of a second without overshooting past a slot it has only just been laid
 * out into. Used for every settle: the dragged row into the slot it was dropped on, the
 * siblings it pushed aside, and the auto-scroll offset.
 */
const SETTLE_SPRING = { damping: 20, stiffness: 200, mass: 0.5 } as const

/** The dragged row grows by this much — enough to read as picked up, not as a different size. */
const LIFT_SCALE = 0.025
/** A heavier version of City Guide's `Dropshadow/100`, which `StopCard` already wears at rest. */
const LIFT_SHADOW_OPACITY = 0.16
const LIFT_SHADOW_RADIUS = 12
const LIFT_ELEVATION = 6
const LIFT_TIMING = { duration: 150 } as const

interface Props {
  stopID: string
  citySlug: string
  /** This row's slot among its section's stops. `Join` re-keys these rows positionally, so a
   *  slot keeps its component instance across a reorder and only its `stopID` changes. */
  index: number
  canDelete: boolean
  /** False on a curated guide, a shared link, or a collapsed section — none of those bind the
   *  drag gesture at all, matching the swipe row's own `canDelete` gate. */
  canReorder: boolean
  isSwipingActive?: boolean
  onSwipeBegin: (id: string) => void
  onDeleted?: (id: string) => void
  /** Owned by the section, not this row, so every row's shift math can see every row's height. */
  rowHeights: SharedValue<number[]>
  /** -1 when nothing in the section is being dragged. Stays set for the whole settle, and is
   *  only cleared by the render that lands the new order. */
  draggedIndex: SharedValue<number>
  dragOffsetY: SharedValue<number>
  /** The slot the drop chose, from the moment the finger lifts until the settle has landed;
   *  -1 the rest of the time. It holds the siblings still while the dragged row comes to rest,
   *  which the live drag offset alone can't do once auto-scroll starts unwinding. */
  settleToIndex: SharedValue<number>
  /** The gap `Join`'s `Spacer` leaves between rows, folded into the drop-position math. */
  gap: number
  /** Scrolls the containing scroll view while the drag is held near its top or bottom edge.
   *  Absent wherever the rows aren't inside one this screen owns. */
  dragAutoScroll?: DragAutoScroll
  /** Fires once the dropped row has settled into `toIndex`'s slot, not the moment the finger
   *  lifts — reordering the list under a row that is still moving is what made it appear to
   *  jump back to where it came from. */
  onDragEnd: (fromIndex: number, toIndex: number) => void
}

/**
 * Hold-and-drag wrapper for one itinerary stop row (FIREWORKS-42), composed with FIREWORKS-41's
 * swipe-to-delete on the very same row via `Gesture.Race` inside `ItineraryStopSwipeRow` — see
 * that component's `dragGesture` prop for why the race lives there rather than here.
 *
 * Rows are not absolutely positioned: heights vary with wrapped titles, so this only ever
 * shifts a row's own `translateY` within the normal flex flow, leaving the layout itself alone
 * until the drop actually reorders the underlying list.
 */
export const ItineraryDraggableStop: React.FC<React.PropsWithChildren<Props>> = ({
  stopID,
  citySlug,
  index,
  canDelete,
  canReorder,
  isSwipingActive,
  onSwipeBegin,
  onDeleted,
  rowHeights,
  draggedIndex,
  dragOffsetY,
  settleToIndex,
  gap,
  dragAutoScroll,
  onDragEnd,
  children,
}) => {
  const ownOffsetY = useSharedValue(0)
  /** 0 at rest, 1 while this row is held — drives the scale and shadow of the lift. */
  const lift = useSharedValue(0)
  /** Where a sibling has eased to, as opposed to the whole-row step it is easing towards. */
  const shift = useSharedValue(0)

  /*
    `Join` re-keys these rows positionally, so a reorder doesn't move this component instance —
    it hands this slot a different stop. The offsets this slot is carrying got the previous
    stop to where the new layout now puts it, so they belong to that stop, not to this one,
    which is already exactly where it should be. Dropping them in the same render the `stopID`
    prop changes is what keeps the swap from painting: a frame later and the row would flick
    back a slot before easing forward again. Same trick, same reason, as the swipe row's own
    `previousStopID` reset.
  */
  const previousStopID = useRef(stopID)
  if (previousStopID.current !== stopID) {
    previousStopID.current = stopID
    ownOffsetY.set(0)
    shift.set(0)
    lift.set(0)
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const heights = rowHeights.get().slice()
    heights[index] = event.nativeEvent.layout.height
    rowHeights.set(heights)
  }

  // No offset threshold, unlike the swipe pan's `activeOffsetX` — this should lose to a real
  // horizontal flick and only win once the finger has stayed put long enough to count as a
  // hold, per `Gesture.Race`'s "first to activate wins" rule.
  const drag = Gesture.Pan()
    .activateAfterLongPress(300)
    .withTestId(`drag-itinerary-stop-${stopID}`)
    .onStart((event) => {
      draggedIndex.set(index)
      settleToIndex.set(-1)
      lift.set(withTiming(1, LIFT_TIMING))

      if (dragAutoScroll) {
        dragAutoScroll.fingerY.set(event.absoluteY)
        runOnJS(dragAutoScroll.start)()
      }
    })
    .onUpdate((event) => {
      dragAutoScroll?.fingerY.set(event.absoluteY)
      ownOffsetY.set(event.translationY)
      dragOffsetY.set(event.translationY)
    })
    // Where the row lands is decided here, on the UI thread, so the settle can start from the
    // finger's last position without waiting on a round trip to the JS thread.
    .onEnd((event) => {
      const offsetY = event.translationY + (dragAutoScroll?.offset.get() ?? 0)

      settleToIndex.set(
        isDragJitter(offsetY) ? index : dropIndex(rowHeights.get(), index, offsetY, gap)
      )
    })
    .onFinalize(() => {
      // A cancelled gesture never reaches `onEnd`, and belongs back where it started.
      if (settleToIndex.get() < 0) settleToIndex.set(index)

      const toIndex = settleToIndex.get()

      if (dragAutoScroll) {
        runOnJS(dragAutoScroll.stop)()
        dragAutoScroll.offset.set(withSpring(0, SETTLE_SPRING))
      }

      lift.set(withTiming(0, LIFT_TIMING))

      // Carries on from wherever the finger left the row, into the slot it was dropped on —
      // never back to where the drag started. `draggedIndex` and the siblings' shifts hold
      // still throughout, so the row stays above them and nothing resets under it; the list
      // itself only reorders once this has landed.
      const settleTarget = draggedShift(rowHeights.get(), index, toIndex, gap)

      ownOffsetY.set(
        withSpring(settleTarget, SETTLE_SPRING, (finished) => {
          if (finished) runOnJS(onDragEnd)(index, toIndex)
        })
      )
    })

  /** The whole-row step this sibling should sit at while another row is dragged over it. */
  const shiftTarget = useDerivedValue(() => {
    const from = draggedIndex.get()

    if (from === index || from === -1) return 0

    const heights = rowHeights.get()
    const settling = settleToIndex.get()
    // Once the finger is up the drop is decided, and reading the live offset again would only
    // walk this sibling back out of place as the auto-scroll offset unwinds to zero.
    const target =
      settling >= 0
        ? settling
        : dropIndex(heights, from, dragOffsetY.get() + (dragAutoScroll?.offset.get() ?? 0), gap)
    const shifts = siblingShifts(heights, from, target, gap)

    return shifts[index] ?? 0
  })

  // Springing from the reaction rather than from the derived value itself: the target only
  // changes in whole-row steps, so the animation starts once per step instead of restarting
  // on every frame of the drag.
  useAnimatedReaction(
    () => shiftTarget.get(),
    (target, previous) => {
      if (target === previous) return

      shift.set(withSpring(target, SETTLE_SPRING))
    }
  )

  const dragTranslateY = useDerivedValue(() => {
    if (draggedIndex.get() !== index) return shift.get()

    // The container scrolling out from under the row is the same thing, to the row, as the
    // finger having moved that much further.
    return ownOffsetY.get() + (dragAutoScroll?.offset.get() ?? 0)
  })

  const containerStyle = useAnimatedStyle(() => {
    // True for the whole drag *and* the settle after it, so the row stays over the ones it is
    // still sliding past. It only goes false on the render that lands the new order, by which
    // point the row is at rest in its own slot and has nothing left to overlap.
    const isDragged = draggedIndex.get() === index
    const progress = lift.get()

    return {
      zIndex: isDragged ? 1 : 0,
      // Android ignores the shadow properties and uses elevation for stacking order too,
      // which is why a dragged row keeps a floor of 1 whatever the lift is doing.
      elevation: isDragged ? 1 + LIFT_ELEVATION * progress : 0,
      transform: [{ scale: 1 + LIFT_SCALE * progress }],
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: LIFT_SHADOW_OPACITY * progress,
      shadowRadius: LIFT_SHADOW_RADIUS,
    }
  })

  if (!canReorder) {
    return (
      <ItineraryStopSwipeRow
        stopID={stopID}
        citySlug={citySlug}
        canDelete={canDelete}
        isSwipingActive={isSwipingActive}
        onSwipeBegin={onSwipeBegin}
        onDeleted={onDeleted}
      >
        {children}
      </ItineraryStopSwipeRow>
    )
  }

  return (
    <Animated.View onLayout={onLayout} style={containerStyle}>
      <ItineraryStopSwipeRow
        stopID={stopID}
        citySlug={citySlug}
        canDelete={canDelete}
        isSwipingActive={isSwipingActive}
        onSwipeBegin={onSwipeBegin}
        onDeleted={onDeleted}
        dragGesture={drag}
        dragTranslateY={dragTranslateY}
      >
        {children}
      </ItineraryStopSwipeRow>
    </Animated.View>
  )
}
