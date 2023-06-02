import { Flex } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutomountedBottomSheetModal } from "app/Components/ArtworkLists/components/AutomountedBottomSheetModal"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { SelectArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtwork"
import { SelectArtworkListsForArtworkFooter } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtworkFooter"
import { SelectArtworkListsForArtworkHeader } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtworkHeader"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"

const SNAP_POINTS = ["50%", "95%"]

export const SelectArtworkListsForArtworkView = () => {
  const { reset } = useArtworkListsContext()
  const bottomOffset = useArtworkListsBottomOffset(2)

  return (
    <AutomountedBottomSheetModal
      visible
      name={ArtworkListsViewName.SelectArtworkListsForArtwork}
      snapPoints={SNAP_POINTS}
      onDismiss={reset}
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
