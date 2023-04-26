import { Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { SelectArtworkListsForArtworkFooterMutation } from "__generated__/SelectArtworkListsForArtworkFooterMutation.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { graphql, useMutation } from "react-relay"

export const SelectArtworkListsForArtworkFooter = () => {
  const { state } = useArtworkListsContext()
  const { dismiss } = useBottomSheetModal()
  const { addingArtworkListIDs, removingArtworkListIDs, selectedArtworkListIDs } = state
  const hasChanges = addingArtworkListIDs.length !== 0 || removingArtworkListIDs.length !== 0
  const artwork = state.artwork!

  const [commit, mutationInProgress] =
    useMutation<SelectArtworkListsForArtworkFooterMutation>(SaveArtworkListsMutation)

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
        // TODO: Log error
        console.log("[debug] error", error)
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

const SaveArtworkListsMutation = graphql`
  mutation SelectArtworkListsForArtworkFooterMutation(
    $artworkID: String!
    $input: ArtworksCollectionsBatchUpdateInput!
  ) {
    artworksCollectionsBatchUpdate(input: $input) {
      responseOrError {
        ... on ArtworksCollectionsBatchUpdateSuccess {
          addedToArtworkLists: addedToCollections {
            internalID
            default
            ...ArtworkListItem_item @arguments(artworkID: $artworkID)
          }
          removedFromArtworkLists: removedFromCollections {
            internalID
            default
            ...ArtworkListItem_item @arguments(artworkID: $artworkID)
          }
        }
        ... on ArtworksCollectionsBatchUpdateFailure {
          mutationError {
            statusCode
          }
        }
      }
    }
  }
`
