import { Box, Button } from "@artsy/palette-mobile"
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { useSaveArtworkListsChanges } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useSaveArtworkListsChanges"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { useOnSaveArtwork } from "app/Components/ProgressiveOnboarding/useOnSaveArtwork"
import { FC } from "react"

const STICKY_BOTTOM_CONTENT_HEIGHT = 100

export const StickyBottomContentPlaceholder = () => {
  const bottomOffset = useArtworkListsBottomOffset(2)

  return <Box height={STICKY_BOTTOM_CONTENT_HEIGHT + bottomOffset} />
}

export const SelectArtworkListStickyBottomContent: FC<BottomSheetFooterProps> = ({
  animatedFooterPosition,
}) => {
  const hasUnsavedChanges = ArtworkListsStore.useStoreState(
    (state) => state.state.hasUnsavedChanges
  )
  const { setProfileTabSavedArtwork } = useOnSaveArtwork()
  const { dismiss } = useBottomSheetModal()

  const { save, inProgress } = useSaveArtworkListsChanges({
    onCompleted: () => {
      dismiss(ArtworkListsViewName.SelectArtworkListsForArtwork)
    },
  })

  const handleSave = () => {
    if (hasUnsavedChanges) {
      save()
    } else {
      dismiss(ArtworkListsViewName.SelectArtworkListsForArtwork)
    }
    setProfileTabSavedArtwork()
  }

  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <Box bg="mono0">
        <Box height={STICKY_BOTTOM_CONTENT_HEIGHT} px={2} pt={2}>
          <Button width="100%" block loading={inProgress} onPress={handleSave}>
            Done
          </Button>
        </Box>
      </Box>
    </BottomSheetFooter>
  )
}
