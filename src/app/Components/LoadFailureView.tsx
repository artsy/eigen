import { ReloadIcon } from "@artsy/palette-mobile"
import { useDevToggle, useIsStaging } from "app/store/GlobalStore"
import { debounce } from "lodash"
import { Box, BoxProps, Flex, Text, Touchable, useColor } from "palette"
import { useRef, useState } from "react"
import { Animated, Easing } from "react-native"
import { JustifyContentValue } from "./Bidding/Elements/types"

interface LoadFailureViewProps {
  error?: Error
  onRetry?: () => void
  justifyContent?: JustifyContentValue
}

export const LoadFailureView: React.FC<LoadFailureViewProps & BoxProps> = ({
  error,
  onRetry,
  ...restProps
}) => {
  const color = useColor()
  const spinAnimation = useRef(new Animated.Value(0)).current
  const [isAnimating, setIsAnimating] = useState(false)
  const showErrorInLoadFailureViewToggle = useDevToggle("DTShowErrorInLoadFailureView")

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

  const showErrorMessage = __DEV__ || showErrorInLoadFailureViewToggle
  const isStaging = useIsStaging()

  return (
    <Flex flex={1} alignItems="center" justifyContent="center" {...restProps}>
      <Text variant="lg-display">Unable to load</Text>
      <Text variant="sm-display" mb="1">
        Please try again
      </Text>
      {isStaging && <Box mb={1} border={2} width={200} borderColor="devpurple" />}
      <Touchable
        onPress={debounce(() => {
          if (!isAnimating) {
            playAnimation()
          }
          onRetry?.()
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
      {!!showErrorMessage && (
        <Flex m={2}>
          <Text>Error: {error?.message}</Text>
        </Flex>
      )}
    </Flex>
  )
}
