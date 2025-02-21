import { useScreenDimensions } from "@artsy/palette-mobile"
import { FC, useState } from "react"
import { InteractionManager } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const _cards = [
  { color: "lightblue" },
  { color: "yellow" },
  { color: "orange" },
  { color: "lightblue" },
  { color: "violet" },
]

export const Swiper: React.FC<{}> = () => {
  const [cards, setCards] = useState(_cards)
  const [swipedCards, setSwipedCards] = useState<typeof _cards>([])
  // TODO: once swiped are virtualized change this
  const activeIndex = cards.length - 1

  const handleCardSwipe = () => {
    console.log("handleCardSwiper")
    InteractionManager.runAfterInteractions(() => {
      setSwipedCards((c) => [...c, cards[activeIndex]])
      setCards((cards) => cards.slice(0, activeIndex))
    })
  }

  console.log("cards", cards)
  console.log("swipedCards", swipedCards)

  return (
    <>
      {/* {swipedCards.map((c, i) => {
        return (
          <AnimatedView
            key={`card_${i}`}
            style={{
              width: width,
              height: width,
              backgroundColor: c.color,
              alignSelf: "center",
              position: "absolute",
              zIndex: 1,
            }}
          />
        )
      })} */}

      {cards.map((c, i) => {
        console.log("card", { isTopCard: activeIndex === i, i, c })
        return (
          <AnimatedView
            onSwipeEnd={handleCardSwipe}
            index={i}
            isTopCard={activeIndex === i}
            card={c}
            key={`card_${i}`}
          />
        )
      })}
    </>
  )
}

interface AnimatedViewProps {
  isTopCard: boolean
  index: number
  onSwipeEnd: () => void
  card: (typeof _cards)[number]
}
const AnimatedView: FC<AnimatedViewProps> = ({ card, index, isTopCard, onSwipeEnd }) => {
  const { width } = useScreenDimensions()
  const dragged = useSharedValue<boolean>(false)
  const offsetX = useSharedValue<number>(0)
  const offsetY = useSharedValue<number>(0)

  const tap = Gesture.Pan()
    .onStart(() => {
      dragged.value = true
    })
    .onChange(({ translationX, translationY }) => {
      offsetX.value = translationX
      offsetY.value = translationY
    })
    .onEnd(({ translationX }) => {
      dragged.value = false

      // Swipe left
      if (translationX < 0 && Math.abs(translationX) > SWIPE_THRESHOLD) {
        if (!isTopCard) {
          return
        }

        offsetX.value = withTiming(-width, { easing: Easing.cubic }, () => {
          runOnJS(onSwipeEnd)()
        })
        offsetY.value = withTiming(0, { easing: Easing.cubic })
        return
      }

      offsetX.value = withTiming(0, { easing: Easing.cubic })
      offsetY.value = withTiming(0, { easing: Easing.cubic })
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: withTiming(dragged.value ? 1.1 : 1) },
    ],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: width,
            height: width,
            backgroundColor: card.color,
            alignSelf: "center",
            position: "absolute",
            zIndex: index,
          },
        ]}
      />
    </GestureDetector>
  )
}

const SWIPE_THRESHOLD = 100

// TODO: hitbox detection
