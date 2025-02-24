import { Text, useScreenDimensions } from "@artsy/palette-mobile"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const _cards = [
  { color: "lightgreen", id: "5" },
  { color: "yellow", id: "4" },
  { color: "orange", id: "3" },
  { color: "lightblue", id: "2" },
  { color: "violet", id: "1" },
]

export const Swiper: React.FC<{}> = () => {
  const { width } = useScreenDimensions()
  const dragged = useSharedValue(false)
  const activeCardX = useSharedValue(0)
  const activeCardY = useSharedValue(0)
  const swipedCardX = useSharedValue(-width)
  const swipedCardY = useSharedValue(0)
  const _activeIndex = useSharedValue(_cards.length - 1)
  const swipedIndexes = useSharedValue<number[]>([])

  const pan = Gesture.Pan()
    .onStart(() => {
      dragged.value = true
    })
    .onChange(({ translationX, translationY }) => {
      activeCardX.value = translationX
      activeCardY.value = translationY
    })
    .onEnd(({ translationX }) => {
      dragged.value = false

      const swipeOverThreshold = Math.abs(translationX) > SWIPE_THRESHOLD

      if (!swipeOverThreshold) {
        activeCardX.value = withTiming(0)
        activeCardY.value = withTiming(0)
        return
      }

      // Swipe left
      if (translationX < 0) {
        activeCardX.value = withTiming(-width, { easing: Easing.cubic }, () => {
          swipedIndexes.value = [...swipedIndexes.value, _activeIndex.value]
          _activeIndex.value = _activeIndex.value - 1
          activeCardX.value = 0
          activeCardY.value = 0
        })
        activeCardY.value = withTiming(0, { easing: Easing.cubic })

        return
      }

      // Swipe right then brings the card back to the deck
      activeCardX.value = 0
      activeCardY.value = 0
      swipedCardX.value = withTiming(0, { easing: Easing.cubic }, () => {
        swipedIndexes.value = swipedIndexes.value.slice(0, -1)
        _activeIndex.value = _activeIndex.value + 1
        swipedCardX.value = -width
        swipedCardY.value = 0
      })
      swipedCardY.value = withTiming(0, { easing: Easing.cubic })
    })

  console.log("cards", _cards)

  return (
    <GestureDetector gesture={pan}>
      <View>
        {_cards.map((c, i) => {
          return (
            <AnimatedView
              index={i}
              card={c}
              activeCardX={activeCardX}
              activeCardY={activeCardY}
              activeIndex={_activeIndex}
              swipedIndexes={swipedIndexes}
              swipedCardX={swipedCardX}
              swipedCardY={swipedCardY}
              key={`card_${c.id}`}
            />
          )
        })}
      </View>
    </GestureDetector>
  )
}

interface AnimatedViewProps {
  index: number
  activeCardX: SharedValue<number>
  activeCardY: SharedValue<number>
  swipedCardX: SharedValue<number>
  swipedCardY: SharedValue<number>
  activeIndex: SharedValue<number>
  swipedIndexes: SharedValue<number[]>
  card: (typeof _cards)[number]
  style?: ViewStyle | ViewStyle[]
}
const AnimatedView: FC<AnimatedViewProps> = ({
  card,
  activeCardX,
  activeCardY,
  swipedCardX,
  swipedCardY,
  activeIndex,
  index,
  swipedIndexes,
}) => {
  const { width } = useScreenDimensions()

  const topCardStyle = useAnimatedStyle(() => {
    if (activeIndex.value !== index) {
      return {}
    }

    return {
      transform: [
        { translateX: Math.min(0, activeCardX.value) },
        { translateY: activeCardY.value },
      ],
    }
  })

  const swipedStyle = useAnimatedStyle(() => {
    if (!swipedIndexes.value.includes(index)) {
      return {}
    }

    if (index === activeIndex.value + 1) {
      return { transform: [{ translateX: swipedCardX.value }, { translateY: swipedCardY.value }] }
    }

    return { transform: [{ translateX: -width }, { translateY: 0 }] }
  })

  return (
    <Animated.View
      style={[
        topCardStyle,
        swipedStyle,
        {
          width: width,
          height: width,
          backgroundColor: card.color,
          alignSelf: "center",
          position: "absolute",
          zIndex: index,
        },
      ]}
    >
      <Text>`Artwork ${card.id}`</Text>
    </Animated.View>
  )
}

const SWIPE_THRESHOLD = 100
