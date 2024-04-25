import { Flex } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import {
  SelectArtworkListStickyBottomContent,
  StickyBottomContentPlaceholder,
} from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListStickyBottomContent"
import { SelectArtworkListsForArtwork } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtwork"
import { SelectArtworkListsForArtworkHeader } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/components/SelectArtworkListsForArtworkHeader"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"

const SNAP_POINTS = ["50%", "95%"]

export const SelectArtworkListsForArtworkView = () => {
  const { reset } = useArtworkListsContext()

  return (
    <AutomountedBottomSheetModal
      visible
      name={ArtworkListsViewName.SelectArtworkListsForArtwork}
      snapPoints={SNAP_POINTS}
      onDismiss={reset}
      footerComponent={SelectArtworkListStickyBottomContent}
    >
      <SelectArtworkListsForArtworkHeader />

      <Flex flex={1} overflow="hidden">
        <SelectArtworkListsForArtwork />
      </Flex>

      <StickyBottomContentPlaceholder />
    </AutomountedBottomSheetModal>
  )
}
