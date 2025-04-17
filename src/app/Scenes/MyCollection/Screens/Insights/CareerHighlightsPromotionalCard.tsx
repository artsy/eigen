import { Button, Flex, Text } from "@artsy/palette-mobile"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { Image } from "react-native"

export const CareerHighlightsPromotionalCard: React.FC = () => {
  const { width } = useScreenDimensions()

  return (
    <Flex flexGrow={1} width={width} testID="promo-card">
      <Flex mx={2} position="relative">
        <Text mt={2} variant="lg-display">
          Discover Career Highlights for Your Artists
        </Text>
        <Text mt={2} variant="sm-display" color="mono60">
          Add artworks to reveal career highlights for your artists.
        </Text>
        <Button
          mt={4}
          block
          onPress={() => {
            dismissModal()
            requestAnimationFrame(() => {
              navigate("my-collection/artworks/new", {
                passProps: {
                  source: Tab.insights,
                },
              })
            })
          }}
        >
          Upload Artwork
        </Button>
      </Flex>

      <Flex mt={4} flex={1} justifyContent="flex-end">
        <Image
          style={{ width: "100%", height: "100%" }}
          source={require("images/careerHighlightsPromotionalCardImage.webp")}
        />
      </Flex>
    </Flex>
  )
}
