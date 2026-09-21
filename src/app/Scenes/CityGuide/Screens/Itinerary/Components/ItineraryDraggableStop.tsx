import { ItineraryStopSwipeRow } from "app/Scenes/CityGuide/Screens/Itinerary/Components/ItineraryStopSwipeRow"
import { dropIndex, siblingShifts } from "app/Scenes/CityGuide/Screens/Itinerary/utils/reorderStops"
import { LayoutChangeEvent } from "react-native"
import { Gesture } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated"

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
  onDragEnd,
  children,
}) => {
  const ownOffsetY = useSharedValue(0)

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
    .onStart(() => {
      draggedIndex.set(index)
    })
    .onUpdate((event) => {
      ownOffsetY.set(event.translationY)
      dragOffsetY.set(event.translationY)
    })
    .onEnd((event) => {
      runOnJS(onDragEnd)(index, event.translationY)
    })
    .onFinalize(() => {
      ownOffsetY.set(0)
      dragOffsetY.set(0)
      draggedIndex.set(-1)
    })

  const dragTranslateY = useDerivedValue(() => {
    const from = draggedIndex.get()

    if (from === index) return ownOffsetY.get()
    if (from === -1) return 0

    const heights = rowHeights.get()
    const target = dropIndex(heights, from, dragOffsetY.get(), gap)
    const shifts = siblingShifts(heights, from, target, gap)

    return shifts[index] ?? 0
  })

  const containerStyle = useAnimatedStyle(() => ({
    zIndex: draggedIndex.get() === index ? 1 : 0,
    elevation: draggedIndex.get() === index ? 1 : 0,
  }))

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
