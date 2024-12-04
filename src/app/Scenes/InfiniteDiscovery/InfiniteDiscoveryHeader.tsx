import { Flex, Text, Touchable, useScreenDimensions } from "@artsy/palette-mobile"
import useInfiniteDiscovery from "app/Scenes/InfiniteDiscovery/hooks/useInfiniteDiscovery"
import { navigate } from "app/system/navigation/navigate"

export default () => {
  const { artworkIds, currentArtworkId, goBack } = useInfiniteDiscovery()
  const { safeAreaInsets } = useScreenDimensions()

  const canGoBack = artworkIds.length && currentArtworkId !== artworkIds[0]

  const handleBackPressed = () => {
    goBack()
  }

  const handleExitPressed = () => {
    navigate("/home-view")
  }

  return (
    <Flex backgroundColor="white100" pb={1} px={2} style={{ paddingTop: safeAreaInsets.top }}>
      <Flex py={1} justifyContent="space-between" flexDirection="row">
        {!!canGoBack && (
          <Touchable onPress={handleBackPressed}>
            <Text variant="xs">Back</Text>
          </Touchable>
        )}
        <Text variant="lg-display">Discovery</Text>
        <Touchable onPress={handleExitPressed}>
          <Text variant="xs">Exit</Text>
        </Touchable>
      </Flex>
    </Flex>
  )
}
