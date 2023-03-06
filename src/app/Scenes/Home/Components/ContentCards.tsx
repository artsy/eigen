import { Box, Flex, Spacer, Text } from "@artsy/palette-mobile"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/system/navigation/navigate"
import { Button, Touchable } from "palette"
import { memo, useEffect, useRef, useState } from "react"
import { FlatList, PixelRatio, ViewabilityConfig } from "react-native"
import ReactAppboy from "react-native-appboy-sdk"
import { useScreenDimensions } from "shared/hooks"
import { PaginationDots } from "./PaginationDots"

interface CardProps {
  item: ReactAppboy.CaptionedContentCard
}

const fontScale = PixelRatio.getFontScale()

const CARD_HEIGHT = 250 * fontScale
const CARD_IMAGE_WIDTH = 125
const DESCRIPTION_LINES = fontScale > 1 ? 4 : 3

const ContentCard: React.FC<CardProps> = ({ item }) => {
  const { width: screenWidth } = useScreenDimensions()
  const cardImageWidth = screenWidth > 700 ? screenWidth / 2 : CARD_IMAGE_WIDTH

  const handlePress = () => {
    ReactAppboy.logContentCardClicked(item.id)

    if (item.url) {
      navigate(item.url)
    }
  }

  return (
    <Touchable key={item.id} onPress={handlePress}>
      <Flex bg="black100" flexDirection="row" height={CARD_HEIGHT} width={screenWidth}>
        <OpaqueImageView
          height={CARD_HEIGHT}
          imageURL={item.image}
          resizeMode="cover"
          width={cardImageWidth}
        />
        <Box p={2} width={screenWidth - cardImageWidth}>
          <Text color="white100" mb={1} numberOfLines={2} variant="lg-display">
            {item.title}
          </Text>
          <Text color="white100" mb={2} numberOfLines={DESCRIPTION_LINES}>
            {item.cardDescription}
          </Text>
          <Button size="small" variant="outlineLight" onPress={handlePress}>
            {item.domain}
          </Button>
        </Box>
      </Flex>
    </Touchable>
  )
}

export const useContentCards = () => {
  const [cards, setCards] = useState<ReactAppboy.CaptionedContentCard[]>([])
  const eventName = ReactAppboy.Events?.CONTENT_CARDS_UPDATED

  useEffect(() => {
    if (eventName) {
      const callback = async () => {
        const updatedCards = await ReactAppboy.getContentCards()

        const sortedCards = updatedCards.sort((lhs, rhs) =>
          lhs.extras.position > rhs.extras.position ? 1 : -1
        )
        setCards(sortedCards as ReactAppboy.CaptionedContentCard[])
      }

      const listener = ReactAppboy.addListener(eventName, callback)
      ReactAppboy.requestContentCardsRefresh()
      return () => {
        listener.remove()
      }
    }
  }, [])

  return {
    cards,
  }
}

export const ContentCards: React.FC<{
  cards: ReactAppboy.CaptionedContentCard[]
}> = memo(({ cards }) => {
  return <CardList cards={cards} />
})

interface CardListProps {
  cards: ReactAppboy.CaptionedContentCard[]
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [viewedCards, setViewedCards] = useState([] as ReactAppboy.CaptionedContentCard[])

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    const viewableCards = viewableItems.map(
      (viewableItem: any) => viewableItem.item
    ) as ReactAppboy.CaptionedContentCard[]
    const lastShown = viewableCards[viewableCards.length - 1]
    const newCardIndex = cards.findIndex((card) => card.id === lastShown.id)
    if (newCardIndex >= 0) {
      setCurrentCardIndex(newCardIndex)
    }
    const filteredCards = viewableCards.filter((card) => !viewedCards.includes(card))
    if (filteredCards.length === 0) {
      return
    }
    filteredCards.forEach((card) => ReactAppboy.logContentCardImpression(card.id))
    setViewedCards([...viewedCards, ...filteredCards])
  }

  const viewabilityConfig: ViewabilityConfig = { itemVisiblePercentThreshold: 25 }
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged, viewabilityConfig }])

  const { width } = useScreenDimensions()

  return (
    <>
      <FlatList
        data={cards}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContentCard item={item} />}
        snapToAlignment="start"
        snapToInterval={width}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <Spacer y={2} />
      <PaginationDots currentIndex={currentCardIndex} length={cards.length} />
    </>
  )
}
