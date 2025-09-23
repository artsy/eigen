import { Animated } from "react-native"

export const useElasticOverscroll = (
  header: React.JSX.Element,
  scrollAnim = new Animated.Value(0)
) => {
  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollAnim },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  )
  const scrollProps = {
    onScroll,
    scrollEventThreshold: 100,
  }
  const animatedHeader = (
    <Animated.View
      style={{
        transform: [
          {
            translateY: scrollAnim.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [-0.5, 0, 0],
            }),
          },
        ],
      }}
    >
      {header}
    </Animated.View>
  )

  return {
    scrollProps,
    header: animatedHeader,
  }
}
