import { ArtworkIcon, GroupIcon } from "@artsy/icons/native"
import { Flex, Text, useSpace } from "@artsy/palette-mobile"
import { BOTTOM_TABS_HEIGHT } from "@artsy/palette-mobile/dist/elements/Screen/StickySubHeader"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { MenuItem } from "app/Components/MenuItem"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const MyCollectionBottomSheetModalAdd: React.FC<{}> = () => {
  const setViewKind = MyCollectionTabsStore.useStoreActions((state) => state.setViewKind)

  const { bottom } = useSafeAreaInsets()
  const space = useSpace()

  return (
    <BottomSheetView
      style={{
        paddingBottom: bottom + BOTTOM_TABS_HEIGHT + space(2),
      }}
    >
      <Flex pb={1}>
        <Text textAlign="center" variant="sm" pt={2} pb={2}>
          Add to My Collection
        </Text>
        <MenuItem
          title="Add Artists"
          description="List the artists in your collection."
          onPress={() => {
            setViewKind({ viewKind: null })

            navigate("my-collection/collected-artists/new", {
              passProps: {
                source: Tab.collection,
              },
            })
          }}
          icon={<GroupIcon height={24} width={24} fill="mono100" />}
          alignItems="flex-start"
        />

        <MenuItem
          title="Add Artworks"
          description="Upload images and details of an artwork in your collection."
          onPress={() => {
            setViewKind({ viewKind: null })

            navigate("my-collection/artworks/new", {
              passProps: {
                source: Tab.collection,
              },
            })
          }}
          icon={<ArtworkIcon height={24} width={24} />}
          alignItems="flex-start"
        />
      </Flex>
    </BottomSheetView>
  )
}
