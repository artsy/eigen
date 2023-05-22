import { ActionType, AddedArtworkToArtworkList, OwnerType } from "@artsy/cohesion"
import { Box, BoxProps, Button, Spacer, Text } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ResultAction } from "app/Components/ArtworkLists/types"
import { useUpdateArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { FC } from "react"
import { useTracking } from "react-tracking"

export const SelectArtworkListsForArtworkFooter: FC<BoxProps> = (props) => {
  const { state, addingArtworkListIDs, removingArtworkListIDs, onSave } = useArtworkListsContext()
  const { dismiss } = useBottomSheetModal()
  const { trackEvent } = useTracking()
  const { selectedTotalCount } = state
  const hasChanges = addingArtworkListIDs.length !== 0 || removingArtworkListIDs.length !== 0
  const artwork = state.artwork!
  const totalCount =
    selectedTotalCount + addingArtworkListIDs.length - removingArtworkListIDs.length

  const [commit, mutationInProgress] = useUpdateArtworkListsForArtwork(artwork.id)

  const trackAddedArtworkToArtworkLists = () => {
    const event: AddedArtworkToArtworkList = {
      action: ActionType.addedArtworkToArtworkList,
      context_owner_id: artwork.internalID,
      // TODO: Keep artwork slug in ArtworkEntity
      // context_owner_slug: artwork.slug,
      context_owner_type: OwnerType.artwork,
      artwork_ids: [artwork.internalID],
      owner_ids: addingArtworkListIDs,
    }

    trackEvent(event)
  }

  const handleSave = () => {
    commit({
      variables: {
        artworkID: artwork.internalID,
        input: {
          artworkIDs: [artwork.internalID],
          addToCollectionIDs: addingArtworkListIDs,
          removeFromCollectionIDs: removingArtworkListIDs,
        },
      },
      onCompleted: () => {
        if (addingArtworkListIDs.length > 0) {
          trackAddedArtworkToArtworkLists()
        }

        dismiss(ArtworkListsViewName.SelectArtworkListsForArtwork)
        onSave({
          action: ResultAction.ModifiedArtworkLists,
        })
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
    <Box {...props}>
      <Text variant="xs" textAlign="center">
        {getSelectedListsCountText(totalCount)}
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
