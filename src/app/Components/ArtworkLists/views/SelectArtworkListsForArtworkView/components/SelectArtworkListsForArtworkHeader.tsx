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
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"

export const SelectArtworkListsForArtworkHeader = () => {
  const { state, dispatch, addingArtworkListIDs, removingArtworkListIDs } = useArtworkListsContext()
  const { selectedTotalCount } = state
  const totalCount =
    selectedTotalCount + addingArtworkListIDs.length - removingArtworkListIDs.length

  const openCreateNewArtworkListView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: true,
    })
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

          <Text variant="xs" textAlign="center" color="black60" my="auto">
            {getSelectedListsCountText(totalCount)}
          </Text>
        </Flex>
      </Box>

      {!!state.recentlyAddedArtworkList && (
        <Message
          variant="success"
          title="List Created"
          text={`Artwork will be added to ${quoteLeft}${state.recentlyAddedArtworkList.name}${quoteRight}`}
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
