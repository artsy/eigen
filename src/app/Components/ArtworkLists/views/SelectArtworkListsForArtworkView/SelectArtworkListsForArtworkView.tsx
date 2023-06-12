import { Flex } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { SelectArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtwork"
import { SelectArtworkListsForArtworkFooter } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtworkFooter"
import { SelectArtworkListsForArtworkHeader } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtworkHeader"
import { useSavePendingArtworkListsChanges } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useSavePendingArtworkListsChanges"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { useCallback } from "react"

const SNAP_POINTS = ["50%", "95%"]

export const SelectArtworkListsForArtworkView = () => {
  const { state, reset } = useArtworkListsContext()
  const bottomOffset = useArtworkListsBottomOffset(2)
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
    >
      <ArtworkListsBottomSheetSectionTitle mt={1}>
        Select lists for this artwork
      </ArtworkListsBottomSheetSectionTitle>

      <SelectArtworkListsForArtworkHeader />

      <Flex flex={1} overflow="hidden">
        <SelectArtworkListsForArtwork />
      </Flex>

      <SelectArtworkListsForArtworkFooter p={2} pb={`${bottomOffset}px`} />
    </AutomountedBottomSheetModal>
  )
}
