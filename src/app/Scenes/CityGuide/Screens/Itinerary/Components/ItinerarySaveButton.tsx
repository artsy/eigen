import { AddIcon, CheckmarkIcon } from "@artsy/icons/native"
import { Flex } from "@artsy/palette-mobile"
import { useEffect, useRef } from "react"
import { TouchableOpacity } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"

const ICON_SIZE = 24
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 }

interface Props {
  isSaved: boolean
  onPress: () => void
  isSaving?: boolean
  accessibilityLabel?: string
}

export const ItinerarySaveButton: React.FC<Props> = ({
  isSaved,
  onPress,
  isSaving = false,
  accessibilityLabel,
}) => {
  const scale = useSharedValue(1)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    // Skip the initial render so rows do not all pop on load.
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    scale.set(() =>
      withSequence(withTiming(0.6, { duration: 80 }), withSpring(1, { damping: 6, stiffness: 220 }))
    )
  }, [isSaved])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }))

  return (
    <TouchableOpacity
      testID="itinerary-save-button"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (isSaved ? "Saved" : "Save")}
      accessibilityState={{ selected: isSaved, disabled: isSaving }}
      disabled={isSaving}
      hitSlop={HIT_SLOP}
      onPress={onPress}
    >
      <Flex width={ICON_SIZE} height={ICON_SIZE} alignItems="center" justifyContent="center">
        <Animated.View style={animatedStyle}>
          {isSaved ? (
            <CheckmarkIcon
              testID="itinerary-save-button-check-icon"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          ) : (
            <AddIcon testID="itinerary-save-button-add-icon" width={ICON_SIZE} height={ICON_SIZE} />
          )}
        </Animated.View>
      </Flex>
    </TouchableOpacity>
  )
}
