import { Box, Flex, Join, Separator, Text, Touchable } from "@artsy/palette-mobile"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { AutoHeightBottomSheet } from "app/Components/ArtworkLists/components/AutoHeightBottomSheet"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { DeleteArtworkListView } from "app/Scenes/ArtworkList/views/DeleteArtworkListView/DeleteArtworkListView"
import { noop } from "lodash"
import { FC, useCallback, useState } from "react"

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
  artworkListEntity: HeaderMenuArtworkListEntity
  onDismiss: () => void
}

export const ManageArtworkListView: FC<ManageArtworkListViewProps> = ({
  artworkListEntity,
  onDismiss,
}) => {
  const [isDeleteViewVisible, setIsDeleteViewVisible] = useState(false)
  const bottomOffset = useArtworkListsBottomOffset(2)

  const openDeleteView = () => {
    setIsDeleteViewVisible(true)
  }

  const closeDeleteView = useCallback(() => {
    setIsDeleteViewVisible(false)
  }, [])

  return (
    <>
      <AutoHeightBottomSheet visible onDismiss={onDismiss}>
        <ArtworkListsBottomSheetSectionTitle mt={1}>
          Manage list
        </ArtworkListsBottomSheetSectionTitle>

        <Join separator={<Separator my={1} />}>
          <Item label="Edit List" onPress={noop} />
          <Item label="Delete List" onPress={openDeleteView} />
        </Join>

        <Box height={`${bottomOffset}px`} />
      </AutoHeightBottomSheet>

      <DeleteArtworkListView
        visible={isDeleteViewVisible}
        artworkListEntity={artworkListEntity}
        onDismiss={closeDeleteView}
      />
    </>
  )
}
