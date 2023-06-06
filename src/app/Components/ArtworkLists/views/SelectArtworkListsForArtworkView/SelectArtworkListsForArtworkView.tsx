import { Flex } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { SelectArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtwork"
import { SelectArtworkListsForArtworkHeader } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtworkHeader"
import {
  StickyBottomContent,
  StickyBottomContentPlaceholder,
} from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/StickyBottomContent"
import { useSavePendingArtworkListsChanges } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useSavePendingArtworkListsChanges"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { useCallback } from "react"

const SNAP_POINTS = ["60%", "95%"]

export const SelectArtworkListsForArtworkView = () => {
  const { state, reset } = useArtworkListsContext()
  const { save } = useSavePendingArtworkListsChanges()
  const hasUnsavedChanges = state.hasUnsavedChanges

  const onDismiss = useCallback(() => {
    if (hasUnsavedChanges) {
      save()
    }

    reset()
  }, [hasUnsavedChanges, save, reset])

  return (
    <AutomountedBottomSheetModal
      visible
      name={ArtworkListsViewName.SelectArtworkListsForArtwork}
      snapPoints={SNAP_POINTS}
      onDismiss={onDismiss}
      footerComponent={StickyBottomContent}
    >
      <ArtworkListsBottomSheetSectionTitle mt={1}>
        Select lists for this artwork
      </ArtworkListsBottomSheetSectionTitle>

      <SelectArtworkListsForArtworkHeader />

      <Flex flex={1} overflow="hidden">
        <SelectArtworkListsForArtwork />
      </Flex>

      <StickyBottomContentPlaceholder />
    </AutomountedBottomSheetModal>
  )
}
