import {
  Button,
  Color,
  Flex,
  Screen,
  Text,
  Touchable,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { FancySwiper } from "app/Components/FancySwiper/FancySwiper"
import { InfiniteDiscoveryContext } from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryContext"
import { navigate } from "app/system/navigation/navigate"

export const InfiniteDiscoveryView: React.FC = () => {
  return (
    <InfiniteDiscoveryContext.Provider>
      <InfiniteDiscovery />
    </InfiniteDiscoveryContext.Provider>
  )
}

export const InfiniteDiscovery: React.FC = () => {
  const artworkIds = InfiniteDiscoveryContext.useStoreState((state) => state.artworkIds)
  const currentArtworkId = InfiniteDiscoveryContext.useStoreState((state) => state.currentArtworkId)
  const goBack = InfiniteDiscoveryContext.useStoreActions((action) => action.goBack)
  const goForward = InfiniteDiscoveryContext.useStoreActions((actions) => actions.goForward)

  const canGoBack = artworkIds.length && currentArtworkId !== artworkIds[0]

  const handleBackPressed = () => {
    goBack()
  }

  const handleExitPressed = () => {
    navigate("/home-view")
  }

  const handleSwipedRight = () => {
    // no-op
  }

  const handleSwipedLeft = () => {
    goForward()
  }

  return (
    <Screen>
      <Screen.Header
        title="Discovery"
        leftElements={
          <Touchable onPress={handleBackPressed}>
            <Text variant="xs">Back</Text>
          </Touchable>
        }
        hideLeftElements={!canGoBack}
        rightElements={
          <Touchable onPress={handleExitPressed}>
            <Text variant="xs">Exit</Text>
          </Touchable>
        }
      />
      <Screen.Body>
        <FancySwiper
          cards={artworkCards(artworkIds)}
          onSwipeRight={handleSwipedRight}
          onSwipeLeft={handleSwipedLeft}
        />
      </Screen.Body>
    </Screen>
  )
}

const artworkCards = (artworkIds: Color[]) => {
  return artworkIds.map((artworkId) => {
    const { color, space } = useTheme()
    const { width } = useScreenDimensions()
    return {
      jsx: (
        <Flex width={width - space(4)} height={500} backgroundColor="white">
          <Flex flexDirection="row" justifyContent="space-between" testID="artist-header">
            <Text variant="sm-display">Artist Name</Text>
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
                  Artwork Title,
                </Text>
                <Text color={color("black60")} variant="sm-display">
                  2024
                </Text>
              </Flex>
              <Text variant="sm-display">$1,234</Text>
            </Flex>
            <Button variant="fillGray">Save</Button>
          </Flex>
        </Flex>
      ),
      id: artworkId,
    }
  })
}
