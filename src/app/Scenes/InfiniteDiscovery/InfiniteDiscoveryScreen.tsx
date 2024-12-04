import { Button, Flex, Screen, Text, useScreenDimensions, useTheme } from "@artsy/palette-mobile"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { Card } from "app/Components/FancySwiper/FancySwiperCard"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"

export default () => {
  const artworkIds = InfiniteDiscoveryContext.useStoreState((state) => state.artworkIds)
  const goNext = InfiniteDiscoveryContext.useStoreActions((actions) => actions.goForward)

  const { color, space } = useTheme()
  const { width } = useScreenDimensions()

  const artworkCards: Card[] = artworkIds.map((artworkId) => {
    return {
      jsx: (
        <Flex width={width - space(4)} height={500} backgroundColor="white">
          <Flex flexDirection="row" justifyContent="space-between" testID="artist-header">
            <Text variant="sm-display">Gao Hang</Text>
            <Button variant="outlineGray">Follow</Button>
          </Flex>
          <Flex
            backgroundColor={color(artworkId)}
            height={250}
            testID="image-frame"
            width={250}
          ></Flex>
          <Flex testID="multi-image-tabs" />
          <Flex flexDirection="row" justifyContent="space-between" testID="artwork-info">
            <Flex>
              <Flex flexDirection="row">
                <Text color={color("black60")} italic variant="sm-display">
                  He So Real,
                </Text>
                <Text color={color("black60")} variant="sm-display">
                  2022
                </Text>
              </Flex>
              <Text variant="sm-display">$2,304</Text>
            </Flex>
            <Button variant="fillGray">Save</Button>
          </Flex>
        </Flex>
      ),
      id: artworkId,
    }
  })

  const handleSwipedRight = () => {
    // no-op
  }

  const handleSwipedLeft = () => {
    goNext()
  }

  return (
    <Screen>
      <Screen.Body>
        <FancySwiper
          cards={artworkCards}
          onSwipeRight={handleSwipedRight}
          onSwipeLeft={handleSwipedLeft}
        />
      </Screen.Body>
    </Screen>
  )
}
