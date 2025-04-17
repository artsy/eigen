import { ActionType, DeletedArtworkList, OwnerType } from "@artsy/cohesion"
import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { captureMessage } from "@sentry/react-native"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { useArtworkListToast } from "app/Components/ArtworkLists/useArtworkListsToast"
import {
  AutoHeightBottomSheet,
  AutoHeightBottomSheetProps,
} from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { goBack } from "app/system/navigation/navigate"
import { FC } from "react"
import { useTracking } from "react-tracking"
import { useDeleteArtworkList } from "./useDeleteArtworkList"

const NAME = "deleteArtworkListView"

interface DeleteArtworkListViewProps extends Omit<AutoHeightBottomSheetProps, "children"> {
  artworkListEntity: HeaderMenuArtworkListEntity
  onDismiss: () => void
}

export const DeleteArtworkListView: FC<DeleteArtworkListViewProps> = ({
  artworkListEntity,
  ...rest
}) => {
  const bottomOffset = useArtworkListsBottomOffset(2)
  const toast = useArtworkListToast()
  const { trackEvent } = useTracking()
  const { dismiss } = useBottomSheetModal()
  const [commit, isArtworkListDeleting] = useDeleteArtworkList()

  const closeView = () => {
    dismiss(NAME)
  }

  const trackAnalytics = () => {
    const event: DeletedArtworkList = {
      action: ActionType.deletedArtworkList,
      context_owner_type: OwnerType.saves,
      owner_id: artworkListEntity.internalID,
    }

    trackEvent(event)
  }

  const deleteArtworkList = () => {
    commit({
      variables: {
        input: {
          id: artworkListEntity.internalID,
        },
      },
      onCompleted: () => {
        toast.changesSaved()
        trackAnalytics()
        goBack()
      },
      onError: (error) => {
        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useDeleteArtworkList ${error.message}`)
        }
      },
    })
  }

  return (
    <AutoHeightBottomSheet name={NAME} {...rest}>
      <Flex mt={1} mx={2} mb={`${bottomOffset}px`}>
        <ArtworkListsBottomSheetSectionTitle>
          Delete {artworkListEntity.title} list?
        </ArtworkListsBottomSheetSectionTitle>

        <Text variant="sm" my={2} color="mono60">
          You’ll lose any works that are only saved on this list.
        </Text>

        <Spacer y={2} />

        <Button block loading={isArtworkListDeleting} onPress={deleteArtworkList}>
          Yes, Delete List
        </Button>

        <Spacer y={1} />

        <Button block variant="outline" onPress={closeView}>
          Back
        </Button>
      </Flex>
    </AutoHeightBottomSheet>
  )
}
