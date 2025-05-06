import { Button, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Platform } from "react-native"

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
  // Platform specific code for the bottom sheet
  // due to being rendered differently on android vs ios
  // see eigen https://github.com/artsy/eigen/pull/11216 for screenshots
  const bottomSheetViewStyles = Platform.OS === "ios" ? { flex: 1 } : {}

  return (
    <AutomountedBottomSheetModal
      enableDynamicSizing
      visible
      name="AlertBottomSheet"
      onDismiss={onDismiss}
    >
      <BottomSheetView style={bottomSheetViewStyles}>
        <Flex mb={4} mx={2} alignItems="center">
          <Join separator={<Spacer y={2} />}>
            <Text variant="sm">{title}</Text>

            <RouterLink to={`favorites/alerts/${id}/edit`} onPress={onDismiss} hasChildTouchable>
              <Button block width={100}>
                Edit Alert
              </Button>
            </RouterLink>

            <RouterLink
              to={`favorites/alerts/${id}/artworks`}
              onPress={onDismiss}
              hasChildTouchable
            >
              <Button variant="outline" block width={100}>
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
            </RouterLink>
          </Join>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
