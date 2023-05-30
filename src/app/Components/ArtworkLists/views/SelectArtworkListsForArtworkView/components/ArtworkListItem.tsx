import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkListItem_item$key } from "__generated__/ArtworkListItem_item.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkListImagePreview } from "app/Components/ArtworkLists/components/ArtworkListImagePreview"
import { ArtworkListMode } from "app/Components/ArtworkLists/types"
import { extractNodes } from "app/utils/extractNodes"
import { FC, memo, useEffect } from "react"
import { TouchableOpacity } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkListItemSelectedIcon } from "./ArtworkListItemSelectedIcon"

interface ArtworkListItemProps {
  item: ArtworkListItem_item$key
  selected: boolean
}

const Item: FC<ArtworkListItemProps> = (props) => {
  const { dispatch } = useArtworkListsContext()
  const artworkList = useFragment(ArtworkListItemFragment, props.item)
  const nodes = extractNodes(artworkList.artworksConnection)
  const imageURL = nodes[0]?.image?.resized?.url ?? null

  useEffect(() => {
    console.log("[debug] rerender artwork list", artworkList.internalID)
  })

  const handleArtworkListPress = () => {
    const mode = artworkList.isSavedArtwork
      ? ArtworkListMode.RemovingArtworkList
      : ArtworkListMode.AddingArtworkList

    dispatch({
      type: "ADD_OR_REMOVE_ARTWORK_LIST",
      payload: {
        mode,
        artworkList: {
          internalID: artworkList.internalID,
          name: artworkList.name,
        },
      },
    })
  }

  const getArtworksCountText = () => {
    if (artworkList.artworksCount === 1) {
      return `1 Artwork`
    }

    return `${artworkList.artworksCount} Artworks`
  }

  return (
    <TouchableOpacity onPress={handleArtworkListPress}>
      <Flex py={1} px={2} flexDirection="row" alignItems="center">
        <Join separator={<Spacer x={1} />}>
          <ArtworkListImagePreview imageURL={imageURL} />

          <Flex flex={1}>
            <Text variant="xs">{artworkList.name}</Text>
            <Text variant="xs" color="black60">
              {getArtworksCountText()}
            </Text>
          </Flex>

          <ArtworkListItemSelectedIcon selected={props.selected} />
        </Join>
      </Flex>
    </TouchableOpacity>
  )
}

const arePropsEqual = (prevProps: ArtworkListItemProps, nextProps: ArtworkListItemProps) => {
  return prevProps.selected === nextProps.selected
}

export const ArtworkListItem = memo(Item, arePropsEqual)

const ArtworkListItemFragment = graphql`
  fragment ArtworkListItem_item on Collection @argumentDefinitions(artworkID: { type: "String!" }) {
    name
    internalID
    isSavedArtwork(artworkID: $artworkID)
    artworksCount(onlyVisible: true)
    artworksConnection(first: 4) {
      edges {
        node {
          image {
            resized(height: 300, width: 300, version: "normalized") {
              url
            }
          }
        }
      }
    }
  }
`
