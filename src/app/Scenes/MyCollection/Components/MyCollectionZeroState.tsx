import { ActionType, AddCollectedArtwork, ContextModule, OwnerType } from "@artsy/cohesion"
import { useSpace, Flex, LockIcon, Button, Text, Tabs, Box } from "@artsy/palette-mobile"
import { ZeroState } from "app/Components/States/ZeroState"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate, popToRoot } from "app/system/navigation/navigate"
import { Image } from "react-native"
import { useTracking } from "react-tracking"

export const MyCollectionZeroState: React.FC = () => {
  const { trackEvent } = useTracking()
  const space = useSpace()

  const image = require("images/my-collection-empty-state.webp")

  return (
    <Tabs.ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box mt={4}>
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
                  navigate("my-collection/artworks/new", {
                    passProps: {
                      mode: "add",
                      source: Tab.collection,
                      onSuccess: popToRoot,
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
