import { Button, Spacer, Text } from "@artsy/palette-mobile"
import { BottomSheetView, useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { useMemo } from "react"

export const CreateNewArtworkListView = () => {
  const { dispatch } = useArtworkListsContext()
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

  const closeCurrentView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: false,
    })
  }

  const handleSave = () => {
    // TODO: Run save mutation
    closeCurrentView()
  }

  return (
    <AutomountedBottomSheetModal
      visible
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      onDismiss={closeCurrentView}
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <Text>CreateNewArtworkListView</Text>

        <Button width="100%" block onPress={handleSave}>
          Save
        </Button>

        <Spacer y={2} />

        <Button width="100%" block variant="outline" onPress={closeCurrentView}>
          Back
        </Button>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
