import {
  AddIcon,
  Box,
  Button,
  Flex,
  Message,
  Spacer,
  Text,
  quoteLeft,
  quoteRight,
} from "@artsy/palette-mobile"
import { ArtworkListsStore } from "app/Components/ArtworkLists/ArtworkListsStore"

export const SelectArtworkListsForArtworkHeader = () => {
  const setCreateNewArtworkListViewVisible = ArtworkListsStore.useStoreActions(
    (actions) => actions.setCreateNewArtworkListViewVisible
  )
  const {
    selectedTotalCount,
    addingArtworkListIDs,
    removingArtworkListIDs,
    recentlyAddedArtworkList,
  } = ArtworkListsStore.useStoreState((state) => ({
    selectedTotalCount: state.state.selectedTotalCount,
    recentlyAddedArtworkList: state.state.recentlyAddedArtworkList,
    addingArtworkListIDs: state.addingArtworkListIDs,
    removingArtworkListIDs: state.removingArtworkListIDs,
  }))
  const totalCount =
    selectedTotalCount + addingArtworkListIDs.length - removingArtworkListIDs.length

  const openCreateNewArtworkListView = () => {
    setCreateNewArtworkListViewVisible(true)
  }

  return (
    <>
      <Box mx={2} mb={2}>
        <Text>Select where you’d like to save this artwork:</Text>

        <Spacer y={2} />

        <Flex flexDirection="row" justifyContent="space-between">
          <Button
            variant="text"
            size="small"
            onPress={openCreateNewArtworkListView}
            icon={<AddIcon />}
            ml={-1}
            my="auto"
          >
            Create New List
          </Button>

          <Text variant="xs" textAlign="center" color="mono60" my="auto">
            {getSelectedListsCountText(totalCount)}
          </Text>
        </Flex>
      </Box>

      {!!recentlyAddedArtworkList && (
        <Message
          variant="success"
          title="List Created"
          text={`Artwork will be added to ${quoteLeft}${recentlyAddedArtworkList.name}${quoteRight}`}
        />
      )}
    </>
  )
}

const getSelectedListsCountText = (count: number) => {
  if (count === 1) {
    return "1 list selected"
  }

  return `${Math.max(0, count)} lists selected`
}
