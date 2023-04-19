import { Button, Spacer } from "@artsy/palette-mobile"
import { BottomSheetView, useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { BottomSheetTextInput } from "app/Components/ArtworkLists/components/BottomSheetInput"
import { useMemo, useState } from "react"

export const CreateNewArtworkListView = () => {
  const [name, setName] = useState("")
  const { dispatch } = useArtworkListsContext()
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

  const closeCurrenView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: false,
    })
  }

  const setRecentlyAddedArtworkList = () => {
    dispatch({
      type: "SET_RECENTLY_ADDED_ARTWORK_LIST",
      payload: {
        internalID: "recently-created-artwork-list-id",
        name,
      },
    })
  }

  const handleSave = () => {
    // Run save mutation
    setRecentlyAddedArtworkList()
    closeCurrenView()
  }

  return (
    <AutomountedBottomSheetModal
      visible
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      onDismiss={closeCurrenView}
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <BottomSheetTextInput placeholder="Placeholder" value={name} onChangeText={setName} />

        <Spacer y={2} />

        <Button width="100%" block onPress={handleSave}>
          Save
        </Button>

        <Spacer y={2} />

        <Button width="100%" block variant="outline" onPress={closeCurrenView}>
          Back
        </Button>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
