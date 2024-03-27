import { ActionType, DeletedSavedSearch, OwnerType } from "@artsy/cohesion"
import {
  ChevronIcon,
  Flex,
  Box,
  useColor,
  Text,
  Touchable,
  TrashIcon,
  Dialog,
} from "@artsy/palette-mobile"
import { deleteSavedSearchMutation } from "app/Scenes/SavedSearchAlert/mutations/deleteSavedSearchAlert"
import { useState } from "react"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useTracking } from "react-tracking"

interface SavedSearchListItemProps {
  id: string
  title: string
  subtitle?: string
  isSwipingActive?: boolean
  onPress: () => void
  onSwipeBegin: (id: string) => void
  onDelete: (id: string) => void
}

const FALLBACK_TITLE = "Untitled Alert"
const DELETE_BUTTON_WIDTH = 91

export const SavedSearchListItem: React.FC<SavedSearchListItemProps> = (props) => {
  const { id, title, subtitle, isSwipingActive, onPress, onSwipeBegin, onDelete } = props

  const [visibleDeleteDialog, setVisibleDeleteDialog] = useState(false)
  const color = useColor()
  const tracking = useTracking()

  const isDeleteButtonVisible = useSharedValue(false)
  const translateX = useSharedValue(0)

  // Reset the swipe when user swipes another item
  if (!isSwipingActive) {
    translateX.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.circle) })
    isDeleteButtonVisible.value = false
  }

  const pan = Gesture.Pan()
    .failOffsetY([-5, 5])
    .activeOffsetX([-5, 5])
    .withTestId(`pan-alert-${id}`)
    .onBegin(() => {
      runOnJS(onSwipeBegin)(id)
    })
    .onChange((event) => {
      // Prevent swiping to the right
      if (translateX.value >= 0 && event.translationX > 0) {
        return
      }

      // Prevent over-swiping to the left
      if (translateX.value <= -DELETE_BUTTON_WIDTH && event.translationX < 0) {
        return
      }

      translateX.value = isDeleteButtonVisible.value
        ? event.translationX - DELETE_BUTTON_WIDTH
        : event.translationX
    })
    .onEnd(() => {
      // If the user swipes more than half of the delete button width, show the delete button fully
      if (translateX.value < -DELETE_BUTTON_WIDTH / 2) {
        translateX.value = withTiming(-DELETE_BUTTON_WIDTH, {
          duration: 500,
          easing: Easing.out(Easing.circle),
        })
        isDeleteButtonVisible.value = true
      } else {
        // Otherwise, hide the delete button
        translateX.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.circle) })
        isDeleteButtonVisible.value = false
      }
    })

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  const onDeletePress = async () => {
    setVisibleDeleteDialog(false)

    try {
      await deleteSavedSearchMutation(id)
      tracking.trackEvent(tracks.deletedSavedSearch(id))
      onDelete?.(id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex>
      <Dialog
        isVisible={visibleDeleteDialog}
        title="Delete Alert"
        detail="You will no longer receive notifications for artworks matching the criteria in this alert."
        primaryCta={{
          text: "Delete",
          onPress: onDeletePress,
        }}
        secondaryCta={{
          text: "Keep Alert",
          onPress: () => {
            setVisibleDeleteDialog(false)
          },
        }}
      />
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
            <Touchable onPress={() => setVisibleDeleteDialog(true)} testID={`delete-button-${id}`}>
              <Flex flexDirection="row" alignItems="center" width="100%" height="100%">
                <Text variant="sm-display" color="white100">
                  Delete
                </Text>
                <TrashIcon fill="white100" width="16px" height="16px" />
              </Flex>
            </Touchable>
          </Flex>

          <Animated.View style={animatedStyles}>
            <Touchable onPress={onPress} underlayColor={color("black5")}>
              <Box px={2} py={2} backgroundColor="white100">
                <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Flex flex={1} flexDirection="column">
                    <Text variant="sm" fontWeight="bold">
                      {title ?? FALLBACK_TITLE}
                    </Text>
                    {!!subtitle && (
                      <Text variant="sm" color="black60">
                        {subtitle}
                      </Text>
                    )}
                  </Flex>
                  <ChevronIcon direction="right" fill="black60" />
                </Flex>
              </Box>
            </Touchable>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Flex>
  )
}

export const tracks = {
  deletedSavedSearch: (id: string): DeletedSavedSearch => ({
    action: ActionType.deletedSavedSearch,
    context_screen_owner_type: OwnerType.savedSearch,
    context_screen_owner_id: id,
  }),
}
