import { Flex, Join, Separator, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { BottomSheetView, useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { noop } from "lodash"
import { FC, useMemo } from "react"

interface ItemProps {
  label: string
  onPress: () => void
}

const Item: FC<ItemProps> = ({ label, onPress }) => {
  return (
    <Touchable onPress={onPress}>
      <Flex p={2}>
        <Text variant="sm-display">{label}</Text>
      </Flex>
    </Touchable>
  )
}

interface ManageArtworkListViewProps {
  onDismiss: () => void
}

export const ManageArtworkListView: FC<ManageArtworkListViewProps> = ({ onDismiss }) => {
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])
  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

  return (
    <AutomountedBottomSheetModal
      visible
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      onDismiss={onDismiss}
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <ArtworkListsBottomSheetSectionTitle>Manage list</ArtworkListsBottomSheetSectionTitle>

        <Join separator={<Separator my={1} />}>
          <Item label="Edit List" onPress={noop} />
          <Item label="Delete List" onPress={noop} />
        </Join>

        <Spacer y={2} />
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
