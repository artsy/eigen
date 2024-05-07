import { ReloadIcon, Touchable, useColor } from "@artsy/palette-mobile"
import { debounce } from "lodash"
import { useRef, useState } from "react"
import { Animated, Easing } from "react-native"

interface ReloadButtonProps {
  onRetry: () => void
}

export const ReloadButton: React.FC<ReloadButtonProps> = ({ onRetry }) => {
  const color = useColor()
  const spinAnimation = useRef(new Animated.Value(0)).current
  const [isAnimating, setIsAnimating] = useState(false)

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

  return (
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
  )
}
