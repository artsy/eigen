import { Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkListItem_item$key } from "__generated__/ArtworkListItem_item.graphql"
import { ArtworkListImagePreview } from "app/Components/ArtworkLists/components/ArtworkListImagePreview"
import { extractNodes } from "app/utils/extractNodes"
import { FC, memo } from "react"
import { TouchableOpacity } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkListItemSelectedIcon } from "./ArtworkListItemSelectedIcon"

export interface PressedArtworkListItem {
  internalID: string
  name: string
  isSavedArtwork: boolean
}

interface ArtworkListItemProps {
  item: ArtworkListItem_item$key
  selected: boolean
  onPress: (item: PressedArtworkListItem) => void
}

const Item: FC<ArtworkListItemProps> = (props) => {
  const artworkList = useFragment(ArtworkListItemFragment, props.item)
  const nodes = extractNodes(artworkList.artworksConnection)
  const imageURL = nodes[0]?.image?.resized?.url ?? null

  const getArtworksCountText = () => {
    if (artworkList.artworksCount === 1) {
      return `1 Artwork`
    }

    return `${artworkList.artworksCount} Artworks`
  }

  const handlePress = () => {
    const result: PressedArtworkListItem = {
      internalID: artworkList.internalID,
      name: artworkList.name,
      isSavedArtwork: artworkList.isSavedArtwork,
    }

    props.onPress(result)
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Flex py={1} px={2} flexDirection="row" alignItems="center">
        <Join separator={<Spacer x={1} />}>
          <ArtworkListImagePreview imageURL={imageURL} />

          <Flex flex={1}>
            <Text variant="xs" numberOfLines={1}>
              {artworkList.name}
            </Text>
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

export const ArtworkListItem = memo(Item)

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
