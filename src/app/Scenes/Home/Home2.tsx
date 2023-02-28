import { Flex, Text } from "@artsy/palette-mobile"
import { useCallback, useRef, useState } from "react"

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

const SwiperCard = ({ card }: { card: Card }) => {
  return <Flex position="absolute">{card.jsx}</Flex>
}

const Swiper = ({ cards, initialIndex, onSwipeLeft, onSwipeRight }: SwiperProps) => {
  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      {cards.map((card) => {
        return <SwiperCard card={card} key={card.id} />
      })}
    </Flex>
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
  const cards = useRef(allCards).current

  const onSwipeRight = (index: number) => {
    console.log(index)
  }

  const onSwipeLeft = (index: number) => {
    console.log(index)
  }

  return (
    <Flex flex={1} backgroundColor="black10">
      <Swiper
        cards={cards}
        initialIndex={initialIndex}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
    </Flex>
  )
}
