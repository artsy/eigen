import { ArtworkIcon, Flex, Separator, Text, UserMultiIcon } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { MenuItem } from "app/Components/MenuItem"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { navigate, popToRoot } from "app/system/navigation/navigate"

export const MyCollectionBottomSheetModalAdd: React.FC<{}> = () => {
  const setViewKind = MyCollectionTabsStore.useStoreActions((actions) => actions.setViewKind)

  return (
    <BottomSheetView>
      <Flex>
        <Text textAlign="center" variant="sm" fontWeight="500" pt={2} pb={4}>
          Add to My Collection
        </Text>
        <Separator />
      </Flex>
      <Flex>
        <MenuItem
          title="Add Artists"
          description="List the artists in your collection."
          onPress={() => {
            navigate("my-collection/collected-artists/new")
          }}
          icon={<UserMultiIcon height={24} width={24} />}
          py="40px"
        />
        <Separator />
        <MenuItem
          title="Add Artworks"
          description="Upload images and details of an artwork in your collection."
          onPress={() => {
            navigate("my-collection/artworks/new", {
              passProps: {
                mode: "add",
                source: Tab.collection,
                onSuccess: () => {
                  // hide the bottom sheet
                  setViewKind({ viewKind: null })
                  popToRoot()
                },
              },
            })
          }}
          icon={<ArtworkIcon height={24} width={24} />}
          py="40px"
        />
      </Flex>
    </BottomSheetView>
  )
}
