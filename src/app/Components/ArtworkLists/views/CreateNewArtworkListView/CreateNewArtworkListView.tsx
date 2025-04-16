import { Flex, Spacer } from "@artsy/palette-mobile"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import { ArtworkListsViewName } from "app/Components/ArtworkLists/views/constants"
import { AutoHeightBottomSheet } from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { CreateNewArtworkListForm } from "./components/CreateNewArtworkListForm"

export const CreateNewArtworkListView = () => {
  const setCreateNewArtworkListViewVisible = ArtworkListsStore.useStoreActions(
    (actions) => actions.setCreateNewArtworkListViewVisible
  )
  const bottomOffset = useArtworkListsBottomOffset(2)

  const closeCurrentView = () => {
    setCreateNewArtworkListViewVisible(false)
  }

  return (
    <AutoHeightBottomSheet
      visible
      name={ArtworkListsViewName.CreateNewArtworkLists}
      onDismiss={closeCurrentView}
    >
      <Flex px={2} mt={2} mb={`${bottomOffset}px`}>
        <ArtworkListsBottomSheetSectionTitle>New list</ArtworkListsBottomSheetSectionTitle>

        <Spacer y={2} />

        <CreateNewArtworkListForm />
      </Flex>
    </AutoHeightBottomSheet>
  )
}
