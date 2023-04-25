import { CheckCircleIcon, Flex, Text } from "@artsy/palette-mobile"
import { ArtworkListItem_item$key } from "__generated__/ArtworkListItem_item.graphql"
import {
  ArtworkListMode,
  useArtworkListsContext,
} from "app/Components/ArtworkLists/ArtworkListsContext"
import { FC } from "react"
import { TouchableOpacity } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface ArtworkListItemProps {
  item: ArtworkListItem_item$key
}

const ICON_SIZE = 24

export const ArtworkListItem: FC<ArtworkListItemProps> = (props) => {
  const { state, dispatch } = useArtworkListsContext()
  const artworkList = useFragment(ArtworkListItemFragment, props.item)

  const handleArtworkListPress = () => {
    const mode = artworkList.isSavedArtwork
      ? ArtworkListMode.RemovingArtworkListIDs
      : ArtworkListMode.AddingArtworkListIDs

    dispatch({
      type: "ADD_OR_REMOVE_ARTWORK_LIST_ID",
      payload: {
        artworkListID: artworkList.internalID,
        mode,
      },
    })
  }

  const checkIsArtworkListSelected = () => {
    /**
     * User added artwork to the previously unselected artwork list
     * So we have to display the artwork list as *selected*
     */
    if (state.addingArtworkListIDs.includes(artworkList.internalID)) {
      return true
    }

    /**
     * User deleted artwork from the previously selected artwork list
     * So we have to display the artwork list as *unselected*
     */
    if (state.removingArtworkListIDs.includes(artworkList.internalID)) {
      return false
    }

    return artworkList.isSavedArtwork
  }

  const isSelected = checkIsArtworkListSelected()

  // TODO: Add icon for unselected state
  return (
    <TouchableOpacity onPress={handleArtworkListPress}>
      <Flex p={1} flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text>{artworkList.name}</Text>
        {isSelected && (
          <CheckCircleIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            accessibilityState={{ selected: isSelected }}
          />
        )}
      </Flex>
    </TouchableOpacity>
  )
}

const ArtworkListItemFragment = graphql`
  fragment ArtworkListItem_item on Collection @argumentDefinitions(artworkID: { type: "String!" }) {
    name
    internalID
    isSavedArtwork(artworkID: $artworkID)
  }
`
