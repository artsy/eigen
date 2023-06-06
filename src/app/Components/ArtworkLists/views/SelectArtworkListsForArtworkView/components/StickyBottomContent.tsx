import { Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
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
  const { state, addingArtworkListIDs, removingArtworkListIDs } = useArtworkListsContext()
  const bottomOffset = useArtworkListsBottomOffset(2)
  const { dismiss } = useBottomSheetModal()
  const { selectedTotalCount } = state
  const totalCount =
    selectedTotalCount + addingArtworkListIDs.length - removingArtworkListIDs.length

  const { save, inProgress } = useSavePendingArtworkListsChanges({
    onCompleted: () => {
      dismiss(ArtworkListsViewName.SelectArtworkListsForArtwork)
    },
  })

  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <Box bg="white100">
        <Box height={STICKY_BOTTOM_CONTENT_HEIGHT} px={2} pt={2}>
          <Text variant="xs" textAlign="center">
            {getSelectedListsCountText(totalCount)}
          </Text>

          <Spacer y={1} />

          <Button
            width="100%"
            block
            disabled={!state.hasUnsavedChanges}
            loading={inProgress}
            onPress={save}
          >
            Save
          </Button>
        </Box>

        <Box height={bottomOffset} />
      </Box>
    </BottomSheetFooter>
  )
}

const getSelectedListsCountText = (count: number) => {
  if (count === 1) {
    return "1 list selected"
  }

  return `${count} lists selected`
}
