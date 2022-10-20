import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { Box, Button, Flex, Spacer, Text, Touchable } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { FlatList } from "react-native"
import ReactAppboy from "react-native-appboy-sdk"
import { useScreenDimensions } from "shared/hooks"
import { PaginationDots } from "./PaginationDots"

interface CardProps {
  item: ReactAppboy.CaptionedContentCard
}

const CARD_HEIGHT = 250
const CARD_IMAGE_WIDTH = 125

const ContentCard: React.FC<CardProps> = ({ item }) => {
  const { width: screenWidth } = useScreenDimensions()
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
          width={CARD_IMAGE_WIDTH}
        />
        <Box p={2} width={screenWidth - CARD_IMAGE_WIDTH}>
          <Text color="white100" mb={1} numberOfLines={2} variant="lg-display">
            {item.title}
          </Text>
          <Text color="white100" mb={2} numberOfLines={3}>
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

export const ContentCards: React.FC = () => {
  const [cards, setCards] = useState<ReactAppboy.CaptionedContentCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [viewedCards, setViewedCards] = useState([] as ReactAppboy.CaptionedContentCard[])
  const eventName = ReactAppboy.Events?.CONTENT_CARDS_UPDATED

  if (!eventName) {
    return null
  }

  useEffect(() => {
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
  }, [])

  const handleViewableItemsChanged = useCallback(
    (viewable) => {
      const viewableCards = viewable.viewableItems.map(
        (viewableItem: any) => viewableItem.item
      ) as ReactAppboy.CaptionedContentCard[]
      const lastShown = viewableCards[viewableCards.length - 1]
      const newCardIndex = cards.findIndex((card) => card.id === lastShown.id)
      setCurrentCardIndex(newCardIndex)
      const filteredCards = viewableCards.filter((card) => !viewedCards.includes(card))
      if (filteredCards.length === 0) {
        return
      }

      filteredCards.forEach((card) => ReactAppboy.logContentCardImpression(card.id))
      setViewedCards([...viewedCards, ...filteredCards])
    },
    [cards]
  )

  const { width } = useScreenDimensions()

  if (cards.length < 1) {
    return null
  }

  return (
    <>
      <FlatList
        data={cards}
        decelerationRate="fast"
        horizontal
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={handleViewableItemsChanged}
        renderItem={({ item }) => <ContentCard item={item} />}
        snapToAlignment="start"
        snapToInterval={width}
        viewabilityConfig={{ itemVisiblePercentThreshold: 25 }}
      />
      <Spacer mb={2} />
      <PaginationDots currentIndex={currentCardIndex} length={cards.length} />
      <Spacer mb={2} />
    </>
  )
}
