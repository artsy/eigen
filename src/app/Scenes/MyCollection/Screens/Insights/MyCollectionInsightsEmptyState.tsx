import { Button, Flex, Tabs, useSpace } from "@artsy/palette-mobile"
import { ZeroState } from "app/Components/States/ZeroState"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { useZeroStateDimensions } from "app/Scenes/MyCollection/utils/zeroStateWidth"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Image } from "react-native"

export const MyCollectionInsightsEmptyState = () => {
  const space = useSpace()
  const { width: zeroStateWidth } = useZeroStateDimensions()

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
