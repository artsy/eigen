import { ItineraryStopSwipeRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSwipeRow"
import { DragAutoScroll } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/useDragAutoScroll"
import { dropIndex, siblingShifts } from "app/Scenes/CityGuide/Screens/Itinerary/utils/reorderStops"
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
 * out into. Used for every return to rest: the dragged row, the siblings it pushed aside, and
 * the auto-scroll offset.
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
  /** This row's position among its section's stops right now — read on the JS thread only
   *  when the gesture ends, so a reorder mid-drag from elsewhere can't leave it stale. */
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
  /** -1 when nothing in the section is being dragged. */
  draggedIndex: SharedValue<number>
  dragOffsetY: SharedValue<number>
  /** The gap `Join`'s `Spacer` leaves between rows, folded into the drop-position math. */
  gap: number
  /** Scrolls the containing scroll view while the drag is held near its top or bottom edge.
   *  Absent wherever the rows aren't inside one this screen owns. */
  dragAutoScroll?: DragAutoScroll
  onDragEnd: (fromIndex: number, offsetY: number) => void
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
    .onEnd((event) => {
      runOnJS(onDragEnd)(index, event.translationY + (dragAutoScroll?.offset.get() ?? 0))
    })
    .onFinalize(() => {
      if (dragAutoScroll) {
        runOnJS(dragAutoScroll.stop)()
        dragAutoScroll.offset.set(withSpring(0, SETTLE_SPRING))
      }

      lift.set(withTiming(0, LIFT_TIMING))
      ownOffsetY.set(withSpring(0, SETTLE_SPRING))
      // The siblings' shifts are read off `dragOffsetY`, so they unwind with it rather than
      // snapping back the moment the finger lifts. `draggedIndex` only clears once that has
      // finished, which is also what keeps this row above them until it has landed.
      dragOffsetY.set(
        withSpring(0, SETTLE_SPRING, (finished) => {
          if (finished) draggedIndex.set(-1)
        })
      )
    })

  /** The whole-row step this sibling should sit at while another row is dragged over it. */
  const shiftTarget = useDerivedValue(() => {
    const from = draggedIndex.get()

    if (from === index || from === -1) return 0

    const heights = rowHeights.get()
    const offsetY = dragOffsetY.get() + (dragAutoScroll?.offset.get() ?? 0)
    const target = dropIndex(heights, from, offsetY, gap)
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
