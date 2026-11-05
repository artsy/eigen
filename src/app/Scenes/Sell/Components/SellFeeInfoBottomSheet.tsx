import { Button, Flex, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface SellFeeInfoBottomSheetProps {
  visible: boolean
  onDismiss: () => void
}

export const SellFeeInfoBottomSheet: React.FC<SellFeeInfoBottomSheetProps> = ({
  visible,
  onDismiss,
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const color = useColor()

  return (
    <AutomountedBottomSheetModal
      sentryName="SellFeeInfoBottomSheet"
      visible={visible}
      backgroundStyle={{ backgroundColor: color("mono0") }}
      onDismiss={onDismiss}
    >
      <BottomSheetView style={{ paddingHorizontal: space(2), paddingBottom: bottom + space(2) }}>
        <Flex pt={1} gap={2}>
          <Text variant="md">Artsy's fee</Text>
          <Text variant="sm" color="mono60">
            Artsy charges a flat 15% fee on the sale price. This covers listing your work on Artsy,
            payment processing, buyer support, and fraud protection, so you don't have to manage any
            of it yourself. It's deducted automatically from your sale price; there are no upfront
            or hidden costs.
          </Text>

          <Button block haptic variant="fillDark" onPress={onDismiss}>
            Got it
          </Button>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
