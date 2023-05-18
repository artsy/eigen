import { Box, Flex, Join, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutoHeightBottomSheet } from "app/Components/ArtworkLists/components/AutoHeightBottomSheet"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { noop } from "lodash"
import { FC } from "react"

interface ItemProps {
  label: string
  onPress: () => void
}

const Item: FC<ItemProps> = ({ label, onPress }) => {
  return (
    <Touchable onPress={onPress}>
      <Flex p={2}>
        <Text variant="sm-display">{label}</Text>
      </Flex>
    </Touchable>
  )
}

interface ManageArtworkListViewProps {
  onDismiss: () => void
}

export const ManageArtworkListView: FC<ManageArtworkListViewProps> = ({ onDismiss }) => {
  const bottomOffset = useArtworkListsBottomOffset(2)

  return (
    <AutoHeightBottomSheet visible onDismiss={onDismiss}>
      <ArtworkListsBottomSheetSectionTitle mt={1}>Manage list</ArtworkListsBottomSheetSectionTitle>

      <Join separator={<Separator my={1} />}>
        <Item label="Edit List" onPress={noop} />
        <Item label="Delete List" onPress={noop} />
      </Join>

      <Box height={`${bottomOffset}px`} />
    </AutoHeightBottomSheet>
  )
}
