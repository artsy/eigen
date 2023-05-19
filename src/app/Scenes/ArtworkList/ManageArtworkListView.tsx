import { Box } from "@artsy/palette-mobile"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutoHeightBottomSheet } from "app/Components/ArtworkLists/components/AutoHeightBottomSheet"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
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
  const bottomOffset = useArtworkListsBottomOffset(2)

  const openDeleteView = () => {
    setIsDeleteViewVisible(true)
  }

  const closeDeleteView = useCallback(() => {
    setIsDeleteViewVisible(false)
  }, [])

  return (
    <>
      <AutoHeightBottomSheet visible onDismiss={onDismiss}>
        <ArtworkListsBottomSheetSectionTitle mt={1}>
          Manage list
        </ArtworkListsBottomSheetSectionTitle>

        <ManageArtworkListMenuItem label="Delete List" onPress={openDeleteView} />

        <Box height={`${bottomOffset}px`} />
      </AutoHeightBottomSheet>

      <DeleteArtworkListView
        visible={isDeleteViewVisible}
        artworkListEntity={artworkListEntity}
        onDismiss={closeDeleteView}
      />
    </>
  )
}
