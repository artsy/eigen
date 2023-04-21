import { Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { SelectArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtwork"
import { useState } from "react"

const SNAP_POINTS = ["50%", "95%"]

export const SelectArtworkListsForArtworkView = () => {
  const { state, dispatch, reset } = useArtworkListsContext()
  const [visible, setVisible] = useState(true)

  const openCreateNewArtworkListView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: true,
    })
  }

  const handleSave = () => {
    // TODO: Save mutation
    setVisible(false)
  }

  return (
    <AutomountedBottomSheetModal visible={visible} snapPoints={SNAP_POINTS} onDismiss={reset}>
      <ArtworkListsBottomSheetSectionTitle>
        Select lists for this artwork
      </ArtworkListsBottomSheetSectionTitle>

      {!!state.recentlyAddedArtworkList && (
        <Box bg="green100">
          <Text variant="xs" color="white100">
            List Created
          </Text>
          <Text variant="xs" color="white100">
            {state.recentlyAddedArtworkList.name}
          </Text>
        </Box>
      )}

      <Button width="100%" block onPress={openCreateNewArtworkListView}>
        Create New List
      </Button>

      <Spacer y={2} />

      <SelectArtworkListsForArtwork />

      <Spacer y={2} />

      <Button width="100%" block onPress={handleSave}>
        Save
      </Button>
    </AutomountedBottomSheetModal>
  )
}
