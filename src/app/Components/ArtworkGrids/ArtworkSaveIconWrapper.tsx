import { HeartFillIcon, HeartStrokeIcon } from "@artsy/icons/native"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { useEffect, useRef } from "react"
import { Animated, useAnimatedValue } from "react-native"

export const ArtworkSaveIconWrapper: React.FC<{
  isSaved: boolean
  testID?: string
  accessibilityLabel?: string
  fill?: string
}> = ({ isSaved, testID, accessibilityLabel, fill }) => {
  const scaleAnimation = useAnimatedValue(1)
  const didMount = useRef(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (isSaved) {
      Animated.sequence([
        Animated.spring(scaleAnimation, {
          toValue: 0.7,
          mass: 0.01,
          stiffness: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // We don't want to animation the dislike
      scaleAnimation.setValue(1)
    }
  }, [isSaved, scaleAnimation])

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnimation }] }}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
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
