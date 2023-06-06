import { ActionType, AddedArtworkToArtworkList } from "@artsy/cohesion"
import { Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ResultAction } from "app/Components/ArtworkLists/types"
import { useUpdateArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useUpdateArtworkListsForArtwork"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { useAnalyticsContext } from "app/system/analytics/AnalyticsContext"
import { FC } from "react"
import { useTracking } from "react-tracking"

const STICKY_BOTTOM_CONTENT_HEIGHT = 120

export const StickyBottomContentPlaceholder = () => {
  return <Box height={STICKY_BOTTOM_CONTENT_HEIGHT} />
}

export const StickyBottomContent: FC<BottomSheetFooterProps> = ({ animatedFooterPosition }) => {
  const { state, addingArtworkListIDs, removingArtworkListIDs, onSave } = useArtworkListsContext()
  const { dismiss } = useBottomSheetModal()
  const { trackEvent } = useTracking()
  const analytics = useAnalyticsContext()
  const { selectedTotalCount } = state
  const hasChanges = addingArtworkListIDs.length !== 0 || removingArtworkListIDs.length !== 0
  const artwork = state.artwork!
  const totalCount =
    selectedTotalCount + addingArtworkListIDs.length - removingArtworkListIDs.length

  const [commit, mutationInProgress] = useUpdateArtworkListsForArtwork(artwork.id)

  const trackAddedArtworkToArtworkLists = () => {
    const event: AddedArtworkToArtworkList = {
      action: ActionType.addedArtworkToArtworkList,
      context_owner_id: analytics.contextScreenOwnerId,
      context_owner_slug: analytics.contextScreenOwnerSlug,
      context_owner_type: analytics.contextScreenOwnerType!,
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
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <Box bg="white100" height={STICKY_BOTTOM_CONTENT_HEIGHT} px={2} justifyContent="center">
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
    </BottomSheetFooter>
  )
}

const getSelectedListsCountText = (count: number) => {
  if (count === 1) {
    return "1 list selected"
  }

  return `${count} lists selected`
}
