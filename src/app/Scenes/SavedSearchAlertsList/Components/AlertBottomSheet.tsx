import { Button, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { navigate } from "app/system/navigation/navigate"

export interface BottomSheetAlert {
  id: string
  title: string
  artworksCount: number
}

interface AlertBottomSheetProps {
  alert: BottomSheetAlert
  onDismiss: () => void
}

export const AlertBottomSheet: React.FC<AlertBottomSheetProps> = ({
  alert: { id, title, artworksCount },
  onDismiss,
}) => {
  const navigateToEditScreen = () => {
    onDismiss()
    navigate(`settings/alerts/${id}/edit`)
  }

  const navigateToArtworks = () => {
    onDismiss()
    navigate(`settings/alerts/${id}/artworks`)
  }

  return (
    <AutomountedBottomSheetModal
      enableDynamicSizing
      visible
      name="AlertBottomSheet"
      onDismiss={onDismiss}
    >
      <BottomSheetView>
        <Flex flex={1} mb={4} mx={2} alignItems="center">
          <Join separator={<Spacer y={2} />}>
            <Text variant="sm" fontWeight="bold">
              {title}
            </Text>

            <Button onPress={navigateToEditScreen} block width={100}>
              Edit Alert
            </Button>

            <Button onPress={navigateToArtworks} variant="outline" block width={100}>
              <Flex flexDirection="row">
                <Text variant="sm">View Artworks</Text>
                {/* superscript - change font sizes and lineHeight cautiously */}
                <Text
                  color="blue100"
                  variant="xs"
                  style={{
                    lineHeight: 20,
                    verticalAlign: "top",
                  }}
                >
                  {artworksCount}
                </Text>
              </Flex>
            </Button>
          </Join>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
