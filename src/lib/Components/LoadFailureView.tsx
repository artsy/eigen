import { screen } from "lib/utils/track/helpers"
import { debounce } from "lodash"
import { color, Flex, Text, Touchable } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing } from "react-native"
import { useTracking } from "react-tracking"
import { ReloadIcon } from "../../palette/svgs/ReloadIcon"

interface LoadFailureViewProps {
  // A callback that is called when the user requests a retry.
  onRetry?: () => void
}

export const LoadFailureView: React.FC<LoadFailureViewProps> = (props) => {
  const spinAnimation = useRef(new Animated.Value(0)).current
  const [isAnimating, setIsAnimating] = useState(false)

  const tracking = useTracking()

  const playAnimation = () => {
    setIsAnimating(true)
    Animated.loop(
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start()
  }

  useEffect(() => {
    tracking.trackEvent(tracks.screen())
  }, [])

  return (
    <Flex flex={1} justifyContent="center" alignItems="center">
      <Text variant="largeTitle">Unable to load</Text>
      <Text variant="subtitle" mb="1">
        Please try again
      </Text>
      <Touchable
        onPress={debounce(() => {
          if (!isAnimating) {
            playAnimation()
          }
          props.onRetry?.()
        })}
        underlayColor={color("black5")}
        haptic
        style={{
          height: 40,
          width: 40,
          borderRadius: 20,
          borderColor: color("black10"),
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
            transform: [
              {
                rotate: spinAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          }}
        >
          <ReloadIcon height={25} width={25} />
        </Animated.View>
      </Touchable>
    </Flex>
  )
}

const tracks = {
  screen: () =>
    screen({
      // @ts-ignore
      context_screen_owner_type: "unableToLoad",
    }),
}
