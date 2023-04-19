import { Button } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"

const SNAP_POINTS = ["50%", "95%"]

export const CreateNewArtworkListView = () => {
  const { dispatch } = useArtworkListsContext()

  const closeCurrenView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: false,
    })
  }

  return (
    <AutomountedBottomSheetModal visible snapPoints={SNAP_POINTS} onDismiss={closeCurrenView}>
      <Button width="100%" block variant="outline" onPress={closeCurrenView}>
        Back
      </Button>
    </AutomountedBottomSheetModal>
  )
}
