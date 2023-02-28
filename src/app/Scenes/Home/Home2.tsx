import { Flex } from "@artsy/palette-mobile"
import { useCallback, useRef, useState } from "react"
import { Animated, GestureResponderHandlers, PanResponder } from "react-native"

interface Card {
  jsx: JSX.Element
  id: string
}
interface SwiperProps {
  cards: Card[]
  initialIndex?: number
  onSwipeLeft: (index: number) => void
  onSwipeRight: (index: number) => void
}

interface SwiperCardProps extends GestureResponderHandlers {
  card: Card
  swipe: Animated.ValueXY
  isFirst: boolean
}

const OUT_OF_BOX_OFFSET = 100
const SwiperCard = ({ card, swipe, isFirst, ...rest }: SwiperCardProps) => {
  const rotate = swipe.x.interpolate({
    inputRange: [-OUT_OF_BOX_OFFSET, 0, OUT_OF_BOX_OFFSET],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  })

  const animatedCardStyle = {
    transform: [...swipe.getTranslateTransform(), { rotate }],
  }

  return (
    <Animated.View
      style={[{ position: "absolute", zIndex: -1 }, !isFirst && animatedCardStyle]}
      {...rest}
    >
      {card.jsx}
    </Animated.View>
  )
}

const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const allCards: Card[] = [
  {
    id: "id1",
    jsx: <Flex height={400} width={300} backgroundColor={getRandomColor()}></Flex>,
  },
  {
    id: "id2",
    jsx: <Flex height={400} width={300} backgroundColor={getRandomColor()}></Flex>,
  },
  {
    id: "id3",
    jsx: <Flex height={400} width={300} backgroundColor={getRandomColor()}></Flex>,
  },
]

export const HomeQueryRenderer = () => {
  const [initialIndex, setInitialIndex] = useState(0)
  const [cards, setCards] = useState(allCards)
  const swipe = useRef(new Animated.ValueXY()).current

  const onSwipeRight = (index: number) => {
    console.log(index)
  }

  const onSwipeLeft = (index: number) => {
    console.log(index)
  }

  const removeTopCard = useCallback(() => {
    console.log("here => ")

    setCards(cards.slice(1))

    swipe.setValue({ x: 0, y: 0 })
  }, [swipe])

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      swipe.setValue({ x: dx, y: dy })
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      const direction = Math.sign(dx)
      const isActionActive = Math.abs(dx) > OUT_OF_BOX_OFFSET

      if (isActionActive) {
        Animated.timing(swipe, {
          toValue: { x: direction * 1000, y: dy },
          useNativeDriver: true,
          duration: 300,
        }).start(removeTopCard)
      } else {
        Animated.spring(swipe, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 5,
        }).start()
      }
    },
  })

  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      {cards.map((card, index) => {
        const isFirst = index === 0
        const dragHandlers = !isFirst ? panResponder.panHandlers : {}

        return (
          <SwiperCard card={card} key={card.id} swipe={swipe} isFirst={isFirst} {...dragHandlers} />
        )
      })}
    </Flex>
  )
}
