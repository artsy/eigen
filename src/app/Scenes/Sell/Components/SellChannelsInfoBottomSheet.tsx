import { Button, Flex, Separator, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const CHANNELS = [
  {
    title: "Auction",
    description:
      "Your work is offered at auction, where competitive bidding sets the price. Best for works with strong collector demand.",
    journey:
      "we only need the work's condition and location. A specialist will then contact you directly to discuss next steps.",
  },
  {
    title: "Marketplace",
    description:
      "Your work is listed on Artsy at a fixed asking price that you set, and buyers can purchase or make an offer at any time.",
    journey:
      "we help estimate a value range to support you in choosing a list price, and ask for additional shipping and packaging details.",
  },
]

interface SellChannelsInfoBottomSheetProps {
  visible: boolean
  onDismiss: () => void
}

export const SellChannelsInfoBottomSheet: React.FC<SellChannelsInfoBottomSheetProps> = ({
  visible,
  onDismiss,
}) => {
  const { bottom } = useSafeAreaInsets()
  const space = useSpace()
  const color = useColor()

  return (
    <AutomountedBottomSheetModal
      sentryName="SellChannelsInfoBottomSheet"
      visible={visible}
      backgroundStyle={{ backgroundColor: color("mono0") }}
      onDismiss={onDismiss}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: space(2), paddingBottom: bottom + space(2) }}
      >
        <Flex pt={1} gap={2}>
          <Text variant="md">Sales channels</Text>
          <Text variant="sm" color="mono60">
            We review demand for each work and recommend the channel most likely to achieve the best
            result. Different works suit different channels, depending on the artist, medium and
            value.
          </Text>

          {CHANNELS.map((channel) => (
            <Flex key={channel.title} gap={1}>
              <Separator />
              <Text variant="sm-display">{channel.title}</Text>
              <Text variant="sm" color="mono60">
                {channel.description}
              </Text>
              <Text variant="xs" color="mono60">
                <Text variant="xs">Listing journey:</Text> {channel.journey}
              </Text>
            </Flex>
          ))}

          <Button block haptic variant="fillDark" onPress={onDismiss}>
            Got it
          </Button>
        </Flex>
      </BottomSheetScrollView>
    </AutomountedBottomSheetModal>
  )
}
