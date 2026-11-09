import { ActionType, ClickedShareButton, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { EditArtworkListView } from "app/Scenes/ArtworkList/views/EditArtworkListView/EditArtworkListView"
import { ShareArtworkListView } from "app/Scenes/ArtworkList/views/ShareArtworkListView/ShareArtworkListView"
import { FC, useCallback, useState } from "react"
import { useTracking } from "react-tracking"
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
  const [isShareViewVisible, setIsShareViewVisible] = useState(false)
  const bottomOffset = useArtworkListsBottomOffset(2)
  const { trackEvent } = useTracking()

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

  const openShareView = () => {
    const event: ClickedShareButton = {
      action: ActionType.clickedShareButton,
      context_module: ContextModule.saves,
      context_owner_type: OwnerType.saves,
      context_owner_id: artworkListEntity.internalID,
      context_owner_slug: artworkListEntity.slug ?? undefined,
    }
    trackEvent(event)
    setIsShareViewVisible(true)
  }

  const closeShareView = useCallback(() => {
    setIsShareViewVisible(false)
  }, [])

  return (
    <>
      <AutoHeightBottomSheet visible onDismiss={onDismiss}>
        <Flex mt={2} mx={2} mb={`${bottomOffset}px`}>
          <Join separator={<Spacer y={2} />}>
            <>
              <ArtworkListsBottomSheetSectionTitle>Manage list</ArtworkListsBottomSheetSectionTitle>
              <Spacer y={1} />
            </>

            <ManageArtworkListMenuItem label="Share List" onPress={openShareView} />
            <ManageArtworkListMenuItem label="Edit List" onPress={openEditView} />
            <ManageArtworkListMenuItem label="Delete List" onPress={openDeleteView} />
          </Join>
        </Flex>
      </AutoHeightBottomSheet>

      <ShareArtworkListView
        visible={isShareViewVisible}
        artworkListEntity={artworkListEntity}
        onDismiss={closeShareView}
      />

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
