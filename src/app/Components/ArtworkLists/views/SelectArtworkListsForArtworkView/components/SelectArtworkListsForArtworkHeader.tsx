import { Box, Button, Message, Spacer, quoteLeft, quoteRight } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkInfo } from "app/Components/ArtworkLists/components/ArtworkInfo"

export const SelectArtworkListsForArtworkHeader = () => {
  const { state, dispatch } = useArtworkListsContext()

  const openCreateNewArtworkListView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: true,
    })
  }

  return (
    <>
      <Box m={2}>
        <ArtworkInfo artwork={state.artwork!} />

        <Spacer y={2} />

        <Button
          variant="outline"
          size="small"
          width="100%"
          block
          onPress={openCreateNewArtworkListView}
        >
          Create New List
        </Button>
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
