import { navigate, popToRoot } from "app/navigation/navigate"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Button, Flex, Text, useSpace } from "palette"
import { Image } from "react-native"

export const MyCollectionInsightsEmptyState = () => {
  const space = useSpace()

  const showMedianImage = useFeatureFlag("AREnableMyCollectionInsightsMedianPrice")
  const image = showMedianImage
    ? require("images/my-collection-empty-state-median.webp")
    : require("images/my-collection-empty-state.webp")

  return (
    <Flex px={2} testID="my-collection-insights-empty-state">
      <Text variant="md" textAlign="center">
        Gain deeper knowledge of your artwork
      </Text>
      <Text variant="xs" color="black60" textAlign="center">
        Get free market insights about the artists you collect.
      </Text>
      <Image
        source={image}
        resizeMode="contain"
        style={{
          alignSelf: "center",
          height: 120,
          width: 327,
          marginVertical: space(2),
        }}
      />
      <Button
        block
        onPress={() =>
          navigate("my-collection/artworks/new", {
            passProps: {
              mode: "add",
              source: Tab.insights,
              onSuccess: popToRoot,
            },
          })
        }
      >
        Upload Your Artwork
      </Button>
    </Flex>
  )
}
