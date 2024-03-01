import Animated, { useSharedValue } from "react-native-reanimated"

export default function App() {
  const width = useSharedValue(100)

  return (
    <Animated.View
      style={{
        width,
        height: 100,
        backgroundColor: "violet",
      }}
    />
  )
}
