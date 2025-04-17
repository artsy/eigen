import { Button, Flex, Text } from "@artsy/palette-mobile"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate } from "app/system/navigation/navigate"
import { useTracking } from "react-tracking"
import { tracks } from "./MyCollectionZeroState"

export const MyCollectionZeroStateArtworks: React.FC = () => {
  const { trackEvent } = useTracking()

  return (
    <>
      <Text variant="md">Add your artworks</Text>
      <Text variant="xs" color="mono60">
        Access price and market insights and build an online record of your collection.
      </Text>
      <Flex mt={2} flexDirection="row">
        <Button
          testID="add-artwork-button-zero-artworks-state"
          onPress={() => {
            trackEvent(tracks.addCollectedArtwork())
            navigate("my-collection/artworks/new", {
              passProps: {
                source: Tab.collection,
              },
            })
          }}
          variant="outline"
          size="small"
        >
          Add Artworks
        </Button>
      </Flex>
    </>
  )
}
