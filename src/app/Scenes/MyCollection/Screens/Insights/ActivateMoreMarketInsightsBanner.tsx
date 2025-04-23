import { ActionType, OwnerType } from "@artsy/cohesion"
import { Button, Flex, Text } from "@artsy/palette-mobile"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { ImageBackground } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

const BackgroundImage = styled(ImageBackground)``

export const ActivateMoreMarketInsightsBanner = () => {
  const { trackEvent } = useTracking()
  const screenDimensions = useScreenDimensions()
  const isIPad = screenDimensions.width > 700

  return (
    <Flex width={screenDimensions.width} flexDirection="row">
      <Flex
        style={{ width: screenDimensions.width / 2 }}
        alignItems="flex-start"
        justifyContent="center"
        backgroundColor="mono5"
      >
        <Flex mx={2}>
          <Text variant={isIPad ? "lg-display" : "sm-display"} color="mono100" mt={2}>
            Unlock More Insights
          </Text>
          <Text mt={1} mb={2} variant={isIPad ? "md" : "xs"} color="mono60">
            Add your artworks and get more market insights about your collection.
          </Text>
          <Button
            mt={2}
            mb={2}
            size="small"
            testID="activate-more-market-insights-banner"
            onPress={() => {
              trackEvent(tracks.tappedUploadAnotherArtwork())
              navigate("my-collection/artworks/new", {
                passProps: {
                  source: Tab.insights,
                },
              })
            }}
          >
            Upload Artwork
          </Button>
        </Flex>
      </Flex>

      <BackgroundImage
        style={{ minWidth: screenDimensions.width / 2 }}
        source={require("images/MCInsights_banner_backgound_image.webp")}
      />
    </Flex>
  )
}

const tracks = {
  tappedUploadAnotherArtwork: () => ({
    action: ActionType.tappedUploadAnotherArtwork,
    context_screen_owner_type: OwnerType.myCollectionInsights,
  }),
}
