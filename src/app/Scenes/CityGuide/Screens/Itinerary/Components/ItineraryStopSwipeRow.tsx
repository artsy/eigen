import { TrashIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { useDeleteItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/useDeleteItineraryStop"
import { Schema } from "app/utils/track"
import { Alert } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useTracking } from "react-tracking"

/** Same reveal width and gesture thresholds as `SavedSearchListItem`, the pattern this mirrors. */
const DELETE_BUTTON_WIDTH = 91

interface ItineraryStopSwipeRowProps {
  stopID: string
  citySlug: string
  /** False on a curated guide or a shared link — neither is yours to edit. */
  canDelete: boolean
  isSwipingActive?: boolean
  onSwipeBegin: (id: string) => void
  onDeleted?: (id: string) => void
}

/**
 * Scene-local swipe-to-delete wrapper for one itinerary stop row, mirroring
 * `SavedSearchListItem`'s gesture/panel/confirmation exactly. Deliberately not the generic
 * `Swipeable` wrapper, and deliberately not baked into `ItineraryStopRow`, which stays a
 * presentational row.
 */
export const ItineraryStopSwipeRow: React.FC<
  React.PropsWithChildren<ItineraryStopSwipeRowProps>
> = ({ stopID, citySlug, canDelete, isSwipingActive, onSwipeBegin, onDeleted, children }) => {
  const deleteItineraryStop = useDeleteItineraryStop(citySlug)
  const { trackEvent } = useTracking<Schema.Entity>()

  const isDeleteButtonVisible = useSharedValue(false)
  const translateX = useSharedValue(0)

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

  const animatedStyles = useAnimatedStyle(() => {
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

  if (!canDelete) {
    return <>{children}</>
  }

  return (
    <Flex>
      <GestureDetector gesture={pan}>
        <Animated.View>
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

          <Animated.View style={animatedStyles}>{children}</Animated.View>
        </Animated.View>
      </GestureDetector>
    </Flex>
  )
}
