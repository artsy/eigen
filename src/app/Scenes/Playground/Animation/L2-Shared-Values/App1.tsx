import Animated, { useSharedValue } from "react-native-reanimated"

export const SharedValuesLevel1: React.FC<{}> = () => {
  const width = useSharedValue(100)

  return (
    <Animated.View
      style={{
        width: width.get(),
        height: 100,
        backgroundColor: "violet",
      }}
    />
  )
}
