import { Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { FC } from "react"

interface SelectArtworkListsForArtworkFooterProps {
  onSavePress: () => void
}

export const SelectArtworkListsForArtworkFooter: FC<SelectArtworkListsForArtworkFooterProps> = ({
  onSavePress,
}) => {
  const { state } = useArtworkListsContext()
  const { addingArtworkListIDs, removingArtworkListIDs, selectedArtworkListIDs } = state
  const hasChanges = addingArtworkListIDs.length !== 0 || removingArtworkListIDs.length !== 0

  return (
    <Box p={2}>
      <Text variant="xs" textAlign="center">
        {getSelectedListsCountText(selectedArtworkListIDs.length)}
      </Text>

      <Spacer y={1} />

      <Button width="100%" block disabled={!hasChanges} onPress={onSavePress}>
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
