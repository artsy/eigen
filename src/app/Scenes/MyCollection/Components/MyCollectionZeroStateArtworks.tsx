import { Button, Text } from "@artsy/palette-mobile"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate, popToRoot } from "app/system/navigation/navigate"
import { useTracking } from "react-tracking"
import { tracks } from "./MyCollectionZeroState"

export const MyCollectionZeroStateArtworks: React.FC = () => {
  const { trackEvent } = useTracking()

  return (
    <>
      <Text variant="md">Add your artworks</Text>
      <Text variant="xs" color="black60">
        Access price and market insights and build an online record of your collection.
      </Text>
      <Button
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
        variant="outline"
        size="small"
        mt={2}
      >
        Add Artworks
      </Button>
    </>
  )
}
