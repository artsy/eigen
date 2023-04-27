import { Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { useUpdateArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"

export const SelectArtworkListsForArtworkFooter = () => {
  const { state } = useArtworkListsContext()
  const { dismiss } = useBottomSheetModal()
  const { addingArtworkListIDs, removingArtworkListIDs, selectedArtworkListIDs } = state
  const hasChanges = addingArtworkListIDs.length !== 0 || removingArtworkListIDs.length !== 0
  const artwork = state.artwork!

  const [commit, mutationInProgress] = useUpdateArtworkListsForArtwork(artwork.id)

  const handleSave = () => {
    commit({
      variables: {
        artworkID: artwork.internalID,
        input: {
          artworkIDs: [artwork.internalID],
          addToCollectionIDs: state.addingArtworkListIDs,
          removeFromCollectionIDs: state.removingArtworkListIDs,
        },
      },
      onCompleted: () => {
        dismiss(ArtworkListsViewName.SelectArtworkListsForArtwork)
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(error?.stack!)
        }
      },
    })
  }

  return (
    <Box p={2}>
      <Text variant="xs" textAlign="center">
        {getSelectedListsCountText(selectedArtworkListIDs.length)}
      </Text>

      <Spacer y={1} />

      <Button
        width="100%"
        block
        disabled={!hasChanges}
        loading={mutationInProgress}
        onPress={handleSave}
      >
        Save
      </Button>
    </Box>
  )
}

const getSelectedListsCountText = (count: number) => {
  if (count === 1) {
    return "1 list selected"
  }

  return `${count} lists selected`
}
