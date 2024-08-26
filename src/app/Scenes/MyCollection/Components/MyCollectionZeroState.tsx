import { ActionType, AddCollectedArtwork, ContextModule, OwnerType } from "@artsy/cohesion"
import { useSpace, Flex, Button, Text, Tabs, Box } from "@artsy/palette-mobile"
import { ZeroState } from "app/Components/States/ZeroState"
import { ModalCarousel } from "app/Scenes/Home/Components/ModalCarouselComponents/ModalCarousel"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { debounce } from "lodash"
import { useState } from "react"
import { Image } from "react-native"
import { useTracking } from "react-tracking"

export const MyCollectionZeroState: React.FC = () => {
  const { trackEvent } = useTracking()
  const space = useSpace()

  const [isMyCollectionModalVisible, setIsMyCollectionModalVisible] = useState(false)

  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)

  const image = require("images/my-collection-empty-state.webp")

  const showAddToMyCollectionBottomSheet = debounce(() => {
    setViewKind({ viewKind: "Add" })
  }, 100)

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
