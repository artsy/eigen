import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import {
  AutoHeightBottomSheet,
  AutoHeightBottomSheetProps,
} from "app/Components/ArtworkLists/components/AutoHeightBottomSheet"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { useDeleteArtworkList } from "app/Scenes/ArtworkList/views/DeleteArtworkListView/useDeleteArtworkList"
import { goBack } from "app/system/navigation/navigate"
import { FC } from "react"

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
  const { dismiss } = useBottomSheetModal()
  const [commit, isArtworkListDeleting] = useDeleteArtworkList()

  const closeView = () => {
    dismiss(NAME)
  }

  const deleteArtworkList = () => {
    commit({
      variables: {
        input: {
          id: artworkListEntity.internalID,
        },
      },
      onCompleted: () => {
        goBack()
      },
      onError: (error) => {
        // TODO: Handle error (e.g capture for Sentry)
        console.error(error)
      },
    })
  }

  return (
    <AutoHeightBottomSheet name={NAME} {...rest}>
      <Flex mt={1} mx={2} mb={`${bottomOffset}px`}>
        <ArtworkListsBottomSheetSectionTitle>
          Delete {artworkListEntity.title} list?
        </ArtworkListsBottomSheetSectionTitle>

        <Text textAlign="center" variant="sm" my={2}>
          You’ll lose any works that are only saved on this list.
        </Text>

        <Spacer y={2} />

        <Button block loading={isArtworkListDeleting} onPress={deleteArtworkList}>
          Yes, Delete List
        </Button>

        <Spacer y={1} />

        <Button block variant="outline" onPress={closeView}>
          Cancel
        </Button>
      </Flex>
    </AutoHeightBottomSheet>
  )
}
