import Animated from "react-native-reanimated"

export const L1AnimatedComponent: React.FC<{}> = () => {
  return (
    <Animated.View
      style={{
        width: 100,
        height: 100,
        backgroundColor: "violet",
      }}
    />
  )
}
