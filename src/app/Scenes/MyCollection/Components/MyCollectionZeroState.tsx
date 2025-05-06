import { ActionType, AddCollectedArtwork, ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Button, Flex, Tabs, Text, useSpace } from "@artsy/palette-mobile"
import { ZeroState } from "app/Components/States/ZeroState"
import { ModalCarousel } from "app/Scenes/HomeView/Components/ModalCarouselComponents/ModalCarousel"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { useZeroStateDimensions } from "app/Scenes/MyCollection/utils/zeroStateWidth"
import { RouterLink } from "app/system/navigation/RouterLink"
import { isFontScaleLarge } from "app/utils/accessibility"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { debounce } from "lodash"
import { useState } from "react"
import { Image, RefreshControlProps } from "react-native"
import { useTracking } from "react-tracking"

export const MyCollectionZeroState: React.FC<{
  RefreshControl?: React.ReactElement<
    RefreshControlProps,
    string | React.JSXElementConstructor<any>
  >
}> = ({ RefreshControl }) => {
  const { trackEvent } = useTracking()

  const space = useSpace()
  const { width: zeroStateWidth } = useZeroStateDimensions()

  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  const [isMyCollectionModalVisible, setIsMyCollectionModalVisible] = useState(false)

  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)

  const image = require("images/my-collection-empty-state.webp")

  const showAddToMyCollectionBottomSheet = debounce(() => {
    setViewKind({ viewKind: "Add" })
  }, 100)

  if (enableRedesignedSettings) {
    return (
      <Tabs.ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={RefreshControl}>
        <Flex>
          <ModalCarousel
            isVisible={isMyCollectionModalVisible}
            toggleModal={(isVisible) => setIsMyCollectionModalVisible(isVisible)}
          />
          <ZeroState
            minHeight={0}
            showBorder
            bigTitle="Know Your Collection Better"
            subtitle="Manage your collection online and get free market insights."
            image={
              <Image
                source={require("images/my-collection-empty-state.webp")}
                resizeMode="cover"
                style={{
                  width: zeroStateWidth,
                  minHeight: 150,
                  marginTop: space(2),
                }}
              />
            }
            callToAction={
              <Flex
                gap={2}
                flexDirection={isFontScaleLarge() ? "column" : "row"}
                justifyContent="space-evenly"
              >
                <RouterLink to="/my-collection/artworks/new" hasChildTouchable>
                  <Button
                    testID="add-artwork-button-zero-state"
                    onPress={() => {
                      trackEvent(tracks.addCollectedArtwork())
                    }}
                    block={isFontScaleLarge()}
                  >
                    Add Artworks
                  </Button>
                </RouterLink>
                <Button
                  variant="outline"
                  onPress={() => {
                    setIsMyCollectionModalVisible(true)
                  }}
                  block={isFontScaleLarge()}
                >
                  Learn More
                </Button>
              </Flex>
            }
          />
        </Flex>
      </Tabs.ScrollView>
    )
  }

  return (
    <Tabs.ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box mt={4}>
        <ModalCarousel
          isVisible={isMyCollectionModalVisible}
          toggleModal={(isVisible) => setIsMyCollectionModalVisible(isVisible)}
        />
        <ZeroState
          bigTitle="Know Your Collection Better"
          subtitle="Manage your collection online and get free market insights."
          image={
            <Image
              source={image}
              resizeMode="contain"
              style={{
                alignSelf: "center",
                marginVertical: space(2),
              }}
            />
          }
          callToAction={
            <>
              <Button
                testID="add-artwork-button-zero-state"
                onPress={() => {
                  trackEvent(tracks.addCollectedArtwork())
                  showAddToMyCollectionBottomSheet()
                }}
                block
              >
                Add to My Collection
              </Button>
              <Flex alignItems="center" pt={2}>
                <Text
                  onPress={() => {
                    setIsMyCollectionModalVisible(true)
                  }}
                >
                  Learn More
                </Text>
              </Flex>
            </>
          }
        />
      </Box>
    </Tabs.ScrollView>
  )
}

export const tracks = {
  addCollectedArtwork: (): AddCollectedArtwork => ({
    action: ActionType.addCollectedArtwork,
    context_module: ContextModule.myCollectionHome,
    context_owner_type: OwnerType.myCollection,
    platform: "mobile",
  }),
}
