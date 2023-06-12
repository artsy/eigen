import { Box, BoxProps, Button, Spacer, Text } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { useSavePendingArtworkListsChanges } from "app/Components/ArtworkLists/views/SelectArtworkListsForArtworkView/useSavePendingArtworkListsChanges"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { FC } from "react"

export const SelectArtworkListsForArtworkFooter: FC<BoxProps> = (props) => {
  const { state, addingArtworkListIDs, removingArtworkListIDs } = useArtworkListsContext()
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
    <Box {...props}>
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
  )
}

const getSelectedListsCountText = (count: number) => {
  if (count === 1) {
    return "1 list selected"
  }

  return `${count} lists selected`
}
