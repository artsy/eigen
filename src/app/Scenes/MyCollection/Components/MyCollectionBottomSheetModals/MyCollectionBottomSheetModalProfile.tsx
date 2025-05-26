import { Flex, Spacer, Text, Touchable, Join } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { SNAP_POINTS } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { InteractionManager } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const MyCollectionBottomSheetModalProfile: React.FC<{
  isVisible: boolean
}> = ({ isVisible }) => {
  const { bottom } = useSafeAreaInsets()
  const setViewKind = MyCollectionTabsStore.useStoreActions((state) => state.setViewKind)

  return (
    <AutomountedBottomSheetModal
      visible={isVisible}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing
      onDismiss={() => {
        setViewKind({ viewKind: null })
      }}
      name="LearnMoreBottomSheet"
    >
      <BottomSheetScrollView>
        <Flex px={2}>
          <Text variant="lg-display" pt={2}>
            Profile
          </Text>

          <Spacer y={2} />

          <Join separator={<Spacer y={1} />}>
            <Touchable
              accessibilityRole="button"
              onPress={() => {
                setViewKind({ viewKind: null })
                InteractionManager.runAfterInteractions(() => {
                  navigate("/my-profile/edit")
                })
              }}
            >
              <Text py={2}>Edit Profile</Text>
            </Touchable>
            <Touchable
              accessibilityRole="button"
              onPress={() => {
                setViewKind({ viewKind: null })
                InteractionManager.runAfterInteractions(() => {
                  navigate("my-collection/artworks/new", {
                    passProps: {
                      source: Tab.collection,
                    },
                  })
                })
              }}
            >
              <Text py={2}>Add Artwork</Text>
            </Touchable>
            <Touchable
              accessibilityRole="button"
              onPress={() => {
                setViewKind({ viewKind: null })
                InteractionManager.runAfterInteractions(() => {
                  navigate("my-collection/collected-artists/new", {
                    passProps: {
                      source: Tab.collection,
                    },
                  })
                })
              }}
            >
              <Text py={2}>Add Artist</Text>
            </Touchable>
          </Join>

          {/* This is a spacer to make sure the bottom sheet is not covered by the system bottom insets */}
          <Spacer y={`${bottom}px`} />
        </Flex>
      </BottomSheetScrollView>
    </AutomountedBottomSheetModal>
  )
}
