import { Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkInfo } from "app/Components/ArtworkLists/components/ArtworkInfo"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { SelectArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtwork"
import { SelectArtworkListsForArtworkFooter } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtworkFooter"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"

const SNAP_POINTS = ["50%", "95%"]

export const SelectArtworkListsForArtworkView = () => {
  const { state, dispatch, reset } = useArtworkListsContext()

  const openCreateNewArtworkListView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: true,
    })
  }

  return (
    <AutomountedBottomSheetModal
      visible
      name={ArtworkListsViewName.SelectArtworkListsForArtwork}
      snapPoints={SNAP_POINTS}
      onDismiss={reset}
    >
      <ArtworkListsBottomSheetSectionTitle>
        Select lists for this artwork
      </ArtworkListsBottomSheetSectionTitle>

      <Box m={2}>
        <ArtworkInfo artwork={state.artwork!} />

        <Spacer y={2} />

        <Button
          variant="outline"
          size="small"
          width="100%"
          block
          onPress={openCreateNewArtworkListView}
        >
          Create New List
        </Button>
      </Box>

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

      <SelectArtworkListsForArtwork />
      <SelectArtworkListsForArtworkFooter />
    </AutomountedBottomSheetModal>
  )
}
