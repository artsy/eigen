import { ZeroState } from "app/Components/States/ZeroState"
import { navigate, popToRoot } from "app/navigation/navigate"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Button, useSpace } from "palette"
import { Image } from "react-native"

export const MyCollectionInsightsEmptyState = () => {
  const space = useSpace()

  const showMedianImage = useFeatureFlag("AREnableMyCollectionInsightsMedianPrice")
  const image = showMedianImage
    ? require("images/my-collection-insights-empty-state-median.webp")
    : require("images/my-collection-insights-empty-state.webp")

  return (
    <ZeroState
      bigTitle="Gain Deeper Knowledge of your Collection"
      subtitle="Get free market insights about the artists you collect."
      image={
        <Image
          source={image}
          resizeMode="contain"
          style={{ alignSelf: "center", marginVertical: space(2) }}
        />
      }
      callToAction={
        <>
          <Button
            block
            onPress={() => {
              navigate("my-collection/artworks/new", {
                passProps: { mode: "add", source: Tab.insights, onSuccess: popToRoot },
              })
            }}
          >
            Upload Artwork
          </Button>
        </>
      }
    <Flex px={2} testID="my-collection-insights-empty-state">
      <Text variant="sm-display" textAlign="center">
        Gain deeper knowledge of your collection
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
        Upload Artwork
      </Button>
    </Flex>
  )
}

            ////// WOWOWO
