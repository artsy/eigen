import { Box, Button } from "@artsy/palette-mobile"
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { useSavePendingArtworkListsChanges } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useSavePendingArtworkListsChanges"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { FC } from "react"

const STICKY_BOTTOM_CONTENT_HEIGHT = 100

export const StickyBottomContentPlaceholder = () => {
  const bottomOffset = useArtworkListsBottomOffset(2)

  return <Box height={STICKY_BOTTOM_CONTENT_HEIGHT + bottomOffset} />
}

export const StickyBottomContent: FC<BottomSheetFooterProps> = ({ animatedFooterPosition }) => {
  const { dismiss } = useBottomSheetModal()

  const { save, inProgress } = useSavePendingArtworkListsChanges({
    onCompleted: () => {
      dismiss(ArtworkListsViewName.SelectArtworkListsForArtwork)
    },
  })

  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <Box bg="white100">
        <Box height={STICKY_BOTTOM_CONTENT_HEIGHT} px={2} pt={2}>
          <Button width="100%" block loading={inProgress} onPress={save}>
            Done
          </Button>
        </Box>
      </Box>
    </BottomSheetFooter>
  )
}
