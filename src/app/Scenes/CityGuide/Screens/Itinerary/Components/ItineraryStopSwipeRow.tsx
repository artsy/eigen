import { TrashIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useDeleteItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/useDeleteItineraryStop"
import { Schema } from "app/utils/track"
import { useRef } from "react"
import { Alert } from "react-native"
import { Gesture, GestureDetector, PanGesture } from "react-native-gesture-handler"
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useTracking } from "react-tracking"

/** Same reveal width and gesture thresholds as `SavedSearchListItem`, the pattern this mirrors. */
const DELETE_BUTTON_WIDTH = 91
/** Matches `StopCard`'s own `CARD_RADIUS`, so the panel's exposed edge isn't square against a rounded row. */
const CARD_RADIUS = 8

interface ItineraryStopSwipeRowProps {
  stopID: string
  citySlug: string
  /** False on a curated guide or a shared link — neither is yours to edit. */
  canDelete: boolean
  isSwipingActive?: boolean
  onSwipeBegin: (id: string) => void
  onDeleted?: (id: string) => void
  /**
   * FIREWORKS-42's hold-and-drag reorder gesture, raced against this row's own swipe pan so
   * only one wins a given touch: the swipe's 5px offset threshold wins a real horizontal
   * flick, `activateAfterLongPress` wins a finger held still. Both have to sit on the same
   * `GestureDetector` for `Gesture.Race` to arbitrate between them — passed in rather than
   * composed by the caller, which is why this prop exists at all.
   */
  dragGesture?: PanGesture
  /** The live vertical offset the drag gesture wants this row moved by, if any. */
  dragTranslateY?: Readonly<SharedValue<number>>
}

/**
 * Scene-local swipe-to-delete wrapper for one itinerary stop row, mirroring
 * `SavedSearchListItem`'s gesture/panel/confirmation exactly. Deliberately not the generic
 * `Swipeable` wrapper, and deliberately not baked into `ItineraryStopRow`, which stays a
 * presentational row.
 */
export const ItineraryStopSwipeRow: React.FC<
  React.PropsWithChildren<ItineraryStopSwipeRowProps>
> = ({
  stopID,
  citySlug,
  canDelete,
  isSwipingActive,
  onSwipeBegin,
  onDeleted,
  dragGesture,
  dragTranslateY,
  children,
}) => {
  const deleteItineraryStop = useDeleteItineraryStop(citySlug)
  const { trackEvent } = useTracking<Schema.Entity>()

  const isDeleteButtonVisible = useSharedValue(false)
  const translateX = useSharedValue(0)

  /*
    `Join` (the separator wrapper `ItinerarySectionRow` renders these in) clones every child
    with a plain positional key, discarding whatever key we set — so deleting a stop doesn't
    unmount its row; it shifts the *next* stop's data into this same component instance,
    shared values and all. Without this, a row that was mid-swipe (or fully open) when its
    stop got deleted would hand that open, animating-closed panel to whichever stop slides
    into its slot. Snapping shut synchronously, in the same render the `stopID` prop changes,
    is what keeps that from ever painting.
  */
  const previousStopID = useRef(stopID)
  if (previousStopID.current !== stopID) {
    previousStopID.current = stopID
    translateX.set(0)
    isDeleteButtonVisible.set(false)
  }

  // Reset the swipe when the user swipes another row.
  if (!isSwipingActive) {
    translateX.set(() => withTiming(0, { duration: 500, easing: Easing.out(Easing.circle) }))
    isDeleteButtonVisible.set(() => false)
  }

  const pan = Gesture.Pan()
    .failOffsetY([-5, 5])
    .activeOffsetX([-5, 5])
    .withTestId(`pan-itinerary-stop-${stopID}`)
    .onBegin(() => {
      runOnJS(onSwipeBegin)(stopID)
    })
    .onChange((event) => {
      // Prevent swiping to the right
      if (translateX.get() >= 0 && event.translationX > 0) {
        return
      }

      // Prevent over-swiping to the left
      if (translateX.get() <= -DELETE_BUTTON_WIDTH && event.translationX < 0) {
        return
      }

      if (isDeleteButtonVisible.get()) {
        translateX.set(() => event.translationX - DELETE_BUTTON_WIDTH)
      } else {
        translateX.set(() => event.translationX)
      }
    })
    .onEnd(() => {
      // If the user swipes more than half of the delete button width, show the delete button fully
      if (translateX.get() < -DELETE_BUTTON_WIDTH / 2) {
        translateX.set(() =>
          withTiming(-DELETE_BUTTON_WIDTH, { duration: 500, easing: Easing.out(Easing.circle) })
        )
        isDeleteButtonVisible.set(() => true)
      } else {
        // Otherwise, hide the delete button
        translateX.set(() => withTiming(0, { duration: 500, easing: Easing.out(Easing.circle) }))
        isDeleteButtonVisible.set(() => false)
      }
    })

  const gesture = dragGesture ? Gesture.Race(pan, dragGesture) : pan

  // Moves the whole row — delete panel included, since it's a sibling of the content below,
  // not a child of it — so a drag shifting this row out of the way doesn't leave the panel
  // behind while the content it's meant to sit behind slides off on its own.
  const rowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: dragTranslateY?.get() ?? 0 }],
    }
  })

  const contentStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.get() }],
    }
  })

  const onDeletePress = async () => {
    try {
      await deleteItineraryStop(stopID)
      trackEvent({
        action_name: Schema.ActionNames.DeletedItineraryStop,
        action_type: Schema.ActionTypes.Swipe,
        owner_type: Schema.OwnerEntityTypes.CityGuide,
        owner_slug: citySlug,
        owner_id: stopID,
      })
      onDeleted?.(stopID)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteStop = () => {
    Alert.alert("Remove Stop", "This will remove the stop from your itinerary.", [
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDeletePress()
        },
      },
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => null,
      },
    ])
  }

  // Neither a delete swipe nor a drag applies here — nothing to wrap the row in a gesture for.
  if (!canDelete && !dragGesture) {
    return <>{children}</>
  }

  return (
    <Flex>
      <GestureDetector gesture={gesture}>
        <Animated.View style={rowStyle}>
          {!!canDelete && (
            <Flex
              position="absolute"
              top={0}
              bottom={0}
              right={0}
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              backgroundColor="red100"
              width={DELETE_BUTTON_WIDTH}
              borderTopRightRadius={CARD_RADIUS}
              borderBottomRightRadius={CARD_RADIUS}
            >
              <Touchable
                accessibilityRole="button"
                onPress={() => handleDeleteStop()}
                testID={`delete-button-${stopID}`}
              >
                <Flex flexDirection="row" alignItems="center" width="100%" height="100%">
                  <Text variant="sm-display" color="mono0" selectable={false}>
                    Delete
                  </Text>
                  <TrashIcon fill="mono0" width="16px" height="16px" />
                </Flex>
              </Touchable>
            </Flex>
          )}

          <Animated.View testID={`itinerary-stop-swipe-content-${stopID}`} style={contentStyles}>
            {children}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Flex>
  )
}
