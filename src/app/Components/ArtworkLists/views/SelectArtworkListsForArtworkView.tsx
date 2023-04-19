import { Button, Spacer } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"

const SNAP_POINTS = ["50%", "95%"]

export const SelectArtworkListsForArtworkView = () => {
  const { dispatch, reset } = useArtworkListsContext()

  const openCreateNewArtworkListView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: true,
    })
  }

  return (
    <AutomountedBottomSheetModal visible snapPoints={SNAP_POINTS} onDismiss={reset}>
      <Button width="100%" block onPress={openCreateNewArtworkListView}>
        Create New List
      </Button>

      <Spacer y={2} />

      <Button width="100%" block onPress={reset}>
        Save
      </Button>
    </AutomountedBottomSheetModal>
  )
}
