import { Box, Button, Flex, Tabs, useSpace } from "@artsy/palette-mobile"
import { ZeroState } from "app/Components/States/ZeroState"
import { useZeroStateDimensions } from "app/Scenes/MyCollection/utils/zeroStateWidth"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Image } from "react-native"

export const MyCollectionInsightsEmptyState = () => {
  const space = useSpace()
  const { width: zeroStateWidth } = useZeroStateDimensions()

  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  if (enableRedesignedSettings) {
    return (
      <Tabs.ScrollView>
        <ZeroState
          minHeight={0}
          showBorder
          bigTitle="Gain deeper knowledge of your collection"
          subtitle="Get free market insights about the artists you collect."
          image={
            <Image
              source={require("images/my-collection-insights-empty-state.webp")}
              resizeMode="cover"
              style={{
                width: zeroStateWidth,
                minHeight: 150,
                marginTop: space(2),
              }}
            />
          }
          callToAction={
            <Flex>
              <RouterLink
                to="my-collection/artworks/new"
                hasChildTouchable
                navigationProps={{
                  source: Tab.insights,
                }}
                onPress={() => {
                  // TODO: Implement analytics
                }}
              >
                <Button testID="add-artwork-button-zero-state" block>
                  Add Artworks
                </Button>
              </RouterLink>
            </Flex>
          }
        />
      </Tabs.ScrollView>
    )
  }

  return (
    <Tabs.ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box mt={4}>
        <ZeroState
          bigTitle="Gain deeper knowledge of your collection"
          subtitle="Get free market insights about the artists you collect."
          image={
            <Image
              source={require("images/my-collection-insights-empty-state-median.webp")}
              resizeMode="contain"
              style={{ alignSelf: "center", marginVertical: space(2) }}
            />
          }
          callToAction={
            <>
              <RouterLink
                to="my-collection/artworks/new"
                hasChildTouchable
                navigationProps={{
                  source: Tab.insights,
                }}
              >
                <Button block>Upload Artwork</Button>
              </RouterLink>
            </>
          }
        />
      </Box>
    </Tabs.ScrollView>
  )
}
