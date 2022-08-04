import { navigate, popToRoot } from "app/navigation/navigate"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { Button, Flex, Text } from "palette"
import { Image } from "react-native"
import { useScreenDimensions } from "shared/hooks"

export const CareerHighlightsPromotionalCard: React.FC = () => {
  const { width } = useScreenDimensions()

  return (
    <Flex flexGrow={1} width={width} testID="promo-card">
      <Flex mx={2} position="relative">
        <Text mt={4} variant="xl">
          Discover Career Highlights for Your Artists
        </Text>
        <Text mt={2} variant="md" color="black60">
          Add artworks to reveal career highlights for your artists.
        </Text>
        <Button
          mt={4}
          block
          onPress={() => {
            navigate("my-collection/artworks/new", {
              passProps: {
                mode: "add",
                source: Tab.insights,
                onSuccess: popToRoot,
              },
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
