import { Button, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { BottomSheetView, useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { navigate } from "app/system/navigation/navigate"
import { FC, useMemo } from "react"

export interface BottomSheetAlert {
  id: string
  title: string
  artworksCount: number
}

interface AlertBottomSheetProps {
  alert: BottomSheetAlert
  onDismiss: () => void
}

export const AlertBottomSheet: FC<AlertBottomSheetProps> = ({
  alert: { id, title, artworksCount },
  onDismiss,
}) => {
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])
  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

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
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      visible
      name="AlertBottomSheet"
      onDismiss={onDismiss}
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <Flex flex={1} mb={4} mx={2} alignItems="center">
          <Join separator={<Spacer y={2} />}>
            <Text variant="sm" fontWeight="bold">
              {title}
            </Text>

            <Button onPress={navigateToEditScreen} block width={100}>
              Edit Alert
            </Button>

            <Button onPress={navigateToArtworks} variant="outline" block width={100}>
              View Artworks{" "}
              <Text color="blue100" variant="xs">
                {artworksCount}
              </Text>
            </Button>
          </Join>
        </Flex>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
