import { ActionType, AddCollectedArtwork, ContextModule, OwnerType } from "@artsy/cohesion"
import { useSpace, Flex, LockIcon, Button, Text, Tabs, Box } from "@artsy/palette-mobile"
import { ZeroState } from "app/Components/States/ZeroState"
import { ModalCarousel } from "app/Scenes/Home/Components/ModalCarouselComponents/ModalCarousel"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { debounce } from "lodash"
import { useState } from "react"
import { Image } from "react-native"
import { useTracking } from "react-tracking"

export const MyCollectionZeroState: React.FC = () => {
  const enableCollectedArtists = useFeatureFlag("AREnableMyCollectionCollectedArtists")
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
            !!enableCollectedArtists ? (
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
            ) : (
              <>
                <Button
                  testID="add-artwork-button-zero-state"
                  onPress={() => {
                    trackEvent(tracks.addCollectedArtwork())
                    navigate("my-collection/artworks/new", {
                      passProps: {
                        source: Tab.collection,
                      },
                    })
                  }}
                  block
                >
                  Upload Artwork
                </Button>
                <Flex flexDirection="row" justifyContent="center" alignItems="center" py={1}>
                  <LockIcon fill="black60" />
                  <Text color="black60" pl={0.5} variant="xs">
                    My Collection is not shared with sellers.
                  </Text>
                </Flex>
              </>
            )
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
