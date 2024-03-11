import { Flex } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { EditArtworkListsPrivacy } from "app/Components/ArtworkLists/views/EditArtworkListsPrivacyView/components/EditArtworkListsPrivacy"
import { EditArtworkListsPrivacyHeader } from "app/Components/ArtworkLists/views/EditArtworkListsPrivacyView/components/EditArtworkListsPrivacyHeader"
import { EditArtworkListsPrivacyStickyBottomContent } from "app/Components/ArtworkLists/views/EditArtworkListsPrivacyView/components/EditArtworkListsPrivacyStickyBottomContent"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"

const SNAP_POINTS = ["50%", "95%"]

export const EditArtworkListsPrivacyView = () => {
  const { reset } = useArtworkListsContext()

  return (
    <AutomountedBottomSheetModal
      visible
      name={ArtworkListsViewName.EditArtworkListsPrivacy}
      snapPoints={SNAP_POINTS}
      onDismiss={reset}
      footerComponent={EditArtworkListsPrivacyStickyBottomContent}
    >
      <EditArtworkListsPrivacyHeader />

      <Flex flex={1} overflow="hidden">
        <EditArtworkListsPrivacy />
      </Flex>
    </AutomountedBottomSheetModal>
  )
}
