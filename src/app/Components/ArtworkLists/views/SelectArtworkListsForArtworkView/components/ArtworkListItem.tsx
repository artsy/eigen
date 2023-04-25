import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkListItem_item$key } from "__generated__/ArtworkListItem_item.graphql"
import {
  ArtworkListMode,
  useArtworkListsContext,
} from "app/Components/ArtworkLists/ArtworkListsContext"
import { EntityPreview } from "app/Components/ArtworkLists/components/EntityPreview"
import { extractNodes } from "app/utils/extractNodes"
import { FC } from "react"
import { TouchableOpacity } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkListItemSelectedIcon } from "./ArtworkListItemSelectedIcon"

interface ArtworkListItemProps {
  item: ArtworkListItem_item$key
}

export const ArtworkListItem: FC<ArtworkListItemProps> = (props) => {
  const { state, dispatch } = useArtworkListsContext()
  const artworkList = useFragment(ArtworkListItemFragment, props.item)
  const nodes = extractNodes(artworkList.artworksConnection)
  const imageURL = nodes[0]?.image?.url ?? null

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

  const getArtworksCountText = () => {
    if (artworkList.artworksCount === 1) {
      return `1 Artwork`
    }

    return `${artworkList.artworksCount} Artworks`
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

  return (
    <TouchableOpacity onPress={handleArtworkListPress}>
      <Flex py={1} px={2} flexDirection="row" alignItems="center">
        <Join separator={<Spacer x={1} />}>
          <EntityPreview imageURL={imageURL} />

          <Flex flex={1}>
            <Text variant="xs">{artworkList.name}</Text>
            <Text variant="xs" color="black60">
              {getArtworksCountText()}
            </Text>
          </Flex>

          <ArtworkListItemSelectedIcon selected={isSelected} />
        </Join>
      </Flex>
    </TouchableOpacity>
  )
}

const ArtworkListItemFragment = graphql`
  fragment ArtworkListItem_item on Collection @argumentDefinitions(artworkID: { type: "String!" }) {
    name
    internalID
    isSavedArtwork(artworkID: $artworkID)
    artworksCount(onlyVisible: true)
    artworksConnection(first: 1, sort: SAVED_AT_DESC) {
      edges {
        node {
          image {
            url(version: "square")
          }
        }
      }
    }
  }
`
