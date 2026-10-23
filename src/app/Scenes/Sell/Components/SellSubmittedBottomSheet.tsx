import { Button, Flex, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
// eslint-disable-next-line no-restricted-imports
import { goBack } from "app/system/navigation/navigate"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface SellSubmittedBottomSheetProps {
  visible: boolean
  onDismiss: () => void
}

export const SellSubmittedBottomSheet: React.FC<SellSubmittedBottomSheetProps> = ({
  visible,
  onDismiss,
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const color = useColor()

  return (
    <AutomountedBottomSheetModal
      sentryName="SellSubmittedBottomSheet"
      visible={visible}
      backgroundStyle={{ backgroundColor: color("mono0") }}
      onDismiss={onDismiss}
    >
      <BottomSheetView style={{ paddingHorizontal: space(2), paddingBottom: bottom + space(2) }}>
        <Flex pt={1} gap={2}>
          <Text variant="lg-display" textAlign="center">
            Submitted!
          </Text>

          <Button block haptic variant="fillDark" onPress={() => goBack()}>
            Return to My Collection
          </Button>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
