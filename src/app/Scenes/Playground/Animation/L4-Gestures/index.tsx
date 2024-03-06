import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"

export const L4Gestures: React.FC<{}> = () => {
  // Other available gestures include
  // Tap, Pan, LongPress, Fling, Pinch, Rotation, ForceTouch
  const tap = Gesture.Pan()
    .onStart(() => {
      console.log("tap")
    })
    .onChange(() => {
      console.log("tap active")
    })
    .onEnd(() => {
      console.log("tap end")
    })
  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "violet",
          alignSelf: "center",
        }}
      />
    </GestureDetector>
  )
}
