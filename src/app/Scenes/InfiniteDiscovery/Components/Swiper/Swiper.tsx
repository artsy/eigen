import { useScreenDimensions } from "@artsy/palette-mobile"
import { FC, useState } from "react"
import { InteractionManager, ViewStyle } from "react-native"
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
  const { width } = useScreenDimensions()
  const dragged = useSharedValue<boolean>(false)
  const offsetX = useSharedValue<number>(0)
  const offsetY = useSharedValue<number>(0)
  const [cards, setCards] = useState(_cards)
  const [swipedCards, setSwipedCards] = useState<typeof _cards>([])

  const topCard = cards[0]

  const handleCardSwipe = () => {
    InteractionManager.runAfterInteractions(() => {
      setSwipedCards((cards) => [...cards, topCard])
      setCards((cards) => cards.slice(1))
    })
  }

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
        if (!topCard) {
          return
        }

        offsetX.value = withTiming(-width, { easing: Easing.cubic }, () => {
          runOnJS(handleCardSwipe)()
          // TOFIX: needs to be adjusted
          // in general the idea of having
          offsetX.value = withTiming(0)
        })
        offsetY.value = withTiming(0, { easing: Easing.cubic })

        return
      }

      offsetX.value = withTiming(0, { easing: Easing.cubic })
      offsetY.value = withTiming(0, { easing: Easing.cubic })
    })

  const topCardAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: withTiming(dragged.value ? 1.1 : 1) },
    ],
  }))

  console.log("cards", cards)
  console.log("topCard", topCard)

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

      <GestureDetector gesture={tap}>
        {!!topCard && (
          <AnimatedView
            key={`card_${0}`}
            style={[
              topCardAnimatedStyles,
              {
                width: width,
                height: width,
                backgroundColor: topCard.color,
                alignSelf: "center",
                position: "absolute",
                zIndex: cards.length,
              },
            ]}
          />
        )}
      </GestureDetector>

      {cards.length > 1 &&
        cards.slice(1).map((c, i) => {
          return (
            <AnimatedView
              key={`card_${i}`}
              style={[
                {
                  width: width,
                  height: width,
                  backgroundColor: c.color,
                  alignSelf: "center",
                  position: "absolute",
                  zIndex: cards.length - i - 1,
                },
              ]}
            />
          )
        })}
    </>
  )
}

interface AnimatedViewProps {
  style: ViewStyle | ViewStyle[]
}
const AnimatedView: FC<AnimatedViewProps> = ({ style }) => {
  return <Animated.View style={style} />
}

const SWIPE_THRESHOLD = 100

// TODO: hitbox detection
