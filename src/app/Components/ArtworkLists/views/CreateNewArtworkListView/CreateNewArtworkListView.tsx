import { Flex, Spacer } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { useCallback } from "react"
import { CreateNewArtworkListForm } from "./components/CreateNewArtworkListForm"

export const CreateNewArtworkListView = () => {
  const { dispatch } = useArtworkListsContext()
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
      <Flex px={2} mt={2} mb={`${bottomOffset}px`}>
        <ArtworkListsBottomSheetSectionTitle>New list</ArtworkListsBottomSheetSectionTitle>

        <Spacer y={2} />

        <CreateNewArtworkListForm />
      </Flex>
    </AutoHeightBottomSheet>
  )
}
