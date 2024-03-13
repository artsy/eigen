import { Box, Join, Separator } from "@artsy/palette-mobile"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { EditArtworkListView } from "app/Scenes/ArtworkList/views/EditArtworkListView/EditArtworkListView"
import { FC, useCallback, useState } from "react"
import { ManageArtworkListMenuItem } from "./ManageArtworkListMenuItem"
import { DeleteArtworkListView } from "./views/DeleteArtworkListView/DeleteArtworkListView"

interface ManageArtworkListViewProps {
  artworkListEntity: HeaderMenuArtworkListEntity
  onDismiss: () => void
}

export const ManageArtworkListView: FC<ManageArtworkListViewProps> = ({
  artworkListEntity,
  onDismiss,
}) => {
  const [isDeleteViewVisible, setIsDeleteViewVisible] = useState(false)
  const [isEditViewVisible, setIsEditViewVisible] = useState(false)
  const bottomOffset = useArtworkListsBottomOffset(2)

  const openDeleteView = () => {
    setIsDeleteViewVisible(true)
  }

  const closeDeleteView = useCallback(() => {
    setIsDeleteViewVisible(false)
  }, [])

  const openEditView = () => {
    setIsEditViewVisible(true)
  }

  const closeEditView = useCallback(() => {
    setIsEditViewVisible(false)
  }, [])

  return (
    <>
      <AutoHeightBottomSheet visible onDismiss={onDismiss}>
        <ArtworkListsBottomSheetSectionTitle mt={1}>
          Manage list
        </ArtworkListsBottomSheetSectionTitle>

        <Join separator={<Separator my={1} />}>
          <ManageArtworkListMenuItem label="Edit List" onPress={openEditView} />
          <ManageArtworkListMenuItem label="Delete List" onPress={openDeleteView} />
        </Join>

        <Box height={`${bottomOffset}px`} />
      </AutoHeightBottomSheet>

      <DeleteArtworkListView
        visible={isDeleteViewVisible}
        artworkListEntity={artworkListEntity}
        onDismiss={closeDeleteView}
      />

      <EditArtworkListView
        visible={isEditViewVisible}
        artworkListEntity={artworkListEntity}
        onDismiss={closeEditView}
      />
    </>
  )
}
