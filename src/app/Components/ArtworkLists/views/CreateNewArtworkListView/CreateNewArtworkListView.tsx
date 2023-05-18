import { Box } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkInfo } from "app/Components/ArtworkLists/components/ArtworkInfo"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutoHeightBottomSheet } from "app/Components/ArtworkLists/components/AutoHeightBottomSheet"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { useCallback } from "react"
import { CreateNewArtworkListForm } from "./components/CreateNewArtworkListForm"

export const CreateNewArtworkListView = () => {
  const { state, dispatch } = useArtworkListsContext()
  const bottomOffset = useArtworkListsBottomOffset(2)

  const closeCurrentView = useCallback(() => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: false,
    })
  }, [dispatch])

  return (
    <AutoHeightBottomSheet
      visible
      name={ArtworkListsViewName.CreateNewArtworkLists}
      onDismiss={closeCurrentView}
    >
      <ArtworkListsBottomSheetSectionTitle mt={1}>
        Create a new list
      </ArtworkListsBottomSheetSectionTitle>

      <Box m={2}>
        <ArtworkInfo artwork={state.artwork!} />
      </Box>

      <CreateNewArtworkListForm m={2} mb={`${bottomOffset}px`} />
    </AutoHeightBottomSheet>
  )
}
