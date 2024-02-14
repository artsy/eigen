import { Button } from "@artsy/palette-mobile"
import { View } from "react-native"
import Animated, { useSharedValue } from "react-native-reanimated"

export default function App() {
  const width = useSharedValue(100)

  const handlePress = () => {
    width.value = width.value + 50
  }

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Animated.View
        style={{
          width,
          height: 100,
          backgroundColor: "violet",
        }}
      />
      <Button block onPress={handlePress} mt={2}>
        Click me
      </Button>
    </View>
  )
}
