import { Button } from "@artsy/palette-mobile"
import { Dimensions, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

export default function App() {
  const translateX = useSharedValue(0)

  const handlePress = () => {
    translateX.value = translateX.value === 0 ? Dimensions.get("window").width - 100 : 0
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(translateX.value, { duration: 1000, easing: Easing.bounce }) },
      ],
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[{ height: 100, width: 100, backgroundColor: "violet" }, animatedStyles]}
      />
      <Button block onPress={handlePress} mt={2}>
        Click me
      </Button>
    </View>
  )
}
