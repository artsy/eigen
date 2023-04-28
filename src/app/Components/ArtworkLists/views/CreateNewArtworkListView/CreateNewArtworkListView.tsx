import { Box } from "@artsy/palette-mobile"
import { BottomSheetView, useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkInfo } from "app/Components/ArtworkLists/components/ArtworkInfo"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { useCallback, useMemo } from "react"
import { CreateNewArtworkListForm } from "./components/CreateNewArtworkListForm"

export const CreateNewArtworkListView = () => {
  const { state, dispatch } = useArtworkListsContext()
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], [])

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints)

  const closeCurrentView = useCallback(() => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: false,
    })
  }, [dispatch])

  return (
    <AutomountedBottomSheetModal
      visible
      name={ArtworkListsViewName.CreateNewArtworkLists}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      onDismiss={closeCurrentView}
    >
      <BottomSheetView onLayout={handleContentLayout}>
        <ArtworkListsBottomSheetSectionTitle mt={1}>
          Create a new list
        </ArtworkListsBottomSheetSectionTitle>

        <Box m={2}>
          <ArtworkInfo artwork={state.artwork!} />
        </Box>

        <CreateNewArtworkListForm m={2} />
      </BottomSheetView>
    </AutomountedBottomSheetModal>
  )
}
