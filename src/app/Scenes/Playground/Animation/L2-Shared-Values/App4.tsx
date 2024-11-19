import { Button } from "@artsy/palette-mobile"
import { View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export const SharedValuesLevel4: React.FC<{}> = () => {
  const translateX = useSharedValue(0)

  const handlePress = () => {
    translateX.set((value) => (value += 20))
  }

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.get()) }],
  }))

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Animated.View
        style={[{ height: 100, width: 100, backgroundColor: "violet" }, animatedStyles]}
      />
      <Button block onPress={handlePress} mt={2}>
        Click me
      </Button>
    </View>
  )
}
