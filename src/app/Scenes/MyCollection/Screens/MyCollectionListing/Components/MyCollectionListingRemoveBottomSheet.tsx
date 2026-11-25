import { Button, Flex, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { MyCollectionListingButton } from "app/Scenes/MyCollection/Screens/MyCollectionListing/Components/MyCollectionListingButton"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface MyCollectionListingRemoveBottomSheetProps {
  visible: boolean
  removing: boolean
  onConfirm: () => void
  onDismiss: () => void
}

export const MyCollectionListingRemoveBottomSheet: React.FC<
  MyCollectionListingRemoveBottomSheetProps
> = ({ visible, removing, onConfirm, onDismiss }) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const color = useColor()

  return (
    <AutomountedBottomSheetModal
      sentryName="MyCollectionListingRemoveBottomSheet"
      visible={visible}
      backgroundStyle={{ backgroundColor: color("mono0") }}
      onDismiss={onDismiss}
    >
      <BottomSheetView style={{ paddingHorizontal: space(2), paddingBottom: bottom + space(2) }}>
        <Flex pt={1} gap={2}>
          <Flex gap={1}>
            <Text variant="lg-display" textAlign="center">
              Remove this listing?
            </Text>
            <Text variant="sm" color="mono60" textAlign="center">
              The work stays in your collection but will no longer be listed for sale. You can list
              it again at any time.
            </Text>
          </Flex>

          <Flex gap={1}>
            <MyCollectionListingButton variant="fill" disabled={removing} onPress={onConfirm}>
              Remove listing
            </MyCollectionListingButton>
            <Button block haptic variant="outline" disabled={removing} onPress={onDismiss}>
              Keep listing
            </Button>
          </Flex>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
