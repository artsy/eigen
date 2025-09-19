import { HeartFillIcon, HeartStrokeIcon } from "@artsy/icons/native"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { useEffect, useRef } from "react"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"

export const ArtworkSaveIconWrapper: React.FC<{
  isSaved: boolean
  testID?: string
  accessibilityLabel?: string
  fill?: string
}> = ({ isSaved, testID, accessibilityLabel, fill }) => {
  const scaleAnimation = useSharedValue(1)
  const didMount = useRef(false)

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }))

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (isSaved) {
      scaleAnimation.value = withSequence(
        withSpring(isSaved ? 0.7 : 1, {
          mass: 1,
          stiffness: 300,
          damping: 20,
        }),
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 200 })
      )
    } else {
      // We don't want to animation the dislike
      scaleAnimation.value = 1
    }
  }, [isSaved, scaleAnimation])

  return (
    <Animated.View style={animatedStyles} testID={testID} accessibilityLabel={accessibilityLabel}>
      {!!isSaved ? (
        <HeartFillIcon
          height={HEART_ICON_SIZE}
          width={HEART_ICON_SIZE}
          fill="blue100"
          testID="filled-heart-icon"
        />
      ) : (
        <HeartStrokeIcon
          height={HEART_ICON_SIZE}
          width={HEART_ICON_SIZE}
          fill={fill}
          testID="empty-heart-icon"
        />
      )}
    </Animated.View>
  )
}
